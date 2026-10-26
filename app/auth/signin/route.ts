import { NextResponse } from 'next/server';
import { rateLimitKey } from '@/lib/contact/client-key';
import { oauthHandoffResponse } from '@/lib/http/oauth-handoff';
import { allowsMutation, requestOrigin } from '@/lib/http/origin';
import { journalRateLimit } from '@/lib/journal/rate-limit';
import { getPublicSupabaseConfig } from '@/lib/supabase/config';
import { createSessionClient } from '@/lib/supabase/session';

export const runtime = 'nodejs';

const PROVIDERS = new Set(['google', 'github']);

type Notice = 'auth' | 'rate' | 'closed';

function privateRedirect(origin: string, path: string) {
  const response = NextResponse.redirect(new URL(path, origin), 303);
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}

/** The tray posts with fetch and navigates itself; a plain form cannot. */
function wantsJson(request: Request): boolean {
  return (request.headers.get('accept') ?? '').includes('application/json');
}

function noticeJson(notice: Notice, status: number) {
  return NextResponse.json(
    { ok: false, notice },
    { status, headers: { 'Cache-Control': 'private, no-store' } },
  );
}

export async function POST(request: Request) {
  if (!allowsMutation(request)) {
    return NextResponse.json(
      { error: 'That request was rejected.' },
      { status: 403, headers: { 'Cache-Control': 'private, no-store' } },
    );
  }

  const origin = requestOrigin(request);
  if (!origin) {
    return NextResponse.json(
      { error: 'Sign-in is not configured on this copy of the site.' },
      { status: 503, headers: { 'Cache-Control': 'private, no-store' } },
    );
  }
  const json = wantsJson(request);
  const fail = (notice: Notice, status = 400) =>
    json ? noticeJson(notice, status) : privateRedirect(origin, `/journal?notice=${notice}`);

  if (!getPublicSupabaseConfig()) return fail('closed', 503);

  const limit = journalRateLimit(`auth:${rateLimitKey(request)}`);
  if (!limit.allowed) return fail('rate', 429);

  let provider: FormDataEntryValue | null;
  try {
    provider = (await request.formData()).get('provider');
  } catch {
    return fail('auth');
  }

  if (typeof provider !== 'string' || !PROVIDERS.has(provider)) {
    return fail('auth');
  }

  const supabase = await createSessionClient();
  if (!supabase) return fail('auth', 503);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as 'google' | 'github',
    options: {
      redirectTo: `${origin}/auth/callback`,
      skipBrowserRedirect: true,
    },
  });

  if (error || !data.url || !isProjectAuthorizeUrl(data.url)) {
    console.error('[journal] oauth start failed');
    return fail('auth', 502);
  }

  // The PKCE cookies ride on this response either way; only the hop differs.
  if (json) {
    return NextResponse.json(
      { ok: true, url: data.url },
      { headers: { 'Cache-Control': 'private, no-store' } },
    );
  }

  // Do not 303 to Supabase: Chrome blocks that hop under form-action 'self'.
  return oauthHandoffResponse(data.url);
}

function isProjectAuthorizeUrl(value: string): boolean {
  const config = getPublicSupabaseConfig();
  if (!config) return false;

  try {
    const project = new URL(config.url);
    const destination = new URL(value);
    if (destination.protocol !== 'https:') return false;
    if (destination.hostname !== project.hostname) return false;
    return destination.pathname === '/auth/v1/authorize';
  } catch {
    return false;
  }
}
