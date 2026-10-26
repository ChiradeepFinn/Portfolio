import 'server-only';

import { createServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { supabaseCookieOptions } from './cookies';
import { getPublicSupabaseConfig } from './config';

/**
 * Per-request client that carries the visitor's session.
 * Create a new one for every request. Do not cache it.
 * The anon (or publishable) key is still the key: row level security applies.
 */
export async function createSessionClient(): Promise<SupabaseClient | null> {
  const config = getPublicSupabaseConfig();
  if (!config) return null;

  const cookieStore = await cookies();

  return createServerClient(config.url, config.anonKey, {
    cookieOptions: supabaseCookieOptions(),
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies. The proxy refreshes them.
        }
      },
    },
  });
}
