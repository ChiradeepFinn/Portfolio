import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LongformArticle } from '@/components/mdx/LongformArticle';
import { loadCollection, publicArticles } from '@/lib/mdx/files';
import { getPublicMdx } from '@/lib/mdx/registry';
import { withCanonical } from '@/lib/seo';

interface PageProps {
  readonly params: Promise<{ readonly slug: string }>;
}

export function generateStaticParams() {
  return publicArticles(loadCollection('essays')).map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getPublicMdx('essays', slug);
  if (!article) return { title: 'Essay not found', robots: { index: false, follow: false } };

  return withCanonical(article.meta.href, {
    title: article.meta.title,
    description: article.meta.summary,
    openGraph: {
      title: article.meta.title,
      description: article.meta.summary,
      type: 'article',
    },
  });
}

export default async function EssayPage({ params }: PageProps) {
  const { slug } = await params;
  const article = getPublicMdx('essays', slug);
  if (!article) notFound();
  const { Component } = article;

  return (
    <LongformArticle meta={article.meta}>
      <Component />
    </LongformArticle>
  );
}
