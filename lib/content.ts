import { getReadClient } from '@/lib/supabase/server';
import { researchStudies } from '@/lib/data/research';
import type { ResearchStudy } from '@/lib/data/research';
import {
  seedArtworks,
  seedBooks,
  seedCertifications,
  seedPhotographs,
  seedProjects,
  seedResearch,
  seedTimeline,
  seedTracks,
  seedWriting,
} from '@/lib/data/seed';
import { isBlank } from '@/lib/present';
import type {
  Artwork,
  Book,
  Certification,
  Photograph,
  Project,
  ResearchPaper,
  TimelineItem,
  Track,
  WritingEntry,
} from '@/lib/types';

/**
 * Content access layer.
 *
 * Pages call these functions and never touch Supabase directly. When Supabase
 * credentials are absent - a fresh clone, or local work before the project is
 * provisioned - every function falls back to the typed seed so the site still
 * renders. A failed query falls back the same way rather than crashing a page.
 */

type Row = Record<string, unknown>;

const ROW_TTL_MS = 5 * 60 * 1000;

type CachedRows = { readonly at: number; readonly rows: Row[] | null };

const rowCache = new Map<string, CachedRows>();
const rowInflight = new Map<string, Promise<Row[] | null>>();

async function queryRows(table: string, orderBy: string): Promise<Row[] | null> {
  const client = getReadClient();
  if (!client) return null;

  const { data, error } = await client
    .from(table)
    .select('*')
    .eq('is_published', true)
    .order(orderBy, { ascending: true });

  if (error) {
    console.error(`[content] Falling back to seed for "${table}":`, error.message);
    return null;
  }
  return data as Row[];
}

async function fetchRows(table: string, orderBy = 'position'): Promise<Row[] | null> {
  const key = `${table}:${orderBy}`;
  const hit = rowCache.get(key);
  if (hit && Date.now() - hit.at < ROW_TTL_MS) return hit.rows;

  let pending = rowInflight.get(key);
  if (!pending) {
    pending = queryRows(table, orderBy).then((rows) => {
      rowCache.set(key, { at: Date.now(), rows });
      return rows;
    });
    rowInflight.set(key, pending);
    void pending.finally(() => {
      if (rowInflight.get(key) === pending) rowInflight.delete(key);
    });
  }

  return pending;
}

function plainDash(value: string): string {
  return value.replaceAll('\u2014', '-');
}

const str = (value: unknown, fallback = ''): string =>
  typeof value === 'string' && value.length > 0 ? plainDash(value) : fallback;
const nullableStr = (value: unknown): string | null =>
  typeof value === 'string' && value.length > 0 ? plainDash(value) : null;
const bool = (value: unknown): boolean => value === true;
const strList = (value: unknown): readonly string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string').map(plainDash)
    : [];

export async function getProjects(): Promise<readonly Project[]> {
  const rows = await fetchRows('projects');
  if (!rows) return seedProjects;

  const bySlug = new Map(seedProjects.map((project) => [project.slug, project]));

  return rows.map((row) => {
    const seed = bySlug.get(str(row.slug));
    const year = str(row.year, '-');
    const updated = str(row.updated, '-');

    return {
      slug: str(row.slug),
      isPlaceholder: bool(row.is_placeholder),
      title: str(row.title),
      category: str(row.category, '-'),
      year: isBlank(year) && seed ? seed.year : year,
      updated: isBlank(updated) && seed ? seed.updated : updated,
      status: str(row.status, '-'),
      role: str(row.role, '-'),
      summary: str(row.summary),
      hook: str(row.hook, str(row.summary)),
      description: str(row.description),
      highlights: strList(row.highlights),
      stack: strList(row.stack),
      tone: (['blue', 'rose', 'teal'] as const).includes(row.tone as Project['tone'])
        ? (row.tone as Project['tone'])
        : 'blue',
      liveUrl: nullableStr(row.live_url),
      repoUrl: nullableStr(row.repo_url),
      featured: bool(row.featured),
    };
  });
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug);
}

export async function getFeaturedProject(): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((project) => project.featured) ?? projects[0];
}

export async function getTracks(): Promise<readonly Track[]> {
  const rows = await fetchRows('tracks');
  if (!rows) return seedTracks;

  return rows.map((row) => ({
    slug: str(row.slug),
    isPlaceholder: bool(row.is_placeholder),
    title: str(row.title),
    mood: str(row.mood, '-'),
    duration: str(row.duration, '-:-'),
    year: str(row.year, '-'),
    note: str(row.note),
    listenUrl: nullableStr(row.listen_url),
    featured: bool(row.featured),
  }));
}

export async function getFeaturedTrack(): Promise<Track | undefined> {
  const tracks = await getTracks();
  return tracks.find((track) => track.featured) ?? tracks[0];
}

