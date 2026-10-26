import { z } from 'zod';

/**
 * Frontmatter for long-form MDX. Structured records (project cards, books,
 * the two existing research studies) stay in `lib/data/` and are not described
 * here.
 */

export const articleStatuses = ['draft', 'in-progress', 'published'] as const;
export type ArticleStatus = (typeof articleStatuses)[number];

export const collections = ['research', 'essays', 'case-studies'] as const;
export type CollectionId = (typeof collections)[number];

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const LOCAL_IMAGE = /^\/(?!\/)(?!.*\.\.)[A-Za-z0-9][A-Za-z0-9._~/-]*$/;

export function isRealDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export const articleFrontmatterSchema = z.object({
  title: z.string().trim().min(1, 'Title is required.').max(200, 'Title is too long.'),
  slug: z.string().trim().regex(SLUG, 'Slug must be lowercase words separated by hyphens.'),
  summary: z.string().trim().min(1, 'Summary is required.').max(500, 'Summary is too long.'),
  publishedAt: z.string().trim().refine(isRealDate, 'publishedAt must be a real YYYY-MM-DD date.'),
  status: z.enum(articleStatuses),
  tags: z.array(z.string().trim().min(1).max(40)).max(12).default([]),
  coverImage: z
    .string()
    .trim()
    .regex(LOCAL_IMAGE, 'Cover image must be a local path such as /images/cover.jpg.')
    .optional(),
});

export type ArticleFrontmatter = z.infer<typeof articleFrontmatterSchema>;

export class ContentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ContentError';
  }
}

export function formatIssues(error: z.ZodError): string {
  return error.issues.map((issue) => `${issue.path.join('.') || 'frontmatter'}: ${issue.message}`).join('; ');
}

export function parseFrontmatter(input: unknown, fileLabel: string): ArticleFrontmatter {
  const result = articleFrontmatterSchema.safeParse(input);
  if (!result.success) {
    throw new ContentError(`Invalid content in ${fileLabel}: ${formatIssues(result.error)}`);
  }
  return result.data;
}

export function assertSlugSetsMatch(collection: CollectionId, onDisk: readonly string[], registered: readonly string[]): void {
  const disk = [...onDisk].sort();
  const listed = [...registered].sort();
  if (disk.length === listed.length && disk.every((slug, index) => slug === listed[index])) return;

  const missing = disk.filter((slug) => !listed.includes(slug));
  const extra = listed.filter((slug) => !disk.includes(slug));
  const parts = [
    missing.length > 0 ? `not registered: ${missing.join(', ')}` : '',
    extra.length > 0 ? `registered but missing on disk: ${extra.join(', ')}` : '',
  ].filter(Boolean);
  throw new ContentError(
    `MDX registry for "${collection}" does not match content files (${parts.join('; ')}). Add or remove the import in lib/mdx/registry.tsx.`,
  );
}

export function isPublicStatus(status: ArticleStatus): boolean {
  return status !== 'draft';
}

export function hrefFor(collection: CollectionId, slug: string): string {
  if (collection === 'research') return `/archive/research/${slug}`;
  if (collection === 'essays') return `/philosophy/${slug}`;
  return `/projects/${slug}`;
}
