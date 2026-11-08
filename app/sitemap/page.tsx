import type { Metadata } from 'next';
import Link from 'next/link';
import { collectSitemapEntries } from '@/lib/feeds/sitemap-entries';
import { withCanonical } from '@/lib/seo';
import { identity } from '@/lib/site';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';

export const metadata: Metadata = withCanonical('/sitemap', {
  title: 'Sitemap',
  description:
    "A human-readable map of public pages on Chiradeep Finn's site — the same indexable URLs listed in the XML sitemap for crawlers.",
});

function labelForPath(path: string): string {
  if (path === '/') return 'Home';
  const leaf = path.split('/').filter(Boolean).pop() ?? path;
  return leaf
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export default async function SitemapPage() {
  const entries = await collectSitemapEntries();

  return (
    <>
      <PageHeader
        eyebrow="Index"
        title="Sitemap"
        description={`Public pages on ${identity.name}'s site. The XML feed at /sitemap.xml remains the crawler source of truth; this page is for people.`}
        width="narrow"
      />

      <Section className="pt-0" width="narrow">
        <p className="text-sm text-muted">
          Prefer the machine-readable map?{' '}
          <a href="/sitemap.xml" className="text-foreground underline-offset-4 hover:underline">
            /sitemap.xml
          </a>
        </p>
        <ul className="mt-10 grid gap-3 border-t border-border pt-8">
          {entries.map((entry) => (
            <li key={entry.path} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <Link
                href={entry.path}
                className="text-[0.98rem] text-foreground transition-colors duration-200 hover:text-muted"
              >
                {labelForPath(entry.path)}
              </Link>
              <span className="font-mono text-[0.75rem] text-muted-2">{entry.path}</span>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
