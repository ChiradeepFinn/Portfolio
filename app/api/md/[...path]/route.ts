import { markdownFor } from '@/lib/feeds/documents';
import { publicOrigin } from '@/lib/feeds/origin';
import { absolute, canonicalPathFor } from '@/lib/feeds/paths';
import { agentNotFoundMarkdown } from '@/lib/http/agent-markdown';
import { siteDescription } from '@/lib/seo';

/**
 * Markdown twins.
 *
 * Reachable as `/projects/sidequest.md` and the other `.md` URLs through the
 * rewrites in `next.config.ts`, via `Accept: text/markdown` negotiation in
 * `proxy.ts`, and directly here. The HTML page stays canonical: the twin says
 * so in a `Link` header and answers `noindex`, so it never competes with its
 * own page in search.
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
    const missing = canonical ?? `/${(path ?? []).join('/')}`;
    return new Response(agentNotFoundMarkdown(base, missing), {
      status: 404,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        Vary: 'Accept',
        'X-Robots-Tag': 'noindex',
        'Cache-Control': 'no-store',
      },
    });
  }

  return new Response(markdown.endsWith('\n') ? markdown : `${markdown}\n`, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      Vary: 'Accept',
      'Cache-Control': 'public, max-age=3600, s-maxage=21600, stale-while-revalidate=86400',
      'X-Robots-Tag': 'noindex',
      Link: `<${absolute(base, canonical)}>; rel="canonical"`,
    },
  });
}
