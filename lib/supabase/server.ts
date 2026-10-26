import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getPublicSupabaseConfig } from './config';

let cached: SupabaseClient | null = null;

/**
 * Read-only client for server components. It uses the anon key, so it can only
 * ever see rows that row level security marks as published.
 */
export function getReadClient(): SupabaseClient | null {
  if (cached) return cached;

  const config = getPublicSupabaseConfig();
  if (!config) return null;

  cached = createClient(config.url, config.anonKey, {
    auth: { persistSession: false },
  });
  return cached;
}
