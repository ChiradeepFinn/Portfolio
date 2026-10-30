import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { mdxToMarkdown } from '../lib/feeds/mdx-to-markdown';
import { absolute, canonicalPathFor } from '../lib/feeds/paths';
import { markdownTwinDestination } from '../lib/http/markdown-twins';
import { escapeXml, rfc822 } from '../lib/feeds/xml';
import { rssDocument } from '../lib/feeds/rss';
import { llmsFull, llmsIndex } from '../lib/feeds/llms';
import { caseStudyMarkdown, faqMarkdown, frontmatterBlock } from '../lib/feeds/markdown';
import type { CatalogEntry } from '../lib/feeds/catalog';
import type { CaseStudyContent } from '../lib/data/case-studies';

const base = 'https://chiradeep.me';

describe('mdx to markdown', () => {
  it('keeps a code sample that looks like a component', () => {
    const source = [
      'Prose before.',
      '',
      '```tsx',
      'export function Page() {',
      '  return <Suspense fallback={null} />',
      '}',
      '```',
      '',
      'Prose after.',
    ].join('\n');

    const markdown = mdxToMarkdown(source);
    assert.match(markdown, /<Suspense fallback=\{null\} \/>/);
    assert.match(markdown, /Prose before\./);
    assert.match(markdown, /Prose after\./);
  });

  it('keeps an inline code span that names a component', () => {
    const markdown = mdxToMarkdown('Render `<Figure />` only for local images.');
    assert.equal(markdown, 'Render `<Figure />` only for local images.');
  });

  it('expands a callout into a blockquote and keeps its copy', () => {
    const markdown = mdxToMarkdown(
      ['<Callout title="Draft">', '  Replace this file when a real essay is ready.', '</Callout>'].join('\n'),
    );

    assert.match(markdown, /^> \*\*Draft\*\*$/m);
    assert.match(markdown, /Replace this file when a real essay is ready\./);
  });

  it('expands a figure and a citation', () => {
    const figure = mdxToMarkdown('<Figure src="/images/a.jpg" alt="A frame" caption="Karur, 2024" />');
    assert.match(figure, /!\[A frame\]\(\/images\/a\.jpg\)/);
    assert.match(figure, /\*Karur, 2024\*/);

    const citation = mdxToMarkdown('<Citation id="1">A source, named plainly.</Citation>');
    assert.equal(citation, '[1] A source, named plainly.');
  });

  it('drops a component wrapper but keeps the words inside it', () => {
    const markdown = mdxToMarkdown('<Section title="Ignored">\n\nA paragraph that must survive.\n\n</Section>');
    assert.equal(markdown, 'A paragraph that must survive.');
  });

  it('drops mdx comments, imports, and exports', () => {
    const markdown = mdxToMarkdown(
      ['import Thing from "./thing";', '', '{/* a note to myself */}', '', 'Visible text.'].join('\n'),
    );
    assert.equal(markdown, 'Visible text.');
  });

  it('is stable when run twice', () => {
    const source = '<Callout title="Note">Body.</Callout>\n\nTail.';
    assert.equal(mdxToMarkdown(source), mdxToMarkdown(source));
  });
});

