import { headers } from 'next/headers';
import { configuredOrigin } from '../http/origin';

/**
 * Base URL for generated files: the sitemap, the feed, the Markdown twins, and
 * the llms files.
 *
 * A configured `NEXT_PUBLIC_SITE_URL` wins - in production that is
 * `https://chiradeep.me`. Without one, only a local host is accepted, so a
 * forged `Host` header cannot plant another site's URLs in a feed.
 */
export async function publicOrigin(): Promise<string> {
  const configured = configuredOrigin();
  if (configured) return configured;

  const headerList = await headers();
  const host = headerList.get('x-forwarded-host') ?? headerList.get('host') ?? 'localhost:3000';
  const proto = headerList.get('x-forwarded-proto') ?? (host.includes('localhost') ? 'http' : 'https');
  if (!host.includes('localhost') && host !== '127.0.0.1') return 'http://localhost:3000';
  return `${proto}://${host}`;
}
