/**
 * In-process rate limit for the contact route.
 *
 * This is not shared across serverless instances and resets when a process
 * exits. It is a local ceiling, not production-wide protection. A shared store
 * is intentionally not assumed: none is configured in this project.
 */

export interface RateLimitStore {
  /** Return the count inside the window, or null when the store cannot answer. */
  increment(key: string, windowMs: number, now: number): number | null;
}

export interface RateLimitDecision {
  readonly allowed: boolean;
  readonly unavailable: boolean;
  readonly limit: number;
  readonly remaining: number;
  readonly retryAfterSeconds: number;
}

export class MemoryRateLimitStore implements RateLimitStore {
  private readonly hits = new Map<string, number[]>();

  increment(key: string, windowMs: number, now: number): number | null {
    const recent = (this.hits.get(key) ?? []).filter((timestamp) => now - timestamp < windowMs);
    recent.push(now);
    this.hits.set(key, recent);
    return recent.length;
  }
}

const DEFAULT_LIMIT = 5;
const DEFAULT_WINDOW_MS = 10 * 60 * 1000;

export function readRateLimitConfig(env: { readonly [key: string]: string | undefined } = process.env): { limit: number; windowMs: number } {
  return {
    limit: positiveInt(env.CONTACT_RATE_LIMIT_MAX, DEFAULT_LIMIT, 50),
    windowMs: positiveInt(env.CONTACT_RATE_LIMIT_WINDOW_SECONDS, DEFAULT_WINDOW_MS / 1000, 86_400) * 1000,
  };
}

function positiveInt(value: string | undefined, fallback: number, max: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > max) return fallback;
  return parsed;
}

export function decideRateLimit(
  store: RateLimitStore,
  key: string,
  now = Date.now(),
  config = readRateLimitConfig(),
): RateLimitDecision {
  let count: number | null;
  try {
    count = store.increment(key, config.windowMs, now);
  } catch {
    count = null;
  }

  if (count == null) {
    return {
      allowed: false,
      unavailable: true,
      limit: config.limit,
      remaining: 0,
      retryAfterSeconds: Math.ceil(config.windowMs / 1000),
    };
  }

  const allowed = count <= config.limit;
  return {
    allowed,
    unavailable: false,
    limit: config.limit,
    remaining: Math.max(0, config.limit - count),
    retryAfterSeconds: allowed ? 0 : Math.ceil(config.windowMs / 1000),
  };
}

export const contactRateLimitStore = new MemoryRateLimitStore();
