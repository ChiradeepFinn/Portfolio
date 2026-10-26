import type { CookieOptionsWithName } from '@supabase/ssr';

/**
 * Session cookies for the guest journal.
 *
 * httpOnly keeps the tokens out of page scripts. The server reads them on the
 * journal and auth routes. SameSite=Lax means a form post from another site
 * does not include the session. Secure is on only in production so local http
 * can still sign in.
 */
export function supabaseCookieOptions(
  env: { readonly NODE_ENV?: string } = process.env,
): CookieOptionsWithName {
  return {
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
  };
}
