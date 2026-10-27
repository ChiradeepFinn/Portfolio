import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getResearchStudies, getResearchStudy } from '@/lib/content';
import { Section } from '@/components/layout/Section';
import { LongformArticle } from '@/components/mdx/LongformArticle';
import { ResearchDocument } from '@/components/research/ResearchDocument';
import { loadCollection, publicArticles } from '@/lib/mdx/files';
import { getPublicMdx } from '@/lib/mdx/registry';
import { JsonLd } from '@/components/seo/JsonLd';
import { articleGraph, breadcrumbGraph, markdownAlternate, withCanonical } from '@/lib/seo';

interface PageProps {
  readonly params: Promise<{ readonly slug: string }>;
}

export function generateStaticParams() {
  const studies = getResearchStudies().map((study) => ({ slug: study.slug }));
  const notes = publicArticles(loadCollection('research')).map((article) => ({ slug: article.slug }));
  return [...studies, ...notes];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getResearchStudy(slug);
  const note = study ? undefined : getPublicMdx('research', slug);
  if (!study && note) {
    return withCanonical(note.meta.href, {
      title: note.meta.title,
      description: note.meta.summary,
      alternates: { types: markdownAlternate(note.meta.href) },
      openGraph: {
        title: note.meta.title,
        description: note.meta.summary,
        type: 'article',
      },
    });
  }
  if (!study) return { title: 'Research not found', robots: { index: false, follow: false } };

  const path = `/archive/research/${study.slug}`;

  return withCanonical(path, {
    title: study.title,
    description: study.summary,
    alternates: { types: markdownAlternate(path) },
    openGraph: {
      title: study.title,
      description: study.summary,
      type: 'article',
    },
  });
}

export default async function ResearchStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const study = getResearchStudy(slug);
  if (!study) {
    const note = getPublicMdx('research', slug);
    if (!note) notFound();
    const { Component } = note;
    const noteCrumbs = breadcrumbGraph([
      { name: 'Archive', path: '/archive' },
      { name: 'Research', path: '/archive/research' },
      { name: note.meta.title },
    ]);
    return (
      <>
        <JsonLd
          data={articleGraph({
            path: note.meta.href,
            headline: note.meta.title,
            description: note.meta.summary,
            datePublished: note.meta.publishedAt,
            image: note.meta.coverImage,
          })}
        />
        {noteCrumbs ? <JsonLd data={noteCrumbs} /> : null}
        <LongformArticle meta={note.meta}>
          <Component />
        </LongformArticle>
      </>
    );
  }

  const studies = getResearchStudies();
  const index = studies.findIndex((item) => item.slug === study.slug);
  const previous = index > 0 ? studies[index - 1] : undefined;
  const next = index >= 0 && index < studies.length - 1 ? studies[index + 1] : undefined;
  const path = `/archive/research/${study.slug}`;
  const studyCrumbs = breadcrumbGraph([
    { name: 'Archive', path: '/archive' },
    { name: 'Research', path: '/archive/research' },
    { name: study.title },
  ]);

  return (
    <>
      <JsonLd
        data={articleGraph({
          path,
          headline: study.title,
          description: study.summary,
        })}
      />
      {studyCrumbs ? <JsonLd data={studyCrumbs} /> : null}
      <Section className="pt-32 sm:pt-36">
        <ResearchDocument study={study} previous={previous} next={next} />
      </Section>
    </>
  );
}
