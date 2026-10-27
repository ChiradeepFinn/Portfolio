import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { allowsMutation } from '@/lib/http/origin';
import { rateLimitKey } from '@/lib/contact/client-key';
import { buildContactEmail } from '@/lib/contact/email';
import { contactIdempotency, contactIdempotencyKey, type DeliveryResult } from '@/lib/contact/idempotency';
import { hasRecentDuplicate, storeContact } from '@/lib/contact/persist';
import { contactRateLimitStore, decideRateLimit } from '@/lib/contact/rate-limit';
import { MAX_BODY_BYTES, parseContactPayload } from '@/lib/contact/validate';
import { env } from '@/lib/env';
import { notifyContact } from '@/lib/notify/discord';

export const runtime = 'nodejs';

/**
 * Success means Resend accepted the email.
 * Saving the row in Supabase is best-effort and is not required for success.
 * A missing API key is a configuration error, even if the row was not written.
 */

function errorResponse(error: string, status: number, headers?: HeadersInit) {
  return NextResponse.json({ error }, { status, headers });
}

export async function POST(request: Request) {
  if (!allowsMutation(request)) return errorResponse('That request was rejected.', 403);

  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return errorResponse('Send the form as JSON.', 415);
  }

  const declaredLength = Number(request.headers.get('content-length') ?? '0');
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return errorResponse('That message is too large.', 413);
  }

  let text: string;
  try {
    text = await request.text();
  } catch {
    return errorResponse('Malformed request.', 400);
  }
  if (text.length > MAX_BODY_BYTES) {
    return errorResponse('That message is too large.', 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(text) as unknown;
  } catch {
    return errorResponse('Malformed request.', 400);
  }

  const limit = decideRateLimit(contactRateLimitStore, rateLimitKey(request));
  if (!limit.allowed) {
    if (limit.unavailable) {
      return errorResponse('The form is temporarily unavailable. Please try again shortly.', 503);
    }
    return errorResponse('Too many messages. Please wait a few minutes and try again.', 429, {
      'Retry-After': String(limit.retryAfterSeconds),
    });
  }

  const parsed = parseContactPayload(body);
  if (!parsed.ok) return errorResponse(parsed.error, 400);
  if (parsed.honeypot) {
    console.error('[contact] honeypot rejected');
    return NextResponse.json({ success: true });
  }

  const submission = parsed.value;
  return contactIdempotency.run(
    contactIdempotencyKey(submission),
    () => deliver(submission),
    (result) => result.success,
  ).then((result) => {
    if (result.success) return NextResponse.json({ success: true });
    return errorResponse(result.error, result.status);
  });
}

async function deliver(submission: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<DeliveryResult> {
  const apiKey = env().RESEND_API_KEY;
  if (!apiKey) {
    console.error('[contact] RESEND_API_KEY is not set; no email was sent.');
    return {
      success: false,
      error: 'Email delivery is not configured yet. Please reach out directly for now.',
      status: 503,
    };
  }

  if (await hasRecentDuplicate(submission)) {
    return { success: true };
  }

  const email = buildContactEmail(submission, env());
  if ('error' in email) {
    console.error('[contact] email headers rejected');
    return { success: false, error: 'Your message could not be sent. Please try again.', status: 400 };
  }

  try {
    const resend = new Resend(apiKey);
    const sent = await resend.emails.send({
      from: email.from,
      to: [email.to],
      reply_to: email.replyTo,
      subject: email.subject,
      html: email.html,
    });
    if (sent.error) {
      console.error('[contact] delivery rejected');
      return { success: false, error: 'Your message could not be sent. Please try again.', status: 502 };
    }
  } catch {
    console.error('[contact] delivery failed');
    return { success: false, error: 'Your message could not be sent. Please try again.', status: 502 };
  }

  await storeContact(submission);
  // Both are after delivery and neither can fail the response: the email is sent.
  await notifyContact({ name: submission.name, email: submission.email, subject: submission.subject });
  return { success: true };
}
