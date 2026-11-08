import { seedBooks } from '@/lib/data/seed';

export type ContactPrefill = {
  readonly subject: string;
  readonly message: string;
};

/**
 * Prefill only when the visitor arrives from a deliberate deep link
 * (for example the books free-copy button). Ordinary /contact visits stay blank.
 */
export function contactPrefillFromSearch(
  params: URLSearchParams | Readonly<Record<string, string | string[] | undefined>>,
): ContactPrefill | null {
  const request = readParam(params, 'request');
  if (request !== 'free-copy') return null;

  const slug = readParam(params, 'book') ?? 'book-one';
  const book = seedBooks.find((entry) => entry.slug === slug && entry.freeCopy) ?? seedBooks.find((entry) => entry.freeCopy);
  if (!book) return null;

  return {
    subject: `Free copy request: ${book.title}`,
    message: `Hi! I'd love to request a free copy of ${book.title}. Please let me know if a copy is available. Thank you!`,
  };
}

function readParam(
  params: URLSearchParams | Readonly<Record<string, string | string[] | undefined>>,
  key: string,
): string | null {
  if (params instanceof URLSearchParams) {
    const value = params.get(key);
    return value && value.length > 0 ? value : null;
  }
  const raw = params[key];
  if (typeof raw === 'string' && raw.length > 0) return raw;
  if (Array.isArray(raw) && typeof raw[0] === 'string' && raw[0].length > 0) return raw[0];
  return null;
}
