import { createHash } from 'node:crypto';

/**
 * Privacy-conscious rate-limit key.
 *
 * On Vercel, `x-real-ip` is set by the platform. This code trusts it only when
 * `VERCEL=1`, which Vercel sets on its own deployments. The raw address is
 * hashed and is not written to the contact database.
 *
 * Anywhere else, forwarded headers are not trusted. Every caller shares one
 * bucket so a misconfigured deploy still has a ceiling.
 */

export function rateLimitKey(
  request: { headers: { get(name: string): string | null } },
  env: { readonly [key: string]: string | undefined } = process.env,
): string {
  if (env.VERCEL === '1') {
    const ip = request.headers.get('x-real-ip')?.trim() ?? '';
    if (isPlausibleIp(ip)) return `ip:${hash(ip)}`;
  }
  return 'unverified-origin';
}

function isPlausibleIp(value: string): boolean {
  if (value.length < 3 || value.length > 64) return false;
  if (/[\s,]/.test(value)) return false;
  return /^[0-9a-fA-F:.]+$/.test(value);
}

function hash(value: string): string {
  return createHash('sha256').update(value).digest('hex').slice(0, 24);
}
