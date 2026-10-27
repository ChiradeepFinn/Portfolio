import { markdownFor } from '@/lib/feeds/documents';
import { publicOrigin } from '@/lib/feeds/origin';
import { absolute, canonicalPathFor } from '@/lib/feeds/paths';
import { siteDescription } from '@/lib/seo';

/**
 * Markdown twins.
 *
 * Reachable as `/projects/sidequest.md` and the other `.md` URLs through the
 * rewrites in `next.config.ts`, and directly here. The HTML page stays
 * canonical: the twin says so in a `Link` header and answers `noindex`, so it
 * never competes with its own page in search.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const canonical = canonicalPathFor(path ?? []);
  const base = await publicOrigin();

  const markdown = canonical ? await markdownFor(base, canonical, siteDescription) : null;
  if (!canonical || !markdown) {
    return new Response('Not found.\n', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Robots-Tag': 'noindex',
        'Cache-Control': 'no-store',
      },
    });
  }

  return new Response(markdown.endsWith('\n') ? markdown : `${markdown}\n`, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=21600, stale-while-revalidate=86400',
      'X-Robots-Tag': 'noindex',
      Link: `<${absolute(base, canonical)}>; rel="canonical"`,
    },
  });
}
