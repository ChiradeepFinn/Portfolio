import type { Metadata } from 'next';
import { configuredOrigin } from '@/lib/http/origin';
import { media } from '@/lib/media';
import { identity, socialProfiles } from '@/lib/site';
import type { Book, Project } from '@/lib/types';

export const siteDescription =
  "I'm Chiradeep - a creative technologist working across AI, web, music, and visual storytelling.";

/** Approved absolute homepage document title (option 3). */
export const HOME_PAGE_TITLE = 'Chiradeep - Creative Technologist, AI & Web';

/** Stable node ids for the Person / WebSite graph Google expects on the home page. */
export const personId = () => absoluteUrl('/#person');
export const websiteId = () => absoluteUrl('/#website');

/** Absolute URL when the public site origin is configured. Relative until then. */
export function absoluteUrl(path: string): string {
  const origin = configuredOrigin();
  if (!origin) return path;
  return new URL(path, origin).toString();
}

/** Feed discovery, repeated on every page so a reader finds it wherever it lands. */
export const feedAlternateTypes = {
  'application/rss+xml': [{ url: '/rss.xml', title: `${identity.name} - published work` }],
};

/** The Markdown twin of one page, for a reader that prefers plain text. */
export function markdownAlternate(path: string) {
  return { 'text/markdown': [{ url: `${path}.md`, title: 'Markdown' }] };
}

export function withCanonical(path: string, meta: Metadata): Metadata {
  const openGraph = meta.openGraph && typeof meta.openGraph === 'object' ? meta.openGraph : {};
  const twitter = meta.twitter && typeof meta.twitter === 'object' ? meta.twitter : {};
  const alternates = meta.alternates ?? {};

  return {
    ...meta,
    alternates: {
      ...alternates,
      canonical: path,
      types: { ...feedAlternateTypes, ...(alternates.types ?? {}) },
    },
    openGraph: {
      type: 'website',
      siteName: identity.name,
      locale: 'en_IN',
      ...openGraph,
      url: path,
      images: openGraph.images ?? [
        { url: '/opengraph-image', width: 1200, height: 630, alt: 'Chiradeep, creative technologist' },
      ],
    },
    twitter: {
      ...twitter,
      card: 'summary_large_image',
      images: twitter.images ?? ['/opengraph-image'],
    },
  };
}

function sameAsProfiles(): string[] {
  return socialProfiles
    .map((profile) => profile.href)
    .filter((href): href is string => typeof href === 'string' && href.startsWith('https://'));
}

/** Person node shared by home, about, and author references. */
export function personNode() {
  return {
    '@type': 'Person' as const,
    '@id': personId(),
    name: identity.name,
    // No alternateName unless the owner later approves explicit aliases.
    jobTitle: identity.role,
    description: siteDescription,
    email: identity.email,
    url: absoluteUrl('/about'),
    image: absoluteUrl(media.images.profile),
    address: {
      '@type': 'PostalAddress' as const,
      addressLocality: 'Karur',
      addressRegion: 'Tamil Nadu',
      addressCountry: 'IN',
    },
    knowsAbout: [
      'Artificial intelligence',
      'Web development',
      'Creative technology',
      'Music',
      'Photography',
      'Visual storytelling',
    ],
    sameAs: sameAsProfiles(),
  };
}

/**
 * Home-page graph for site name + identity.
 * @see https://developers.google.com/search/docs/appearance/site-names
 */
export function homeGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      personNode(),
      {
        '@type': 'WebSite',
        '@id': websiteId(),
        name: identity.name,
        // Domain last so Google can fall back to chiradeep.me if the brand name is contested.
        alternateName: [identity.brand, 'Chiradeep Portfolio', 'chiradeep.me'],
        url: absoluteUrl('/'),
        description: siteDescription,
        inLanguage: 'en-IN',
        publisher: { '@id': personId() },
        author: { '@id': personId() },
      },
      {
        '@type': 'WebPage',
        '@id': absoluteUrl('/'),
        url: absoluteUrl('/'),
        name: HOME_PAGE_TITLE,
        description: siteDescription,
        isPartOf: { '@id': websiteId() },
        about: { '@id': personId() },
        primaryImageOfPage: absoluteUrl('/opengraph-image'),
      },
    ],
  };
}

