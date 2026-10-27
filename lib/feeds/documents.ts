/**
 * Resolves a canonical page path to its Markdown twin.
 *
 * The twin route and `/llms-full.txt` both call in here, so a record cannot be
 * published in one and missing from the other. A path that is not a published
 * record returns null, and the caller answers 404.
 */

import { getProjectBySlug, getProjects, getResearchStudy } from '../content';
import { getCaseStudy } from '../data/case-studies';
import { findArticle } from '../mdx/files';
import { identity } from '../site';
import { publishedCatalog, publishedProjects, type CatalogEntry } from './catalog';
import type { LlmsDocument } from './llms';
import {
  articleBody,
  articleMarkdown,
  frontmatterBlock,
  projectMarkdown,
  researchStudyMarkdown,
} from './markdown';
import { absolute } from './paths';
import { siteSections } from './sections';

export async function markdownFor(base: string, path: string, description: string): Promise<string | null> {
  if (path === '/') return homeMarkdown(base, description);

  const project = /^\/projects\/([a-z0-9-]+)$/.exec(path);
  if (project) return projectTwin(base, project[1]);

  const essay = /^\/philosophy\/([a-z0-9-]+)$/.exec(path);
  if (essay) {
    const article = findArticle('essays', essay[1]);
    return article ? articleMarkdown(article, absolute(base, article.href)) : null;
  }

  const research = /^\/archive\/research\/([a-z0-9-]+)$/.exec(path);
  if (research) {
    const study = getResearchStudy(research[1]);
    if (study) return researchStudyMarkdown(study, absolute(base, path));
    const note = findArticle('research', research[1]);
    return note ? articleMarkdown(note, absolute(base, note.href)) : null;
  }

  return null;
}

async function projectTwin(base: string, slug: string): Promise<string | null> {
  const project = await getProjectBySlug(slug);
  if (!project || project.isPlaceholder) return null;

  const longform = findArticle('case-studies', slug);
  return projectMarkdown(
    project,
    absolute(base, `/projects/${slug}`),
    getCaseStudy(slug),
    longform ? articleBody(longform) : undefined,
  );
}

async function homeMarkdown(base: string, description: string): Promise<string> {
  const projects = publishedProjects(await getProjects());

  return [
    frontmatterBlock([
      ['title', `${identity.name} - ${identity.role}`],
      ['summary', description],
      ['author', identity.name],
      ['canonical', absolute(base, '/')],
    ]),
    `# ${identity.name}`,
    `**TL;DR** ${description}`,
    `## Selected work\n\n${projects
      .map((item) => `- [${item.title}](${absolute(base, `/projects/${item.slug}`)}): ${item.summary}`)
      .join('\n')}`,
    `## Rooms of the site\n\n${siteSections
      .map((section) => `- [${section.label}](${absolute(base, section.path)}): ${section.note}`)
      .join('\n')}`,
    `## Contact\n\n- Email: ${identity.email}\n- Location: ${identity.location}`,
  ].join('\n\n');
}

/** Every published record as Markdown, for `/llms-full.txt`. */
export async function allDocuments(
  base: string,
  description: string,
): Promise<{
  readonly catalog: readonly CatalogEntry[];
  readonly documents: readonly LlmsDocument[];
}> {
  const catalog = await publishedCatalog();
  const documents: LlmsDocument[] = [];

  for (const entry of catalog) {
    const markdown = await markdownFor(base, entry.path, description);
    if (!markdown) continue;
    documents.push({ title: entry.title, url: absolute(base, entry.path), markdown });
  }

  return { catalog, documents };
}