export async function getBooks(): Promise<readonly Book[]> {
  const rows = await fetchRows('books');
  if (!rows) return seedBooks;

  return rows.map((row) => ({
    slug: str(row.slug),
    isPlaceholder: bool(row.is_placeholder),
    index: str(row.index_label, '-'),
    title: str(row.title),
    subtitle: str(row.subtitle),
    synopsis: str(row.synopsis),
    excerpt: str(row.excerpt),
    year: nullableStr(row.year),
    publisher: nullableStr(row.publisher),
  }));
}

export async function getArtworks(): Promise<readonly Artwork[]> {
  const rows = await fetchRows('artworks');
  if (!rows) return seedArtworks;

  return rows.map((row) => ({
    slug: str(row.slug),
    isPlaceholder: bool(row.is_placeholder),
    title: str(row.title, 'Untitled'),
    medium: str(row.medium, '-'),
    year: str(row.year, '-'),
    size: (['tall', 'wide', 'square'] as const).includes(row.size as Artwork['size'])
      ? (row.size as Artwork['size'])
      : 'square',
    featured: bool(row.featured),
  }));
}

export async function getPhotographs(): Promise<readonly Photograph[]> {
  const rows = await fetchRows('photographs');
  if (!rows) return seedPhotographs;

  return rows.map((row) => ({
    slug: str(row.slug),
    isPlaceholder: bool(row.is_placeholder),
    title: str(row.title, 'Untitled frame'),
    place: str(row.place, '-'),
    captured: str(row.captured, '-'),
    camera: nullableStr(row.camera),
    size: (['tall', 'wide', 'square'] as const).includes(row.size as Photograph['size'])
      ? (row.size as Photograph['size'])
      : 'square',
    featured: bool(row.featured),
  }));
}

/**
 * The two investigations in `lib/data/research.ts` stay there. New prose
 * research, essays, and case studies belong in `content/` as MDX. Do not copy
 * a record into both places.
 */
export function getResearchStudies(): readonly ResearchStudy[] {
  return [...researchStudies].sort((a, b) => a.index.localeCompare(b.index));
}

export function getResearchStudy(slug: string): ResearchStudy | undefined {
  return researchStudies.find((study) => study.slug === slug);
}

export async function getResearchPapers(): Promise<readonly ResearchPaper[]> {
  const rows = await fetchRows('research_papers');
  // The long-form studies live in code. Reserved database slots predate them,
  // so a placeholder table must not hide the archive on the homepage.
  if (!rows || isReservedResearch(rows)) return seedResearch;

  return rows.map((row) => ({
    slug: str(row.slug),
    isPlaceholder: bool(row.is_placeholder),
    question: str(row.question),
    title: str(row.title),
    abstract: str(row.abstract),
    field: str(row.field, '-'),
    status: str(row.status, '-'),
    year: nullableStr(row.year),
    pdfUrl: nullableStr(row.pdf_url),
    featured: bool(row.featured),
  }));
}

function isReservedResearch(rows: readonly Row[]): boolean {
  return rows.every((row) => bool(row.is_placeholder) || str(row.slug).startsWith('research-slot'));
}

export async function getFeaturedResearch(): Promise<ResearchPaper | undefined> {
  const papers = await getResearchPapers();
  return papers.find((paper) => paper.featured) ?? papers[0];
}

export async function getWriting(): Promise<readonly WritingEntry[]> {
  const rows = await fetchRows('writing_entries');
  if (!rows) return seedWriting;

  return rows.map((row) => ({
    slug: str(row.slug),
    isPlaceholder: bool(row.is_placeholder),
    title: str(row.title),
    category: str(row.category, '-'),
    excerpt: str(row.excerpt),
    published: nullableStr(row.published),
    featured: bool(row.featured),
  }));
}

export async function getFeaturedWriting(): Promise<WritingEntry | undefined> {
  const entries = await getWriting();
  return entries.find((entry) => entry.featured) ?? entries[0];
}

export async function getCertifications(): Promise<readonly Certification[]> {
  const rows = await fetchRows('certifications');
  if (!rows) return seedCertifications;

  return rows.map((row) => ({
    slug: str(row.slug),
    isPlaceholder: bool(row.is_placeholder),
    title: str(row.title),
    issuer: str(row.issuer, '-'),
    year: str(row.year, '-'),
    note: str(row.note),
    verifyUrl: nullableStr(row.verify_url),
  }));
}

export async function getTimeline(): Promise<readonly TimelineItem[]> {
  const rows = await fetchRows('timeline_items');
  // Reserved slots must not replace the authored story. A row counts only
  // once it has been published as a real entry.
  if (!rows || rows.length === 0 || rows.every((row) => bool(row.is_placeholder))) return seedTimeline;

  return rows.map((row) => ({
    slug: str(row.slug),
    isPlaceholder: bool(row.is_placeholder),
    year: str(row.year, '-'),
    title: str(row.title),
    note: str(row.note),
  }));
}
