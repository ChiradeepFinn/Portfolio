import type { CatalogEntry } from './catalog';
import { absolute } from './paths';
import { escapeXml, rfc822 } from './xml';

const MAX_CATEGORIES = 8;

/**
 * RSS 2.0 for published work.
 *
 * `description` carries the author's own summary. The full body is not inlined
 * as HTML because the site has no Markdown-to-HTML step outside the MDX
 * compiler; readers who want the whole text follow the link, or fetch the
 * Markdown twin at the same URL with `.md` appended.
 *
 * Records with no real publication date - the project studies, the research
 * studies - are published pages without one, so the item omits `pubDate`
 * rather than inventing a timestamp. `lastBuildDate` is the newest real date in
 * the feed, so an unchanged site produces an unchanged feed.
 */
export function rssDocument(
  base: string,
  title: string,
  description: string,
  entries: readonly CatalogEntry[],
): string {
  const self = absolute(base, '/rss.xml');
  const newest = entries
    .map((entry) => entry.publishedAt)
    .filter((date): date is string => typeof date === 'string')
    .sort()
    .at(-1);
  const lastBuild = newest ? rfc822(newest) : null;

  const channel = [
    `<title>${escapeXml(title)}</title>`,
    `<link>${escapeXml(absolute(base, '/'))}</link>`,
    `<description>${escapeXml(description)}</description>`,
    '<language>en</language>',
    `<atom:link href="${escapeXml(self)}" rel="self" type="application/rss+xml"/>`,
    lastBuild ? `<lastBuildDate>${lastBuild}</lastBuildDate>` : '',
    ...entries.map((entry) => item(base, entry)),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
${channel.filter((line) => line.length > 0).join('\n')}
</channel>
</rss>
`;
}

function item(base: string, entry: CatalogEntry): string {
  const url = absolute(base, entry.path);
  const date = entry.publishedAt ? rfc822(entry.publishedAt) : null;

  const lines = [
    '<item>',
    `<title>${escapeXml(entry.title)}</title>`,
    `<link>${escapeXml(url)}</link>`,
    `<guid isPermaLink="true">${escapeXml(url)}</guid>`,
    `<description>${escapeXml(entry.summary)}</description>`,
    date ? `<pubDate>${date}</pubDate>` : '',
    ...(entry.tags ?? []).slice(0, MAX_CATEGORIES).map((tag) => `<category>${escapeXml(tag)}</category>`),
    '</item>',
  ];

  return lines.filter((line) => line.length > 0).join('\n');
}
