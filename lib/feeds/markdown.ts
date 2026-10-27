/**
 * Markdown twins.
 *
 * One published record has one source. These functions render that source as
 * Markdown so a reader that cannot run the page - a feed, an assistant, a
 * plain-text client - sees the same words the HTML page shows, without a
 * second copy of the content to keep in sync.
 *
 * MDX articles are read from the file on disk. Projects, case studies, and the
 * research studies are serialized from the typed records in `lib/data/`.
 * Nothing here converts rendered HTML back to Markdown.
 */

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { CaseStudyContent } from '../data/case-studies';
import type { ResearchBlock, ResearchStudy } from '../data/research';
import type { ArticleMeta } from '../mdx/files';
import type { Project } from '../types';
import { identity } from '../site';
import { mdxToMarkdown } from './mdx-to-markdown';

type FrontmatterValue = string | number | readonly string[] | undefined | null;

export function frontmatterBlock(fields: readonly (readonly [string, FrontmatterValue])[]): string {
  const lines = fields
    .filter(([, value]) => value !== undefined && value !== null && !(Array.isArray(value) && value.length === 0) && value !== '')
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}: [${value.map((item) => yamlString(String(item))).join(', ')}]`;
      }
      return `${key}: ${yamlString(String(value))}`;
    });

  return `---\n${lines.join('\n')}\n---`;
}

function yamlString(value: string): string {
  return `"${value.replaceAll('\\', '\\\\').replaceAll('"', '\\"').replaceAll('\n', ' ')}"`;
}

function section(heading: string, body: string): string {
  return body.trim().length > 0 ? `## ${heading}\n\n${body.trim()}` : '';
}

function bullets(items: readonly string[]): string {
  return items.map((item) => `- ${item}`).join('\n');
}

function paragraphs(items: readonly string[]): string {
  return items.join('\n\n');
}

function join(parts: readonly string[]): string {
  return parts.filter((part) => part.trim().length > 0).join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
}

function codeBlock(code: string, file?: string): string {
  const fence = code.includes('```') ? '~~~' : '```';
  return `${file ? `\`${file}\`\n\n` : ''}${fence}\n${code.trim()}\n${fence}`;
}

function table(columns: readonly string[], rows: readonly (readonly string[])[]): string {
  const head = `| ${columns.join(' | ')} |`;
  const rule = `| ${columns.map(() => '---').join(' | ')} |`;
  const body = rows.map((row) => `| ${row.map((cell) => cell.replaceAll('|', '\\|')).join(' | ')} |`);
  return [head, rule, ...body].join('\n');
}

/* --------------------------------------------------------------- MDX files */

/** Body of an MDX article, read from the file the page renders. */
export function articleBody(meta: ArticleMeta): string {
  const absolute = path.join(process.cwd(), meta.relativePath);
  const raw = fs.readFileSync(absolute, 'utf8');
  return mdxToMarkdown(matter(raw).content);
}

export function articleMarkdown(meta: ArticleMeta, canonical: string): string {
  return join([
    frontmatterBlock([
      ['title', meta.title],
      ['summary', meta.summary],
      ['published', meta.publishedAt],
      ['status', meta.status],
      ['tags', meta.tags],
      ['author', identity.name],
      ['canonical', canonical],
    ]),
    `# ${meta.title}`,
    `**TL;DR** ${meta.summary}`,
    articleBody(meta),
  ]);
}

/* --------------------------------------------------------------- Projects */

export function projectMarkdown(
  project: Project,
  canonical: string,
  study?: CaseStudyContent,
  longform?: string,
): string {
  return join([
    frontmatterBlock([
      ['title', project.title],
      ['summary', project.summary],
      ['type', study?.kind ?? 'Project'],
      ['category', project.category],
      ['status', project.status],
      ['stack', project.stack],
      ['live', project.liveUrl ?? undefined],
      ['repository', project.repoUrl ?? undefined],
      ['author', identity.name],
      ['canonical', canonical],
    ]),
    `# ${project.title}`,
    `**TL;DR** ${project.summary}`,
    project.description ? `> ${project.description}` : '',
    study?.pitch ? `> ${study.pitch}` : '',
    section('Highlights', bullets(project.highlights)),
    section('Stack', bullets(project.stack)),
    study ? caseStudyMarkdown(study) : '',
    longform ?? '',
  ]);
}

