import { absolute } from '@/lib/feeds/paths';

/**
 * Success-response headers for a Markdown twin.
 * Values match the historical route branch exactly so twins stay noindex
 * with an HTML canonical Link, and cache/Vary behavior is unchanged.
 */
export function markdownTwinSuccessHeaders(
  base: string,
  canonicalPath: string,
): Record<string, string> {
  return {
    'Content-Type': 'text/markdown; charset=utf-8',
    Vary: 'Accept',
    'Cache-Control': 'public, max-age=3600, s-maxage=21600, stale-while-revalidate=86400',
    'X-Robots-Tag': 'noindex',
    Link: `<${absolute(base, canonicalPath)}>; rel="canonical"`,
  };
}
