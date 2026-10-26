import 'server-only';

import type { ComponentType } from 'react';
import Template, { frontmatter as templateFrontmatter } from '@/content/essays/article-template.mdx';
import { findArticle, loadCollection, type ArticleMeta } from '@/lib/mdx/files';
import { assertSlugSetsMatch, ContentError, parseFrontmatter, type CollectionId } from '@/lib/mdx/schema';

interface RegisteredArticle {
  readonly Component: ComponentType;
  readonly frontmatter: unknown;
}

const registries: Record<CollectionId, Record<string, RegisteredArticle>> = {
  research: {},
  essays: {
    'article-template': { Component: Template, frontmatter: templateFrontmatter },
  },
  'case-studies': {},
};

for (const collection of ['research', 'essays', 'case-studies'] as const) {
  const onDisk = loadCollection(collection);
  const registered = registries[collection];
  assertSlugSetsMatch(
    collection,
    onDisk.map((article) => article.slug),
    Object.keys(registered),
  );

  for (const article of onDisk) {
    const exported = parseFrontmatter(registered[article.slug]?.frontmatter, article.relativePath);
    if (exported.slug !== article.slug || exported.title !== article.title || exported.status !== article.status) {
      throw new ContentError(
        `${article.relativePath} frontmatter does not match the export compiled from that file.`,
      );
    }
  }
}

export function getPublicMdx(
  collection: CollectionId,
  slug: string,
): { readonly meta: ArticleMeta; readonly Component: ComponentType } | null {
  const meta = findArticle(collection, slug);
  const registered = registries[collection][slug];
  if (!meta || !registered) return null;
  return { meta, Component: registered.Component };
}
