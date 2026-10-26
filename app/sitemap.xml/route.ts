import { headers } from 'next/headers';
import { configuredOrigin } from '@/lib/http/origin';
import { getProjects, getResearchStudies } from '@/lib/content';
import { loadCollection, publicArticles } from '@/lib/mdx/files';

type ChangeFreq = 'weekly' | 'monthly';

type Entry = {
  readonly path: string;
  readonly changefreq: ChangeFreq;
  readonly priority: number;
};

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function priorityText(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

async function origin(): Promise<string> {
  const configured = configuredOrigin();
  if (configured) return configured;

  const headerList = await headers();
  const host = headerList.get('x-forwarded-host') ?? headerList.get('host') ?? 'localhost:3000';
  const proto = headerList.get('x-forwarded-proto') ?? (host.includes('localhost') ? 'http' : 'https');
  if (!host.includes('localhost') && host !== '127.0.0.1') return 'http://localhost:3000';
  return `${proto}://${host}`;
}

function urlBlock(base: string, entry: Entry): string {
  return `<url>
<loc>${escapeXml(`${base}${entry.path}`)}</loc>
<changefreq>${entry.changefreq}</changefreq>
<priority>${priorityText(entry.priority)}</priority>
</url>`;
}

export async function GET() {
  const base = await origin();
  const [projects, studies] = await Promise.all([getProjects(), Promise.resolve(getResearchStudies())]);

  const entries: Entry[] = [
    { path: '/', changefreq: 'weekly', priority: 1 },
    { path: '/about', changefreq: 'weekly', priority: 0.8 },
    { path: '/projects', changefreq: 'weekly', priority: 0.8 },
    { path: '/music', changefreq: 'weekly', priority: 0.8 },
    { path: '/archive', changefreq: 'weekly', priority: 0.8 },
    { path: '/archive/research', changefreq: 'weekly', priority: 0.8 },
    { path: '/archive/artwork', changefreq: 'weekly', priority: 0.5 },
    { path: '/archive/photography', changefreq: 'weekly', priority: 0.5 },
    { path: '/archive/books', changefreq: 'weekly', priority: 0.5 },
    { path: '/archive/certifications', changefreq: 'weekly', priority: 0.5 },
    { path: '/timeline', changefreq: 'weekly', priority: 0.5 },
    { path: '/philosophy', changefreq: 'weekly', priority: 0.6 },
    { path: '/links', changefreq: 'monthly', priority: 0.4 },
    { path: '/bucket-list', changefreq: 'monthly', priority: 0.4 },
    { path: '/now', changefreq: 'weekly', priority: 0.5 },
    { path: '/contact', changefreq: 'weekly', priority: 0.5 },
    { path: '/journal', changefreq: 'weekly', priority: 0.5 },
    { path: '/privacy', changefreq: 'weekly', priority: 0.2 },
    { path: '/terms', changefreq: 'weekly', priority: 0.2 },
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
      })),
    ),
    ...projects.map((project) => ({
      path: `/projects/${project.slug}`,
      changefreq: 'monthly' as const,
      priority: 0.6,
    })),
  ];

  const seen = new Set<string>();
  const unique = entries.filter((entry) => {
    if (seen.has(entry.path)) return false;
    seen.add(entry.path);
    return true;
  });

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
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
