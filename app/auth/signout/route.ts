import { NextResponse } from 'next/server';
import { allowsMutation, requestOrigin } from '@/lib/http/origin';
import { createSessionClient } from '@/lib/supabase/session';

export const runtime = 'nodejs';

function privateRedirect(origin: string, path: string) {
  const response = NextResponse.redirect(new URL(path, origin), 303);
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
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
      { error: 'Sign-out is not configured on this copy of the site.' },
      { status: 503, headers: { 'Cache-Control': 'private, no-store' } },
    );
  }

  const supabase = await createSessionClient();
  if (!supabase) return privateRedirect(origin, '/journal?notice=signout');

  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('[journal] sign-out failed');
    return privateRedirect(origin, '/journal?notice=signout');
  }

  return privateRedirect(origin, '/journal');
}
