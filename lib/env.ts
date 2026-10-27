import { z } from 'zod';

/**
 * One typed read of the environment.
 *
 * Every variable is optional on purpose: the site renders from the typed seed
 * with no environment at all, and a fresh clone must not fail to build. What is
 * validated is the *shape* of a value that was set - an unparseable Supabase URL
 * or a webhook pointing somewhere other than Discord is a configuration mistake
 * worth refusing, and refusing it here is better than discovering it in a
 * request.
 *
 * An empty string is treated as unset. Vercel and `.env` files both produce
 * empty strings for a variable that was added but never filled in, and `?? ''`
 * checks elsewhere in the codebase would otherwise read one as configured.
 *
 * Nothing in this file logs a value. A validation failure names the variable.
 */

/** Empty or whitespace-only means unset. */
const present = z.preprocess(
  (value) => (typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined),
  z.string().optional(),
);

function isUrl(protocols: readonly string[]) {
  return (value: string) => {
    try {
      return protocols.includes(new URL(value).protocol);
    } catch {
      return false;
    }
  };
}

const secret = present.refine(
  (value) => value === undefined || !/\s/.test(value),
  'must not contain whitespace',
);

const positiveInt = z.preprocess((value) => {
  if (typeof value !== 'string' || value.trim().length === 0) return undefined;
  const parsed = Number(value.trim());
  return Number.isInteger(parsed) && parsed > 0 ? parsed : Number.NaN;
}, z.number().int().positive().optional());

const schema = z.object({
  NEXT_PUBLIC_SITE_URL: present.refine(
    (value) => value === undefined || isUrl(['https:', 'http:'])(value),
    'must be a URL',
  ),
  NEXT_PUBLIC_SUPABASE_URL: present.refine(
    (value) => value === undefined || isUrl(['https:', 'http:'])(value),
    'must be a URL',
  ),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: secret,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: secret,
  SUPABASE_SERVICE_ROLE_KEY: secret,
  RESEND_API_KEY: secret,
  RESEND_FROM_EMAIL: present,
  CONTACT_TO_EMAIL: present,
  CONTACT_RATE_LIMIT_MAX: positiveInt,
  CONTACT_RATE_LIMIT_WINDOW_SECONDS: positiveInt,
  JOURNAL_RATE_LIMIT_MAX: positiveInt,
  JOURNAL_RATE_LIMIT_WINDOW_SECONDS: positiveInt,
  /** Optional. Set it and a successful contact message pings the channel. */
  DISCORD_WEBHOOK_URL: present.refine(
    (value) =>
      value === undefined ||
      /^https:\/\/(?:\w+\.)?discord(?:app)?\.com\/api\/webhooks\//.test(value),
    'must be a Discord webhook URL',
  ),
});

export type Env = z.infer<typeof schema>;

export function parseEnv(source: Record<string, string | undefined>): {
  readonly env: Env;
  readonly problems: readonly string[];
} {
  const result = schema.safeParse(source);
  if (result.success) return { env: result.data, problems: [] };

  // A malformed value is dropped rather than crashing a render: the feature that
  // needs it reports "not configured", which is what a missing value does too.
  const problems = result.error.issues.map(
    (issue) => `${issue.path.join('.') || 'env'}: ${issue.message}`,
  );
  const cleaned = schema.safeParse(
    Object.fromEntries(
      Object.entries(source).filter(
        ([key]) => !result.error.issues.some((issue) => issue.path[0] === key),
      ),
    ),
  );

  return { env: cleaned.success ? cleaned.data : ({} as Env), problems };
}

let cached: Env | null = null;

export function env(): Env {
  if (cached) return cached;

  const { env: parsed, problems } = parseEnv(process.env as Record<string, string | undefined>);
  for (const problem of problems) console.error(`[env] ${problem}`);
  cached = parsed;
  return parsed;
}
