/**
 * Supabase credential resolution.
 *
 * The URL and anon key are public by design - row level security is the actual
 * boundary. The service role key bypasses RLS and is read only inside server
 * code (route handlers), never in a component that can reach the browser.
 */

function nonempty(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function getPublicSupabaseConfig(): { url: string; anonKey: string } | null {
  const url = nonempty(process.env.NEXT_PUBLIC_SUPABASE_URL);
  // Newer projects call this the publishable key. The legacy anon key still
  // works. Neither key may bypass row level security.
  const anonKey =
    nonempty(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ??
    nonempty(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

export function getServiceSupabaseConfig(): { url: string; serviceKey: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return { url, serviceKey };
}

export const isSupabaseConfigured = () => getPublicSupabaseConfig() !== null;
