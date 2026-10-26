import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { researchStudies } from '../data/research';
import { listCaseStudySlugs } from '../data/case-studies';
import { seedWriting } from '../data/seed';
import {
  type ArticleFrontmatter,
  type CollectionId,
  ContentError,
  collections,
  hrefFor,
  isPublicStatus,
  parseFrontmatter,
} from './schema';

export interface ArticleMeta extends ArticleFrontmatter {
  readonly collection: CollectionId;
  readonly href: string;
  readonly relativePath: string;
}

const DIRECTORIES: Record<CollectionId, string> = {
  research: 'content/research',
  essays: 'content/essays',
  'case-studies': 'content/case-studies',
};

export function collectionDirectory(collection: CollectionId): string {
  return DIRECTORIES[collection];
}

export function loadCollection(collection: CollectionId, root?: string): ArticleMeta[] {
  if (!collections.includes(collection)) {
    throw new ContentError(`Unknown content collection "${collection}".`);
  }

  const directory = contentDirectory(collection, root);
  const relativeDir = DIRECTORIES[collection];
  if (!fs.existsSync(directory)) return [];

  const files = fs.readdirSync(directory).filter((name) => name.endsWith('.mdx') && !name.startsWith('.'));
  const articles = files.map((name) => readArticle(collection, directory, relativeDir, name));
  const seen = new Set<string>();

  for (const article of articles) {
    if (seen.has(article.slug)) {
      throw new ContentError(`Duplicate slug "${article.slug}" in ${relativeDir}.`);
    }
    seen.add(article.slug);
    assertNotReserved(collection, article.slug, article.relativePath);
  }

  return articles.sort((a, b) => a.publishedAt.localeCompare(b.publishedAt) || a.slug.localeCompare(b.slug));
}

export function publicArticles(articles: readonly ArticleMeta[]): ArticleMeta[] {
  return articles.filter((article) => isPublicStatus(article.status));
}

export function findArticle(collection: CollectionId, slug: string, root?: string): ArticleMeta | undefined {
  return publicArticles(loadCollection(collection, root)).find((article) => article.slug === slug);
}

function contentDirectory(collection: CollectionId, root?: string): string {
  if (root) {
    return path.join(/*turbopackIgnore: true*/ root, 'content', folderName(collection));
  }

  switch (collection) {
    case 'research':
      return path.join(process.cwd(), 'content', 'research');
    case 'essays':
      return path.join(process.cwd(), 'content', 'essays');
    case 'case-studies':
      return path.join(process.cwd(), 'content', 'case-studies');
  }
}

function folderName(collection: CollectionId): string {
  if (collection === 'case-studies') return 'case-studies';
  return collection;
}

function readArticle(collection: CollectionId, directory: string, relativeDir: string, name: string): ArticleMeta {
  const relativePath = path.posix.join(relativeDir, name);
  const absolute = path.join(directory, name);
  const resolved = path.resolve(absolute);
  if (!resolved.startsWith(path.resolve(directory) + path.sep)) {
    throw new ContentError(`Refusing to read ${relativePath}.`);
  }

  let raw: string;
  try {
    raw = fs.readFileSync(resolved, 'utf8');
  } catch {
    throw new ContentError(`Could not read ${relativePath}.`);
  }

  let data: unknown;
  try {
    data = normalizeMatter(matter(raw).data);
  } catch {
    throw new ContentError(`Invalid frontmatter in ${relativePath}.`);
  }

  const frontmatter = parseFrontmatter(data, relativePath);
  const expected = `${frontmatter.slug}.mdx`;
  if (name !== expected) {
    throw new ContentError(`${relativePath} must be named ${expected} so the slug and filename stay the same.`);
  }

  return {
    ...frontmatter,
    collection,
    href: hrefFor(collection, frontmatter.slug),
    relativePath,
  };
}

function normalizeMatter(data: unknown): unknown {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return data;
  const record = data as Record<string, unknown>;
  const publishedAt = record.publishedAt;
  if (!(publishedAt instanceof Date) || Number.isNaN(publishedAt.getTime())) return record;
  const year = publishedAt.getUTCFullYear();
  const month = String(publishedAt.getUTCMonth() + 1).padStart(2, '0');
  const day = String(publishedAt.getUTCDate()).padStart(2, '0');
  return { ...record, publishedAt: `${year}-${month}-${day}` };
}

function assertNotReserved(collection: CollectionId, slug: string, relativePath: string): void {
  const reserved =
    collection === 'research'
      ? researchStudies.map((study) => study.slug)
      : collection === 'case-studies'
        ? listCaseStudySlugs()
        : seedWriting.map((entry) => entry.slug);

  if (!reserved.includes(slug)) return;

  const source =
    collection === 'research'
      ? 'lib/data/research.ts'
      : collection === 'case-studies'
        ? 'lib/data/case-studies.ts'
        : 'lib/data/seed.ts';

  throw new ContentError(
    `${relativePath} uses slug "${slug}", which already lives in ${source}. Keep one source for that record.`,
  );
}
