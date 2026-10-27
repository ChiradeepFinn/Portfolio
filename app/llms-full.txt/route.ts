import { allDocuments } from '@/lib/feeds/documents';
import { llmsFull } from '@/lib/feeds/llms';
import { publicOrigin } from '@/lib/feeds/origin';
import { siteDescription } from '@/lib/seo';

export async function GET() {
  const base = await publicOrigin();
  const { catalog, documents } = await allDocuments(base, siteDescription);

  return new Response(llmsFull(base, catalog, documents), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=21600, stale-while-revalidate=86400',
    },
  });
}
