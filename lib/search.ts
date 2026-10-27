import { getBooks, getProjects, getResearchStudies } from '@/lib/content';
import { loadCollection, publicArticles } from '@/lib/mdx/files';

export type SearchGroup =
  | 'Pages'
  | 'Projects'
  | 'Music'
  | 'Archive'
  | 'Photography'
  | 'Artwork'
  | 'Books'
  | 'Research'
  | 'Writing'
  | 'Philosophy'
  | 'Elsewhere';

export interface SearchItem {
  readonly group: SearchGroup;
  readonly label: string;
  readonly href: string;
  readonly description: string;
  /** Lowercased title, summary, stack, and related lines. Not shown. */
  readonly keywords: string;
}

function keywordsOf(...parts: readonly (string | readonly string[] | null | undefined)[]): string {
  return parts
    .flatMap((part) => (Array.isArray(part) ? part : part ? [part] : []))
    .join(' ')
    .toLowerCase();
}

const staticPages = [
  { group: 'Pages', label: 'Home', href: '/', description: 'Back to the start' },
  { group: 'Pages', label: 'About', href: '/about', description: 'Who I am, what I build, and what drives the work' },
  { group: 'Pages', label: 'Projects', href: '/projects', description: 'Case studies across AI, web, and creative tech' },
  { group: 'Pages', label: 'Contact', href: '/contact', description: 'Freelance, collaborations, or full-time roles' },
  { group: 'Pages', label: 'Bucket List', href: '/bucket-list', description: 'Things still ahead' },
  { group: 'Pages', label: 'Archive', href: '/archive', description: 'The collections' },
  { group: 'Music', label: 'Music', href: '/music', description: 'The listening room' },
  { group: 'Photography', label: 'Photography', href: '/archive/photography', description: 'How I see the world' },
  { group: 'Artwork', label: 'Art gallery', href: '/archive/artwork', description: 'Canvas, texture, colour' },
  { group: 'Books', label: 'Books', href: '/archive/books', description: 'Published writing, including The Inward Silhouette' },
  { group: 'Research', label: 'Research', href: '/archive/research', description: 'Two investigations into models, music, and making' },
  { group: 'Archive', label: 'Certifications', href: '/archive/certifications', description: 'The proof shelf' },
  { group: 'Philosophy', label: 'Philosophy', href: '/philosophy', description: 'Essays and reflections, filed when written' },
  { group: 'Elsewhere', label: 'Guest journal', href: '/journal', description: 'One public note in the margin' },
  { group: 'Elsewhere', label: 'Now', href: '/now', description: 'What I am doing at the moment' },
  { group: 'Elsewhere', label: 'Timeline', href: '/timeline', description: 'A life in progress' },
  { group: 'Elsewhere', label: 'Links', href: '/links', description: 'Social profiles and ways to follow the work' },
] as const;

const staticIndex: readonly SearchItem[] = staticPages.map((item) => ({
  group: item.group,
  label: item.label,
  href: item.href,
  description: item.description,
  keywords: keywordsOf(item.label, item.description),
}));

/**
 * Built on the server so the command palette ships a plain array instead of
 * pulling the whole content layer into the client bundle.
 */
export async function buildSearchIndex(): Promise<readonly SearchItem[]> {
  const [projects, books] = await Promise.all([getProjects(), getBooks()]);

  const projectItems: SearchItem[] = projects.map((project) => ({
    group: 'Projects',
    label: project.title,
    href: `/projects/${project.slug}`,
    description: project.category,
    keywords: keywordsOf(
      project.title,
      project.category,
      project.summary,
      project.hook,
      project.description,
      project.highlights,
      project.stack,
    ),
  }));

  const bookItems: SearchItem[] = books
    .filter((book) => !book.isPlaceholder)
    .map((book) => ({
      group: 'Books' as const,
      label: book.title,
      href: '/archive/books#the-inward-silhouette',
      description: 'Published book',
      keywords: keywordsOf(book.title, book.subtitle, book.synopsis),
    }));

  const researchItems: SearchItem[] = getResearchStudies().map((study) => ({
    group: 'Research',
    label: study.title,
    href: `/archive/research/${study.slug}`,
    description: study.status,
    keywords: keywordsOf(study.title, study.question, study.summary, study.progress, study.domains, study.status),
  }));

  const articleItems: SearchItem[] = (['research', 'essays', 'case-studies'] as const).flatMap((collection) =>
    publicArticles(loadCollection(collection)).map((article) => ({
      group: collection === 'essays' ? ('Philosophy' as const) : collection === 'research' ? ('Research' as const) : ('Projects' as const),
      label: article.title,
      href: article.href,
      description: article.summary,
      keywords: keywordsOf(article.title, article.summary, article.tags, article.status),
    })),
  );

  return [...staticIndex, ...projectItems, ...bookItems, ...researchItems, ...articleItems];
}
