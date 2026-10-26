import { NextResponse } from 'next/server';
import { requestOrigin } from '@/lib/http/origin';
import { createSessionClient } from '@/lib/supabase/session';

export const runtime = 'nodejs';

function safeAuthCode(value: string | null | undefined): string | null {
  if (!value || !/^[a-z0-9_]{1,64}$/i.test(value)) return null;
  return value;
}

function privateRedirect(origin: string, path: string) {
  const response = NextResponse.redirect(new URL(path, origin));
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}

export async function GET(request: Request) {
  const origin = requestOrigin(request);
  if (!origin) {
    return new NextResponse('Sign-in is not configured on this copy of the site.', {
      status: 503,
      headers: { 'Cache-Control': 'private, no-store' },
    });
  }

  const failed = privateRedirect(origin, '/journal?notice=auth');
  const url = new URL(request.url);
  const providerError = safeAuthCode(url.searchParams.get('error') ?? url.searchParams.get('error_code'));
  if (providerError) {
    console.error('[journal] oauth callback rejected', providerError);
    return failed;
  }

  const code = url.searchParams.get('code');
  if (!code || code.length > 2048) return failed;

  const supabase = await createSessionClient();
  if (!supabase) return failed;

  const flowId = safeAuthCode(url.searchParams.get('sb_flow_id'));
  const { error } = await supabase.auth.exchangeCodeForSession(code, flowId ? { flowId } : undefined);
  if (error) {
    console.error('[journal] oauth callback failed', safeAuthCode(error.code) ?? 'exchange');
    return failed;
  }

  return privateRedirect(origin, '/journal');
}
