import { env } from '@/lib/env';

/**
 * Optional Discord ping for a successful contact message.
 *
 * Off unless `DISCORD_WEBHOOK_URL` is set, and the URL is checked in `lib/env.ts`
 * before it is used. The notification is a side effect of an operation that has
 * already succeeded, so this function never throws and never rejects: a webhook
 * that is down, slow, or misconfigured cannot turn a delivered email into an
 * error for the sender.
 *
 * The message body is not sent and not logged. Discord gets the fact that a
 * message arrived and who to reply to; the message itself is in the inbox.
 */
const TIMEOUT_MS = 2500;

export async function notifyContact(summary: {
  readonly name: string;
  readonly email: string;
  readonly subject: string;
}): Promise<void> {
  const webhook = env().DISCORD_WEBHOOK_URL;
  if (!webhook) return;

  const content = [
    '**Contact form**',
    `From: ${redactForChat(summary.name)} <${redactForChat(summary.email)}>`,
    `Subject: ${redactForChat(summary.subject)}`,
    'The message itself is in the inbox.',
  ].join('\n');

  try {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, allowed_mentions: { parse: [] } }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) console.error(`[discord] webhook rejected with ${response.status}`);
  } catch {
    console.error('[discord] webhook did not answer');
  }
}

/** Keeps a name out of Discord markdown and off the mention path. */
function redactForChat(value: string): string {
  return value.replace(/[`*_~|@<>\r\n]/g, ' ').trim().slice(0, 120);
}
