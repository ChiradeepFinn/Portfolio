import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { supabaseCookieOptions } from './cookies';
import { getPublicSupabaseConfig } from './config';

/**
 * Refreshes the journal session on the routes that need it.
 * Other pages do not run this, so a missing login does not touch the rest of the site.
 */
export async function updateSession(request: NextRequest) {
  const config = getPublicSupabaseConfig();
  if (!config) return NextResponse.next({ request });

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(config.url, config.anonKey, {
    cookieOptions: supabaseCookieOptions(),
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        Object.entries(headers).forEach(([key, value]) => supabaseResponse.headers.set(key, value));
      },
    },
  });

  // Nothing else belongs between creating the client and verifying the token.
  try {
    await supabase.auth.getClaims();
  } catch {
    console.error('[journal] session refresh failed');
  }

  return supabaseResponse;
}
