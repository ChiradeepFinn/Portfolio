import type { Metadata } from 'next';
import { configuredOrigin } from '@/lib/http/origin';
import { identity, socialProfiles } from '@/lib/site';
import type { Book, Project } from '@/lib/types';

export const siteDescription =
  'Chiradeep is a multidisciplinary creative technologist working across AI, web development, music, writing, photography, and research.';

/** Absolute URL when the public site origin is configured. Relative until then. */
export function absoluteUrl(path: string): string {
  const origin = configuredOrigin();
  if (!origin) return path;
  return new URL(path, origin).toString();
}

export function withCanonical(path: string, meta: Metadata): Metadata {
  const openGraph = meta.openGraph && typeof meta.openGraph === 'object' ? meta.openGraph : {};
  const twitter = meta.twitter && typeof meta.twitter === 'object' ? meta.twitter : {};

  return {
    ...meta,
    alternates: { ...meta.alternates, canonical: path },
    openGraph: {
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

export function homeGraph() {
  const sameAs = socialProfiles
    .map((profile) => profile.href)
    .filter((href): href is string => typeof href === 'string' && href.startsWith('https://'));

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        name: identity.name,
        alternateName: [identity.brand, identity.firstName],
        jobTitle: identity.role,
        email: identity.email,
        url: absoluteUrl('/'),
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Karur',
          addressRegion: 'Tamil Nadu',
          addressCountry: 'IN',
        },
        sameAs,
      },
      {
        '@type': 'WebSite',
        name: identity.name,
        alternateName: [identity.brand, 'Chiradeep Portfolio'],
        url: absoluteUrl('/'),
        description: siteDescription,
      },
    ],
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
        author: { '@type': 'Person', name: identity.name },
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
    author: { '@type': 'Person', name: identity.name },
    ...(project.liveUrl ? { sameAs: project.liveUrl } : {}),
  };
}