/**
 * About page as a ProfilePage. Matches Google's creator-profile guidance.
 * @see https://developers.google.com/search/docs/appearance/structured-data/profile-page
 */
export function profilePageGraph() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': absoluteUrl('/about'),
    url: absoluteUrl('/about'),
    name: `About - ${identity.name}`,
    isPartOf: { '@id': websiteId() },
    mainEntity: personNode(),
  };
}

/**
 * Contact page + FAQ that the page already renders.
 * @see https://developers.google.com/search/docs/appearance/structured-data/contact-point
 * @see https://developers.google.com/search/docs/appearance/structured-data/faqpage
 */
export function contactPageGraph(
  faq: readonly { readonly question: string; readonly answer: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ContactPage',
        '@id': absoluteUrl('/contact'),
        url: absoluteUrl('/contact'),
        name: `Contact - ${identity.name}`,
        description:
          'Get in touch with Chiradeep about freelance work, collaborations, or a full-time role across AI, web, and creative technology.',
        isPartOf: { '@id': websiteId() },
        about: { '@id': personId() },
        mainEntity: { '@id': personId() },
      },
      ...(faq.length > 0
        ? [
            {
              '@type': 'FAQPage' as const,
              '@id': absoluteUrl('/contact#faq'),
              url: absoluteUrl('/contact'),
              mainEntity: faq.map((item) => ({
                '@type': 'Question' as const,
                name: item.question,
                acceptedAnswer: {
                  '@type': 'Answer' as const,
                  text: item.answer,
                },
              })),
            },
          ]
        : []),
    ],
  };
}

export type BreadcrumbCrumb = {
  readonly name: string;
  /** Omit on the last crumb; Google uses the page URL. */
  readonly path?: string;
};

/**
 * Breadcrumb trail that mirrors the visible hierarchy.
 * @see https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
 */
export function breadcrumbGraph(crumbs: readonly BreadcrumbCrumb[]) {
  if (crumbs.length < 2) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => {
      const position = index + 1;
      const isLast = index === crumbs.length - 1;
      return {
        '@type': 'ListItem' as const,
        position,
        name: crumb.name,
        ...(!isLast && crumb.path ? { item: absoluteUrl(crumb.path) } : {}),
      };
    }),
  };
}

export function bookGraph(books: readonly Book[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': books
      .filter((book) => !book.isPlaceholder && book.title.trim().length > 0)
      .map((book) => ({
        '@type': 'Book',
        name: book.title,
        author: { '@id': personId() },
        url: absoluteUrl('/archive/books'),
        ...(book.year ? { datePublished: book.year } : {}),
        ...(book.publisher ? { publisher: { '@type': 'Organization', name: book.publisher } } : {}),
      })),
  };
}

export function projectGraph(project: Project) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.summary,
    url: absoluteUrl(`/projects/${project.slug}`),
    author: { '@id': personId() },
    ...(project.liveUrl ? { sameAs: project.liveUrl } : {}),
  };
}

/**
 * Article / essay markup. Only fields that appear on the page.
 * @see https://developers.google.com/search/docs/appearance/structured-data/article
 */
export function articleGraph(input: {
  readonly path: string;
  readonly headline: string;
  readonly description: string;
  /** Real publish date only. Never invent one for unfinished work. */
  readonly datePublished?: string | null;
  readonly dateModified?: string | null;
  readonly image?: string | null;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    url: absoluteUrl(input.path),
    mainEntityOfPage: absoluteUrl(input.path),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    author: {
      '@type': 'Person',
      '@id': personId(),
      name: identity.name,
      description: siteDescription,
      url: absoluteUrl('/about'),
    },
    publisher: {
      '@type': 'Person',
      '@id': personId(),
      name: identity.name,
      description: siteDescription,
      url: absoluteUrl('/about'),
    },
    ...(input.image ? { image: [absoluteUrl(input.image)] } : {}),
  };
}

/**
 * `FAQPage` for questions a page already shows.
 *
 * Only the case studies that carry their own question list get this, and the
 * markup repeats their visible text verbatim. No question is written for the
 * structured data, and a page without questions does not get an empty graph.
 */
export function faqGraph(
  path: string,
  faq: readonly { readonly question: string; readonly answer: string }[],
) {
  if (faq.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    url: absoluteUrl(path),
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
