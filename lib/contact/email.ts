import { hasHeaderBreak } from './validate';
import type { ContactSubmission } from '@/lib/types';

export interface OutboundContactEmail {
  readonly from: string;
  readonly to: string;
  readonly replyTo: string;
  readonly subject: string;
  readonly html: string;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Only the mail headers this builder reads. Accepts the full typed `env()` object. */
type ContactMailEnv = {
  readonly RESEND_FROM_EMAIL?: string;
  readonly CONTACT_TO_EMAIL?: string;
};

export function buildContactEmail(
  submission: ContactSubmission,
  env?: ContactMailEnv,
): OutboundContactEmail | { readonly error: string } {
  const source = env ?? process.env;
  const from = (source.RESEND_FROM_EMAIL ?? 'Chiradeep Portfolio <onboarding@resend.dev>').trim();
  const to = (source.CONTACT_TO_EMAIL ?? 'softwarechiradeep@gmail.com').trim();

  if (hasHeaderBreak(from) || hasHeaderBreak(to) || hasHeaderBreak(submission.email) || hasHeaderBreak(submission.subject)) {
    return { error: 'Email headers are not usable.' };
  }

  return {
    from,
    to,
    replyTo: submission.email,
    subject: `Portfolio - ${submission.subject}`,
    html: `
      <p><strong>Name:</strong> ${escapeHtml(submission.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(submission.email)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(submission.subject)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(submission.message).replace(/\n/g, '<br/>')}</p>
    `,
  };
}
