import { getProjects, getResearchStudies } from '@/lib/content';
import { loadCollection, publicArticles } from '@/lib/mdx/files';
import { publishedProjects } from '@/lib/feeds/catalog';
import { listPublicImages } from '@/lib/public-images';

export type SitemapChangeFreq = 'weekly' | 'monthly';

export type SitemapEntry = {
  readonly path: string;
  readonly changefreq: SitemapChangeFreq;
  readonly priority: number;
  /** Only records with a real date carry one. Nothing is invented for the rest. */
  readonly lastmod?: string;
  /** Image sitemap locs for gallery pages Google might otherwise miss. */
  readonly images?: readonly string[];
};

/**
 * Indexable public HTML paths for the sitemap.
 * Draft MDX and placeholder projects are excluded by the same filters the
 * feed catalog uses. Markdown twins and `/api/*` are never listed.
 */
export async function collectSitemapEntries(): Promise<readonly SitemapEntry[]> {
  const [allProjects, studies] = await Promise.all([getProjects(), Promise.resolve(getResearchStudies())]);
  const projects = publishedProjects(allProjects);
  const photographyImages = listPublicImages('photography');
  const artworkImages = listPublicImages('artwork');

  const entries: SitemapEntry[] = [
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
  return entries.filter((entry) => {
    if (seen.has(entry.path)) return false;
    seen.add(entry.path);
    return true;
  });
}
