import 'server-only';

import { getAdminClient } from '@/lib/supabase/admin';
import type { ContactSubmission } from '@/lib/types';

const DEDUPE_WINDOW_MS = 10 * 60 * 1000;

/**
 * A recent identical row means a previous request already stored the message
 * after email delivery. The caller should not send a second email.
 * If the lookup fails, delivery still proceeds.
 */
export async function hasRecentDuplicate(submission: ContactSubmission): Promise<boolean> {
  const supabase = getAdminClient();
  if (!supabase) return false;

  const since = new Date(Date.now() - DEDUPE_WINDOW_MS).toISOString();
  const existing = await supabase
    .from('contact_messages')
    .select('id')
    .eq('email', submission.email)
    .eq('subject', submission.subject)
    .eq('message', submission.message)
    .gte('created_at', since)
    .limit(1);

  if (existing.error) {
    console.error('[contact] duplicate lookup failed');
    return false;
  }
  return Boolean(existing.data && existing.data.length > 0);
}

/** Best-effort write. Email success does not depend on this. */
export async function storeContact(submission: ContactSubmission): Promise<boolean> {
  const supabase = getAdminClient();
  if (!supabase) return false;

  const inserted = await supabase.from('contact_messages').insert({
    name: submission.name,
    email: submission.email,
    subject: submission.subject,
    message: submission.message,
  });

  if (inserted.error) {
    console.error('[contact] could not store message');
    return false;
  }
  return true;
}