export function caseStudyMarkdown(study: CaseStudyContent): string {
  return join([
    section(
      study.problemLabel,
      join([
        study.problemLines && study.problemLines.length > 0 ? bullets(study.problemLines) : '',
        paragraphs(study.problem),
      ]),
    ),
    ...study.features.map((feature) =>
      section(
        feature.label,
        join([
          paragraphs(feature.body),
          feature.code ? codeBlock(feature.code.code, feature.code.file) : '',
          feature.diagram ? codeBlock(feature.diagram) : '',
        ]),
      ),
    ),
    section(study.stackLabel, join([study.stackIntro, ...study.stack.map(stackGroup)])),
    section(
      'The hard part',
      join([`### ${study.hard.title}`, study.hard.problem, `**Solution.** ${study.hard.solution}`]),
    ),
    section(
      'Trade-offs',
      table(
        ['Decision', 'Choice', 'Why'],
        study.tradeoffs.map((row) => [row.decision, row.choice, row.why]),
      ),
    ),
    section("What I'd change", bullets(study.changes)),
    section(study.faqLabel, faqMarkdown(study.faq)),
  ]);
}

function stackGroup(group: CaseStudyContent['stack'][number]): string {
  return join([`### ${group.label}`, bullets([...group.items]), group.note ?? '']);
}

export function faqMarkdown(faq: readonly { readonly question: string; readonly answer: string }[]): string {
  return faq.map((item) => `**${item.question}**\n\n${item.answer}`).join('\n\n');
}

/* --------------------------------------------------------------- Research */

export function researchStudyMarkdown(study: ResearchStudy, canonical: string): string {
  return join([
    frontmatterBlock([
      ['title', study.title],
      ['summary', study.summary],
      ['type', 'Research study'],
      ['status', study.status],
      ['domains', study.domains],
      ['author', identity.name],
      ['canonical', canonical],
    ]),
    `# ${study.title}`,
    `**TL;DR** ${study.summary}`,
    section('Question', study.question),
    section('Progress', study.progress),
    section(study.overviewLabel, join([study.overview, study.overviewNote ? `*${study.overviewNote}*` : ''])),
    section(
      'At a glance',
      bullets(study.previewFacts.map((fact) => `**${fact.label}.** ${fact.value}`)),
    ),
    ...study.sections.map((part) => section(part.label, part.blocks.map(researchBlock).filter(Boolean).join('\n\n'))),
  ]);
}

function researchBlock(block: ResearchBlock): string {
  switch (block.type) {
    case 'prose':
      return paragraphs([...block.paragraphs]);
    case 'callout':
    case 'pending':
      return `> **${block.kicker}**\n>\n> ${block.text}`;
    case 'list':
      return bullets([...block.items]);
    case 'questions':
      return join([
        block.note ?? '',
        block.provisional ? '*Provisional questions.*' : '',
        block.items.map((item) => `- **${item.id}.** ${item.text}`).join('\n'),
      ]);
    case 'ordered':
      return block.items.map((item, index) => `${index + 1}. **${item.title}.** ${item.detail}`).join('\n');
    case 'definitions':
      return bullets(block.items.map((item) => `**${item.term}.** ${item.detail}`));
    case 'table':
      return join([block.caption ? `*${block.caption}*` : '', table(block.columns, block.rows)]);
    case 'cards':
      return block.items.map((item) => `### ${item.title}\n\n*${item.kicker}*\n\n${item.body}`).join('\n\n');
    case 'records':
      return bullets(
        block.items.map((item) => (item.href ? `**${item.label}.** [${item.value}](${item.href})` : `**${item.label}.** ${item.value}`)),
      );
    case 'columns':
      return join([`\`${block.file}\` - ${block.rowsLabel}`, bullets([...block.names]), block.note]);
    default:
      return '';
  }
}
