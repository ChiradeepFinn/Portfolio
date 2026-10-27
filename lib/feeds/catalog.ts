/**
 * What is published.
 *
 * One list of eligible records, shared by the Markdown twins, the feed, and the
 * two llms files, so a draft cannot appear in one output and be missing from
 * another. Drafts, reserved placeholder slots, guest journal notes, and
 * anything behind sign-in are not here.
 */

import { getProjects, getResearchStudies } from '../content';
import { loadCollection, publicArticles, type ArticleMeta } from '../mdx/files';
import type { CollectionId } from '../mdx/schema';
import type { Project } from '../types';

export type CatalogKind = 'project' | 'research' | 'essay' | 'note';

export interface CatalogEntry {
  readonly kind: CatalogKind;
  readonly title: string;
  /** Canonical site path. The Markdown twin is this path with `.md` appended. */
  readonly path: string;
  readonly summary: string;
  /** Only records that carry a real date have one. Nothing is invented for the rest. */
  readonly publishedAt?: string;
  readonly tags?: readonly string[];
}

const NOTE_COLLECTIONS: readonly CollectionId[] = ['research', 'essays', 'case-studies'];

export function publishedProjects(projects: readonly Project[]): readonly Project[] {
  return projects.filter((project) => !project.isPlaceholder && project.slug.length > 0);
}

/** Published and in-progress MDX. `publicArticles` already drops drafts. */
export function publishedArticles(): readonly ArticleMeta[] {
  return NOTE_COLLECTIONS.flatMap((collection) => publicArticles(loadCollection(collection)));
}

function articleKind(collection: CollectionId): CatalogKind {
  return collection === 'essays' ? 'essay' : 'note';
}

/**
 * Deterministic: newest dated records first, then undated records in the order
 * the site lists them. Two builds of the same content produce the same file.
 */
export async function publishedCatalog(): Promise<readonly CatalogEntry[]> {
  const projects = publishedProjects(await getProjects());

  const entries: CatalogEntry[] = [
    ...publishedArticles().map((article) => ({
      kind: articleKind(article.collection),
      title: article.title,
      path: article.href,
      summary: article.summary,
      publishedAt: article.publishedAt,
      tags: article.tags,
    })),
    ...getResearchStudies().map((study) => ({
      kind: 'research' as const,
      title: study.title,
      path: `/archive/research/${study.slug}`,
      summary: study.summary,
      tags: study.domains,
    })),
    ...projects.map((project) => ({
      kind: 'project' as const,
      title: project.title,
      path: `/projects/${project.slug}`,
      summary: project.summary,
      tags: project.stack,
    })),
  ];

  const dated = entries
    .filter((entry) => entry.publishedAt)
    .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? '') || a.path.localeCompare(b.path));
  const undated = entries.filter((entry) => !entry.publishedAt);

  return [...dated, ...undated];
}
