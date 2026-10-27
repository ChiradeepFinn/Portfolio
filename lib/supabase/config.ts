/**
 * Supabase credential resolution.
 *
 * The URL and anon key are public by design - row level security is the actual
 * boundary. The service role key bypasses RLS and is read only inside server
 * code (route handlers), never in a component that can reach the browser.
 *
 * Server callers go through `lib/env.ts` so an empty string or a malformed URL
 * is treated as unset. Browser code must not import this file for secrets; the
 * public helpers below only expose what RLS already treats as public.
 */

import { env } from '@/lib/env';

export function getPublicSupabaseConfig(): { url: string; anonKey: string } | null {
  const config = env();
  const url = config.NEXT_PUBLIC_SUPABASE_URL;
  // Newer projects call this the publishable key. The legacy anon key still
  // works. Neither key may bypass row level security.
  const anonKey = config.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? config.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

export function getServiceSupabaseConfig(): { url: string; serviceKey: string } | null {
  const config = env();
  const url = config.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = config.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return { url, serviceKey };
}

export const isSupabaseConfigured = () => getPublicSupabaseConfig() !== null;
