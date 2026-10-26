import { NextResponse } from 'next/server';
import { allowsMutation } from '@/lib/http/origin';
import { rateLimitKey } from '@/lib/contact/client-key';
import { journalActorKey, journalRateLimit } from '@/lib/journal/rate-limit';
import { removeGuestNote, replaceGuestNote, submitGuestNote, verifiedJournalUser } from '@/lib/journal/notes';
import { honeypotTripped, MAX_BODY_BYTES, parseJournalPayload } from '@/lib/journal/validate';

export const runtime = 'nodejs';

const PRIVATE = { 'Cache-Control': 'private, no-store' };

function errorResponse(error: string, status: number, headers?: HeadersInit) {
  return NextResponse.json({ error }, { status, headers: { ...PRIVATE, ...headers } });
}

function rateLimited(prefix: string, request: Request) {
  const limit = journalRateLimit(`${prefix}:${rateLimitKey(request)}`);
  if (limit.allowed) return null;
  if (limit.unavailable) {
    return errorResponse('The journal is temporarily unavailable. Please try again shortly.', 503);
  }
  return errorResponse('Too many attempts. Please wait a few minutes and try again.', 429, {
    'Retry-After': String(limit.retryAfterSeconds),
  });
}

async function readBody(request: Request): Promise<{ ok: true; value: unknown } | { ok: false; response: NextResponse }> {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return { ok: false, response: errorResponse('Send the note as JSON.', 415) };
  }

  const declaredLength = Number(request.headers.get('content-length') ?? '0');
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return { ok: false, response: errorResponse('That note is too large.', 413) };
  }

  let text: string;
  try {
    text = await request.text();
  } catch {
    return { ok: false, response: errorResponse('The note could not be read.', 400) };
  }
  if (text.length > MAX_BODY_BYTES) {
    return { ok: false, response: errorResponse('That note is too large.', 413) };
  }

  try {
    return { ok: true, value: JSON.parse(text) as unknown };
  } catch {
    return { ok: false, response: errorResponse('The note could not be read.', 400) };
  }
}

async function publish(request: Request, mode: 'create' | 'replace') {
  if (!allowsMutation(request)) return errorResponse('That request was rejected.', 403);

  const limited = rateLimited(mode, request);
  if (limited) return limited;

  const body = await readBody(request);
  if (!body.ok) return body.response;

  if (honeypotTripped(body.value)) {
    console.error('[journal] honeypot rejected');
    return errorResponse('The note could not be published.', 400);
  }

  const parsed = parseJournalPayload(body.value);
  if (!parsed.ok) return errorResponse(parsed.error, 400);
  if (parsed.honeypot) return errorResponse('The note could not be published.', 400);

  const user = await verifiedJournalUser();
  if (!user.ok) return errorResponse(user.error, user.status);

  const actor = journalRateLimit(journalActorKey(user.userId));
  if (!actor.allowed) {
    if (actor.unavailable) {
      return errorResponse('The journal is temporarily unavailable. Please try again shortly.', 503);
    }
    return errorResponse('Too many attempts. Please wait a few minutes and try again.', 429, {
      'Retry-After': String(actor.retryAfterSeconds),
    });
  }

  const result = mode === 'create' ? await submitGuestNote(parsed.value) : await replaceGuestNote(parsed.value);
  if (!result.ok) return errorResponse(result.error, result.status);
  return NextResponse.json({ ok: true }, { headers: PRIVATE });
}

export function POST(request: Request) {
  return publish(request, 'create');
}

export function PATCH(request: Request) {
  return publish(request, 'replace');
}

export async function DELETE(request: Request) {
  if (!allowsMutation(request)) return errorResponse('That request was rejected.', 403);

  const limited = rateLimited('delete', request);
  if (limited) return limited;

  const user = await verifiedJournalUser();
  if (!user.ok) return errorResponse(user.error, user.status);

  const actor = journalRateLimit(journalActorKey(user.userId));
  if (!actor.allowed) {
    return errorResponse(
      actor.unavailable
        ? 'The journal is temporarily unavailable. Please try again shortly.'
        : 'Too many attempts. Please wait a few minutes and try again.',
      actor.unavailable ? 503 : 429,
      actor.unavailable ? undefined : { 'Retry-After': String(actor.retryAfterSeconds) },
    );
  }

  const result = await removeGuestNote();
  if (!result.ok) return errorResponse(result.error, result.status);
  return NextResponse.json({ ok: true }, { headers: PRIVATE });
}
