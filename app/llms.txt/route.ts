import { publishedCatalog } from '@/lib/feeds/catalog';
import { llmsIndex } from '@/lib/feeds/llms';
import { publicOrigin } from '@/lib/feeds/origin';
import { siteDescription } from '@/lib/seo';

export async function GET() {
  const [base, catalog] = await Promise.all([publicOrigin(), publishedCatalog()]);

  return new Response(llmsIndex(base, siteDescription, catalog), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=21600, stale-while-revalidate=86400',
    },
  });
}
