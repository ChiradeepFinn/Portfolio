import 'server-only';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getServiceSupabaseConfig } from './config';

let cached: SupabaseClient | null = null;

/**
 * Service-role client. It bypasses row level security, so it exists only to
 * insert contact messages from the API route. The `server-only` import makes
 * bundling this into client code a build error rather than a silent leak.
 */
export function getAdminClient(): SupabaseClient | null {
  if (cached) return cached;

  const config = getServiceSupabaseConfig();
  if (!config) return null;

  cached = createClient(config.url, config.serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
