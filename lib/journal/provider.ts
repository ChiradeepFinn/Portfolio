/**
 * Which sign-in may leave a note.
 * Reads `app_metadata` only. `user_metadata` is editable by the account and
 * must not decide access.
 */

export type JournalProvider = 'google' | 'github';

export function journalProvider(appMetadata: unknown): JournalProvider | null {
  if (!appMetadata || typeof appMetadata !== 'object' || Array.isArray(appMetadata)) return null;
  const record = appMetadata as Record<string, unknown>;
  const current = record.provider;
  if (current === 'google' || current === 'github') return current;

  const providers = record.providers;
  if (!Array.isArray(providers)) return null;
  if (providers.includes('github')) return 'github';
  if (providers.includes('google')) return 'google';
  return null;
}