describe('twin paths', () => {
  it('maps the shapes the site serves', () => {
    assert.equal(canonicalPathFor(['index']), '/');
    assert.equal(canonicalPathFor(['projects', 'sidequest']), '/projects/sidequest');
    assert.equal(canonicalPathFor(['projects', 'sidequest.md']), '/projects/sidequest');
    assert.equal(canonicalPathFor(['philosophy', 'a-note.md']), '/philosophy/a-note');
    assert.equal(
      canonicalPathFor(['archive', 'research', 'music-emotion-recognition.md']),
      '/archive/research/music-emotion-recognition',
    );
  });

  it('refuses traversal, unknown shapes, and odd slugs', () => {
    assert.equal(canonicalPathFor([]), null);
    assert.equal(canonicalPathFor(['..', 'secrets']), null);
    assert.equal(canonicalPathFor(['projects', '../../.env']), null);
    assert.equal(canonicalPathFor(['journal', 'someone']), null);
    assert.equal(canonicalPathFor(['projects', 'Sidequest']), null);
    assert.equal(canonicalPathFor(['api', 'contact']), null);
  });

  it('builds absolute urls without doubling the slash', () => {
    assert.equal(absolute(base, '/'), 'https://chiradeep.me/');
    assert.equal(absolute(base, '/projects/sidequest'), 'https://chiradeep.me/projects/sidequest');
  });

  it('rewrites only the published markdown twin paths', () => {
    assert.equal(markdownTwinDestination('/index.md'), '/api/md/index');
    assert.equal(markdownTwinDestination('/projects/sidequest.md'), '/api/md/projects/sidequest');
    assert.equal(markdownTwinDestination('/philosophy/a-note.md'), '/api/md/philosophy/a-note');
    assert.equal(
      markdownTwinDestination('/archive/research/music-emotion-recognition.md'),
      '/api/md/archive/research/music-emotion-recognition',
    );
  });

  it('refuses non-canonical markdown twin paths', () => {
    assert.equal(markdownTwinDestination('/projects/Sidequest.md'), null);
    assert.equal(markdownTwinDestination('/projects/sidequest.MD'), null);
    assert.equal(markdownTwinDestination('/projects/two/parts.md'), null);
    assert.equal(markdownTwinDestination('/projects/sidequest'), null);
    assert.equal(markdownTwinDestination('/rss.xml'), null);
  });

});

describe('xml helpers', () => {
  it('escapes the five xml characters', () => {
    assert.equal(escapeXml('a & b < c > d " e \' f'), 'a &amp; b &lt; c &gt; d &quot; e &apos; f');
  });

  it('accepts a real date and refuses anything else', () => {
    assert.equal(rfc822('2026-10-13'), 'Tue, 13 Oct 2026 00:00:00 GMT');
    assert.equal(rfc822('13-10-2026'), null);
    assert.equal(rfc822(''), null);
  });
});

const catalog: readonly CatalogEntry[] = [
  {
    kind: 'essay',
    title: 'A note & a question',
    path: '/philosophy/a-note',
    summary: 'One or two sentences.',
    publishedAt: '2026-10-13',
    tags: ['topic'],
  },
  {
    kind: 'project',
    title: 'Sidequest',
    path: '/projects/sidequest',
    summary: 'A quest system sized to the time you have.',
    tags: ['React Native', 'Supabase'],
  },
];

describe('rss', () => {
  const xml = rssDocument(base, 'Chiradeep', 'Portfolio and archive.', catalog);

  it('names the canonical origin and itself', () => {
    assert.match(xml, /<link>https:\/\/chiradeep\.me\/<\/link>/);
    assert.match(xml, /rel="self"/);
    assert.match(xml, /href="https:\/\/chiradeep\.me\/rss\.xml"/);
  });

  it('escapes titles and uses the canonical url as a stable guid', () => {
    assert.match(xml, /<title>A note &amp; a question<\/title>/);
    assert.match(xml, /<guid isPermaLink="true">https:\/\/chiradeep\.me\/philosophy\/a-note<\/guid>/);
  });

  it('carries a date only where the record has one', () => {
    assert.match(xml, /<pubDate>Tue, 13 Oct 2026 00:00:00 GMT<\/pubDate>/);
    assert.equal(xml.match(/<pubDate>/g)?.length, 1);
    assert.match(xml, /<lastBuildDate>Tue, 13 Oct 2026 00:00:00 GMT<\/lastBuildDate>/);
  });

  it('has one item per catalog entry and no stray angle brackets', () => {
    assert.equal(xml.match(/<item>/g)?.length, catalog.length);
    assert.equal(xml.match(/<item>/g)?.length, xml.match(/<\/item>/g)?.length);
  });

  it('is deterministic', () => {
    assert.equal(xml, rssDocument(base, 'Chiradeep', 'Portfolio and archive.', catalog));
  });
});

