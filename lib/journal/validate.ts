/**
 * Guest-journal field rules.
 * The database function repeats these checks so a direct API call cannot skip them.
 */

export const LIMITS = { name: 32, body: 600 } as const;
export const MIN_NAME = 2;
export const MIN_BODY = 12;
export const MAX_LINKS = 1;
export const MAX_BODY_BYTES = 8_192;
export const HONEYPOT_FIELD = 'contact_website';

const BIDI = /[\u202A-\u202E\u2066-\u2069]/;
const NAME_FORBIDDEN = /[!@#$%^&*()_+=[\]{}|\\:;"<>,?/`~\u0000-\u001F\u007F]/;
const URL_PATTERN = /https?:\/\/|www\./i;
const BLOCKED_NAMES = new Set(['chiradeep', 'chiradeep finn']);

export interface JournalDraft {
  readonly displayName: string;
  readonly body: string;
  readonly rating: number;
}

export type JournalParseResult =
  | { readonly ok: true; readonly honeypot: true }
  | { readonly ok: true; readonly honeypot: false; readonly value: JournalDraft }
  | { readonly ok: false; readonly error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function characterLength(value: string): number {
  return Array.from(value).length;
}

/** First letter of a published name is always a capital, including names already stored in lowercase. */
export function capitalizeDisplayName(value: string): string {
  const chars = Array.from(value);
  const index = chars.findIndex((char) => /\p{L}/u.test(char));
  if (index < 0) return value;
  const upper = chars[index].toLocaleUpperCase('en-US');
  if (upper === chars[index]) return value;
  chars[index] = upper;
  return chars.join('');
}

export function normalizeDisplayName(value: string): string {
  return capitalizeDisplayName(value.trim().replace(/\s+/g, ' '));
}

export function normalizeBody(value: string): string {
  return value
    .replaceAll('\r', '')
    .replaceAll('\0', '')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function linkCount(value: string): number {
  return value.match(new RegExp(URL_PATTERN.source, 'gi'))?.length ?? 0;
}

export function honeypotTripped(input: unknown): boolean {
  if (!isRecord(input)) return false;
  const value = input[HONEYPOT_FIELD];
  if (value == null || value === '') return false;
  if (typeof value !== 'string') return true;
  return value.trim().length > 0;
}

export function displayNameError(value: string): string | null {
  if (!value) return 'Add the name that should appear with the note.';
  if (characterLength(value) < MIN_NAME || characterLength(value) > LIMITS.name) {
    return 'Keep the name between 2 and 32 characters.';
  }
  if (BIDI.test(value) || NAME_FORBIDDEN.test(value) || URL_PATTERN.test(value)) {
    return 'Use a name without an email address or a link.';
  }
  if (!/\p{L}/u.test(value)) return 'Use a name that includes a letter.';
  if (BLOCKED_NAMES.has(value.toLowerCase())) return 'Choose a name that is yours to use.';
  return null;
}

export function bodyError(value: string): string | null {
  if (!value) return 'Write the note before publishing it.';
  if (BIDI.test(value)) return 'That note contains characters I can’t accept.';
  if (characterLength(value) < MIN_BODY) return 'Write a little more than a few words.';
  if (characterLength(value) > LIMITS.body) return 'Keep the note under 600 characters.';
  if (/(.)\1{11,}/u.test(value)) return 'That note looks like noise. Rewrite it and try again.';
  if (linkCount(value) > MAX_LINKS) return 'A note can include one link at most.';
  return null;
}

function ratingError(value: unknown): string | null {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 1 || value > 5) {
    return 'Choose a mark before publishing.';
  }
  return null;
}

export function parseJournalPayload(input: unknown): JournalParseResult {
  if (!isRecord(input)) return { ok: false, error: 'The note could not be read.' };
  if (honeypotTripped(input)) return { ok: true, honeypot: true };
  if (typeof input.displayName !== 'string' || typeof input.body !== 'string') {
    return { ok: false, error: 'The note could not be read.' };
  }

  const displayName = normalizeDisplayName(input.displayName);
  const body = normalizeBody(input.body);
  const nameProblem = displayNameError(displayName);
  if (nameProblem) return { ok: false, error: nameProblem };
  const noteProblem = bodyError(body);
  if (noteProblem) return { ok: false, error: noteProblem };
  const markProblem = ratingError(input.rating);
  if (markProblem) return { ok: false, error: markProblem };

  return { ok: true, honeypot: false, value: { displayName, body, rating: input.rating as number } };
}
