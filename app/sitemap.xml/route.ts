import { collectSitemapEntries } from '@/lib/feeds/sitemap-entries';
import { publicOrigin } from '@/lib/feeds/origin';
import { escapeXml } from '@/lib/feeds/xml';

function priorityText(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function imageBlocks(base: string, images: readonly string[] | undefined): string {
  if (!images || images.length === 0) return '';
  // Cap per URL so a huge gallery does not dominate the sitemap document.
  return images
    .slice(0, 1000)
    .map((src) => {
      const loc = src.startsWith('http') ? src : `${base}${src}`;
      return `\n<image:image>\n<image:loc>${escapeXml(loc)}</image:loc>\n</image:image>`;
    })
    .join('');
}

function urlBlock(
  base: string,
  entry: {
    readonly path: string;
    readonly changefreq: string;
    readonly priority: number;
    readonly lastmod?: string;
    readonly images?: readonly string[];
  },
): string {
  return `<url>
<loc>${escapeXml(`${base}${entry.path}`)}</loc>${entry.lastmod ? `\n<lastmod>${entry.lastmod}</lastmod>` : ''}
<changefreq>${entry.changefreq}</changefreq>
<priority>${priorityText(entry.priority)}</priority>${imageBlocks(base, entry.images)}
</url>`;
}

export async function GET() {
  const base = await publicOrigin();
  const unique = await collectSitemapEntries();

  // The Markdown twins and `/api/*` are deliberately absent: a twin is a second
  // view of a page that is already listed, and it answers `noindex`.
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${unique.map((entry) => urlBlock(base, entry)).join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  });
}