describe('llms files', () => {
  const index = llmsIndex(base, 'Portfolio and archive.', catalog);

  it('lists published records with absolute urls', () => {
    assert.match(index, /- \[Sidequest\]\(https:\/\/chiradeep\.me\/projects\/sidequest\)/);
    assert.match(index, /## Projects/);
    assert.match(index, /## Writing/);
  });

  it('states the limitation instead of promising citations', () => {
    assert.match(index, /not a claim that the site will be cited, indexed, or ranked/);
    assert.match(index, /Published work only/);
  });

  it('states Chiradeep Finn identity with Finn and Chiradeep as the same person', () => {
    assert.match(index, /## Identity/);
    assert.match(index, /Primary name: Chiradeep Finn/);
    assert.match(index, /Preferred name: Finn/);
    assert.match(index, /not separate people or brands/);
  });

  it('tells agents when to use the site', () => {
    assert.match(index, /## When to use this/);
    assert.match(index, /freelance, collaboration, or a full-time role/);
    assert.match(index, /Skip this site for local-service lookups/);
  });

  it('points at the markdown twins and the full file', () => {
    assert.match(index, /\.md` appended/);
    assert.match(index, /Accept: text\/markdown/);
    assert.match(index, /https:\/\/chiradeep\.me\/llms-full\.txt/);
  });

  it('inlines bodies in the full file and keeps the contents list', () => {
    const full = llmsFull(base, catalog, [
      { title: 'Sidequest', url: `${base}/projects/sidequest`, markdown: '# Sidequest\n\nBody.' },
    ]);
    assert.match(full, /## Contents/);
    assert.match(full, /<!-- https:\/\/chiradeep\.me\/projects\/sidequest -->/);
    assert.match(full, /# Sidequest/);
  });

  it('is deterministic', () => {
    assert.equal(index, llmsIndex(base, 'Portfolio and archive.', catalog));
  });
});

const study: CaseStudyContent = {
  kind: 'Web app',
  pitch: 'A pitch.',
  problemLabel: 'The problem',
  problem: ['One paragraph.'],
  problemLines: ['A line.'],
  features: [
    {
      label: 'A mechanism',
      body: ['How it works.'],
      code: { file: 'lib/thing.ts', code: 'const a = 1' },
      diagram: 'a -> b',
    },
  ],
  stackLabel: 'Stack',
  stackIntro: 'Why these.',
  stackLayout: 'reasons',
  stack: [{ label: 'Frontend', items: ['Next.js'], note: 'A note.' }],
  hard: { title: 'The hard bit', problem: 'What hurt.', solution: 'What fixed it.' },
  tradeoffs: [{ decision: 'A | B', choice: 'A', why: 'Because.' }],
  changes: ['One change.'],
  faqLabel: 'Questions',
  faq: [{ question: 'Why?', answer: 'Because.' }],
};

describe('case study markdown', () => {
  const markdown = caseStudyMarkdown(study);

  it('keeps every section the page renders', () => {
    assert.match(markdown, /## The problem/);
    assert.match(markdown, /## A mechanism/);
    assert.match(markdown, /## Stack/);
    assert.match(markdown, /## The hard part/);
    assert.match(markdown, /## Trade-offs/);
    assert.match(markdown, /## Questions/);
  });

  it('fences code and escapes a pipe inside a table cell', () => {
    assert.match(markdown, /```\nconst a = 1\n```/);
    assert.match(markdown, /\| A \\\| B \|/);
  });

  it('writes questions as the page shows them', () => {
    assert.equal(faqMarkdown(study.faq), '**Why?**\n\nBecause.');
  });
});

describe('frontmatter block', () => {
  it('quotes values, lists tags, and drops empty fields', () => {
    const block = frontmatterBlock([
      ['title', 'A "quoted" title'],
      ['tags', ['one', 'two']],
      ['summary', ''],
      ['missing', undefined],
    ]);

    assert.match(block, /^---$/m);
    assert.match(block, /title: "A \\"quoted\\" title"/);
    assert.match(block, /tags: \["one", "two"\]/);
    assert.doesNotMatch(block, /summary/);
    assert.doesNotMatch(block, /missing/);
  });
});
