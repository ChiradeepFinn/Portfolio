import { createHash } from 'node:crypto';
import { decideRateLimit, MemoryRateLimitStore, type RateLimitDecision } from '@/lib/contact/rate-limit';

/**
 * In-process ceiling for journal sign-in and note writes.
 * Instances do not share the map, and a restart clears it. This is the same
 * limit the contact form already documents: a local ceiling, not a global one.
 */

const DEFAULT_LIMIT = 8;
const DEFAULT_WINDOW_MS = 10 * 60 * 1000;

export function readJournalRateLimitConfig(
  env: { readonly [key: string]: string | undefined } = process.env,
): { limit: number; windowMs: number } {
  return {
    limit: positiveInt(env.JOURNAL_RATE_LIMIT_MAX, DEFAULT_LIMIT, 40),
    windowMs: positiveInt(env.JOURNAL_RATE_LIMIT_WINDOW_SECONDS, DEFAULT_WINDOW_MS / 1000, 86_400) * 1000,
  };
}

function positiveInt(value: string | undefined, fallback: number, max: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > max) return fallback;
  return parsed;
}

export function journalActorKey(userId: string): string {
  const digest = createHash('sha256').update(userId).digest('hex').slice(0, 24);
  return `user:${digest}`;
}

export const journalRateLimitStore = new MemoryRateLimitStore();

export function journalRateLimit(
  key: string,
  now = Date.now(),
  config = readJournalRateLimitConfig(),
  store: MemoryRateLimitStore = journalRateLimitStore,
): RateLimitDecision {
  return decideRateLimit(store, key, now, config);
}
