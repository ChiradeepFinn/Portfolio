const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

type Env = { readonly [key: string]: string | undefined };

/**
 * Origin used for OAuth redirects.
 * A configured site URL wins. Without one, only a local host is accepted,
 * so a forged Host header cannot steer the callback onto another site.
 */
export function configuredOrigin(env: Env = process.env): string | null {
  const raw = env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return null;

  try {
    const url = new URL(raw);
    if (url.username || url.password || url.search || url.hash) return null;
    if (url.protocol === 'https:') return url.origin;
    if (url.protocol === 'http:' && LOCAL_HOSTS.has(url.hostname)) return url.origin;
    return null;
  } catch {
    return null;
  }
}

/**
 * Contact, journal, and auth writes must come from this site.
 * Browsers attach Origin on those requests. A missing or foreign Origin is refused.
 * Preview deploys are accepted only when Vercel itself sets VERCEL=1.
 */
export function allowsMutation(
  request: { headers: { get(name: string): string | null } },
  env: Env = process.env,
): boolean {
  const origin = request.headers.get('origin')?.trim() ?? '';
  if (!origin) return false;

  const configured = configuredOrigin(env);
  if (configured && origin === configured) return true;

  if (env.VERCEL === '1') {
    const host = env.VERCEL_URL?.trim() ?? '';
    if (host && !host.includes('://') && !/[\s/\\]/.test(host) && origin === `https://${host}`) return true;
  }

  if (configured) return false;

  try {
    const url = new URL(origin);
    if (url.username || url.password || url.search || url.hash) return false;
    return (url.protocol === 'http:' || url.protocol === 'https:') && LOCAL_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

export function requestOrigin(request: Pick<Request, 'headers'>, env: Env = process.env): string | null {
  const configured = configuredOrigin(env);
  if (configured) return configured;

  const forwarded = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (!forwarded) return null;
  const host = forwarded.split(',')[0]?.trim() ?? '';
  if (!host || /[\s/\\]/.test(host)) return null;

  const protoHeader = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim() ?? 'http';
  if (protoHeader !== 'http' && protoHeader !== 'https') return null;

  try {
    const url = new URL(`${protoHeader}://${host}`);
    if (!LOCAL_HOSTS.has(url.hostname)) return null;
    return url.origin;
  } catch {
    return null;
  }
}
