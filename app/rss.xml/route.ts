import { publishedCatalog } from '@/lib/feeds/catalog';
import { publicOrigin } from '@/lib/feeds/origin';
import { rssDocument } from '@/lib/feeds/rss';
import { identity } from '@/lib/site';
import { siteDescription } from '@/lib/seo';

export async function GET() {
  const [base, catalog] = await Promise.all([publicOrigin(), publishedCatalog()]);
  const body = rssDocument(base, `${identity.name} - ${identity.role}`, siteDescription, catalog);

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=21600, stale-while-revalidate=86400',
    },
  });
}
