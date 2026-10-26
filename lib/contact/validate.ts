import { z } from 'zod';
import type { ContactSubmission } from '@/lib/types';

export const LIMITS = { name: 120, email: 200, subject: 160, message: 5000 } as const;
export const MIN_MESSAGE = 10;
export const MAX_BODY_BYTES = 16_384;
export const HONEYPOT_FIELD = 'company_website';

const EMAIL =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

export function hasHeaderBreak(value: string): boolean {
  return /[\r\n]/.test(value);
}

export function isValidEmail(value: string): boolean {
  if (value.length > LIMITS.email || hasHeaderBreak(value) || /\s/.test(value)) return false;
  return EMAIL.test(value);
}

const field = (max: number) =>
  z
    .string({ error: 'Please fill in every field.' })
    .trim()
    .min(1, 'Please fill in every field.')
    .max(max, 'One of the fields is too long.')
    .refine((value) => !hasHeaderBreak(value), 'That field contains characters I can’t accept.');

const contactSchema = z.object({
  name: field(LIMITS.name),
  email: field(LIMITS.email).refine(isValidEmail, 'That email address does not look right.'),
  subject: field(LIMITS.subject),
  message: z
    .string({ error: 'Please fill in every field.' })
    .trim()
    .min(1, 'Please fill in every field.')
    .max(LIMITS.message, 'One of the fields is too long.')
    .refine((value) => value.length >= MIN_MESSAGE, 'Please write a little more so I can reply properly.'),
});

export type ContactParseResult =
  | { readonly ok: true; readonly honeypot: true }
  | { readonly ok: true; readonly honeypot: false; readonly value: ContactSubmission }
  | { readonly ok: false; readonly error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function honeypotTripped(input: unknown): boolean {
  if (!isRecord(input)) return false;
  const value = input[HONEYPOT_FIELD];
  if (value == null || value === '') return false;
  if (typeof value !== 'string') return true;
  return value.trim().length > 0;
}

export function parseContactPayload(input: unknown): ContactParseResult {
  if (!isRecord(input)) {
    return { ok: false, error: 'The form could not be read.' };
  }
  if (honeypotTripped(input)) {
    return { ok: true, honeypot: true };
  }

  const result = contactSchema.safeParse({
    name: input.name,
    email: typeof input.email === 'string' ? input.email.trim().toLowerCase() : input.email,
    subject: input.subject,
    message: input.message,
  });

  if (!result.success) {
    return { ok: false, error: result.error.issues[0]?.message ?? 'Please check the form and try again.' };
  }

  return {
    ok: true,
    honeypot: false,
    value: {
      name: result.data.name,
      email: result.data.email,
      subject: result.data.subject,
      message: result.data.message,
    },
  };
}
