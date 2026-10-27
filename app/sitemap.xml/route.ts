import { getProjects, getResearchStudies } from '@/lib/content';
import { loadCollection, publicArticles } from '@/lib/mdx/files';
import { publishedProjects } from '@/lib/feeds/catalog';
import { publicOrigin } from '@/lib/feeds/origin';
import { escapeXml } from '@/lib/feeds/xml';
import { listPublicImages } from '@/lib/public-images';

type ChangeFreq = 'weekly' | 'monthly';

type Entry = {
  readonly path: string;
  readonly changefreq: ChangeFreq;
  readonly priority: number;
  /** Only records with a real date carry one. Nothing is invented for the rest. */
  readonly lastmod?: string;
  /** Image sitemap locs for gallery pages Google might otherwise miss. */
  readonly images?: readonly string[];
};

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

function urlBlock(base: string, entry: Entry): string {
  return `<url>
<loc>${escapeXml(`${base}${entry.path}`)}</loc>${entry.lastmod ? `\n<lastmod>${entry.lastmod}</lastmod>` : ''}
<changefreq>${entry.changefreq}</changefreq>
<priority>${priorityText(entry.priority)}</priority>${imageBlocks(base, entry.images)}
</url>`;
}

export async function GET() {
  const base = await publicOrigin();
  const [allProjects, studies] = await Promise.all([getProjects(), Promise.resolve(getResearchStudies())]);
  // A reserved slot is not a page worth indexing.
  const projects = publishedProjects(allProjects);
  const photographyImages = listPublicImages('photography');
  const artworkImages = listPublicImages('artwork');

  const entries: Entry[] = [
    { path: '/', changefreq: 'weekly', priority: 1 },
    { path: '/about', changefreq: 'weekly', priority: 0.9 },
    { path: '/projects', changefreq: 'weekly', priority: 0.9 },
    { path: '/contact', changefreq: 'weekly', priority: 0.8 },
    { path: '/links', changefreq: 'monthly', priority: 0.7 },
    { path: '/music', changefreq: 'weekly', priority: 0.7 },
    { path: '/archive', changefreq: 'weekly', priority: 0.7 },
    { path: '/archive/research', changefreq: 'weekly', priority: 0.7 },
    {
      path: '/archive/artwork',
      changefreq: 'weekly',
      priority: 0.6,
      images: artworkImages,
    },
    {
      path: '/archive/photography',
      changefreq: 'weekly',
      priority: 0.6,
      images: photographyImages,
    },
    { path: '/archive/books', changefreq: 'weekly', priority: 0.5 },
    { path: '/archive/certifications', changefreq: 'weekly', priority: 0.5 },
    { path: '/timeline', changefreq: 'weekly', priority: 0.5 },
    { path: '/philosophy', changefreq: 'weekly', priority: 0.6 },
    { path: '/bucket-list', changefreq: 'monthly', priority: 0.4 },
    { path: '/now', changefreq: 'weekly', priority: 0.5 },
    { path: '/journal', changefreq: 'weekly', priority: 0.5 },
    { path: '/privacy', changefreq: 'monthly', priority: 0.2 },
    { path: '/terms', changefreq: 'monthly', priority: 0.2 },
    ...studies.map((study) => ({
      path: `/archive/research/${study.slug}`,
      changefreq: 'weekly' as const,
      priority: 0.7,
    })),
    ...(['research', 'essays', 'case-studies'] as const).flatMap((collection) =>
      publicArticles(loadCollection(collection)).map((article) => ({
        path: article.href,
        changefreq: 'weekly' as const,
        priority: 0.6,
        lastmod: article.publishedAt,
      })),
    ),
    ...projects.map((project) => ({
      path: `/projects/${project.slug}`,
      changefreq: 'monthly' as const,
      priority: 0.7,
    })),
  ];

  const seen = new Set<string>();
  const unique = entries.filter((entry) => {
    if (seen.has(entry.path)) return false;
    seen.add(entry.path);
    return true;
  });

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
