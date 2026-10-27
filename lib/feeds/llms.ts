/**
 * `/llms.txt` and `/llms-full.txt`.
 *
 * Audience: an assistant or agent that has fetched a page and wants the rest of
 * the site in a form it can read without running JavaScript. `llms.txt` is an
 * index of canonical URLs with one line each. `llms-full.txt` inlines the
 * Markdown twin of every published record.
 *
 * Limitations, stated in the files themselves: these are a courtesy, not a
 * protocol with guarantees. Publishing them does not make a model cite the
 * site, index it, or send traffic. They are generated from the same records the
 * pages render, so they cannot claim anything the site does not.
 */

import { identity } from '../site';
import type { CatalogEntry } from './catalog';
import { absolute } from './paths';
import { siteSections } from './sections';

export interface LlmsDocument {
  readonly title: string;
  readonly url: string;
  readonly markdown: string;
}

const GROUPS: readonly (readonly [string, CatalogEntry['kind']])[] = [
  ['Projects', 'project'],
  ['Research', 'research'],
  ['Writing', 'essay'],
  ['Notes', 'note'],
];

function group(base: string, label: string, entries: readonly CatalogEntry[]): string {
  if (entries.length === 0) return '';
  const lines = entries.map((entry) => `- [${entry.title}](${absolute(base, entry.path)}): ${entry.summary}`);
  return `## ${label}\n\n${lines.join('\n')}`;
}

export function llmsIndex(base: string, description: string, catalog: readonly CatalogEntry[]): string {
  const groups = GROUPS.map(([label, kind]) =>
    group(base, label, catalog.filter((entry) => entry.kind === kind)),
  ).filter(Boolean);

  const parts = [
    `# ${identity.name}`,
    `> ${description} The site is a personal portfolio and archive, written from ${identity.location}. It is not a shop, a local-service listing, or a company.`,
    `## What this site is

- A personal portfolio and archive of software, music, photography, artwork, books, research, and essays.
- Contact is a form that emails ${identity.name}. It does not create an account.
- The guest journal lets a visitor sign in with Google or GitHub and leave one public note. The email address is not shown on the page.`,
    `## Pages\n\n${siteSections
      .map((section) => `- [${section.label}](${absolute(base, section.path)}): ${section.note}`)
      .join('\n')}`,
    ...groups,
    `## Contact

- Email: ${identity.email}
- Location: ${identity.location}`,
    `## Notes for readers and crawlers

- The readable text of every page is in the HTML. Nothing above needs JavaScript to read.
- Every record listed under Projects, Research, Writing, and Notes also answers as Markdown at the same URL with \`.md\` appended, for example ${absolute(base, '/projects/sidequest.md')}.
- A Markdown twin is \`noindex\` and names its HTML page as canonical. The HTML page is the one to cite.
- ${absolute(base, '/llms-full.txt')} carries the same records with their full text inline.
- Published work only. Drafts, unpublished research, and placeholder slots labelled as reserved are not listed and must not be described as finished work.
- Generated from the records the pages render. This file is a convenience for machine readers; it is not a claim that the site will be cited, indexed, or ranked.`,
  ];

  return `${parts.filter(Boolean).join('\n\n')}\n`;
}

export function llmsFull(
  base: string,
  catalog: readonly CatalogEntry[],
  documents: readonly LlmsDocument[],
): string {
  const header = [
    `# ${identity.name} - full text`,
    `> Every published record on ${absolute(base, '/')}, inlined as Markdown. The index with one line per record is at ${absolute(base, '/llms.txt')}. Each record below is also served on its own at its canonical URL with \`.md\` appended.`,
    `## Contents\n\n${catalog.map((entry) => `- [${entry.title}](${absolute(base, entry.path)})`).join('\n')}`,
  ].join('\n\n');

  const bodies = documents
    .map((document) => `<!-- ${document.url} -->\n\n${document.markdown.trim()}`)
    .join('\n\n---\n\n');

  return `${header}\n\n---\n\n${bodies}\n`;
}
