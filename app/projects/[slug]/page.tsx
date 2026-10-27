import type { ComponentType } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getCaseStudy } from '@/lib/data/case-studies';
import { getProjectBySlug, getProjects } from '@/lib/content';
import type { Project } from '@/lib/types';
import { Section } from '@/components/layout/Section';
import { MdxProse } from '@/components/mdx/LongformArticle';
import { CaseStudy } from '@/components/projects/CaseStudy';
import { CaseStudyAtmosphere } from '@/components/projects/CaseStudyAtmosphere';
import { CaseStudyHeader } from '@/components/projects/CaseStudyHeader';
import { ProjectHero } from '@/components/projects/ProjectDetail';
import { getPublicMdx } from '@/lib/mdx/registry';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbGraph, faqGraph, markdownAlternate, projectGraph, withCanonical } from '@/lib/seo';

interface PageProps {
  readonly params: Promise<{ readonly slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: 'Project not found', robots: { index: false, follow: false } };
  return withCanonical(`/projects/${project.slug}`, {
    title: project.title,
    description: project.summary,
    alternates: { types: markdownAlternate(`/projects/${project.slug}`) },
    openGraph: { title: project.title, description: project.summary, type: 'article' },
  });
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const [project, projects] = await Promise.all([getProjectBySlug(slug), getProjects()]);
  if (!project) notFound();

  const study = getCaseStudy(project.slug);
  const longform = getPublicMdx('case-studies', project.slug);
  // Only the studies that already show a question list. The markup repeats what the page renders.
  const faq = study ? faqGraph(`/projects/${project.slug}`, study.faq) : null;
  const index = projects.findIndex((item) => item.slug === project.slug);
  const previous = index > 0 ? projects[index - 1] : undefined;
  const next = index >= 0 && index < projects.length - 1 ? projects[index + 1] : undefined;

  const crumbs = breadcrumbGraph([
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: project.title },
  ]);

  return (
    <>
      <JsonLd data={projectGraph(project)} />
      {crumbs ? <JsonLd data={crumbs} /> : null}
      {faq ? <JsonLd data={faq} /> : null}
      <Section
        className="overflow-hidden pt-32 pb-0 sm:pt-36"
        containerClassName="z-10"
        backdrop={<CaseStudyAtmosphere key={project.slug} slug={project.slug} />}
      >
        <CaseStudyHeader project={project} kind={study?.kind} />
      </Section>

      <Section className="pt-12">
        {study?.pitch ? (
          <p className="max-w-2xl font-display text-[clamp(1.45rem,2.6vw,1.9rem)] leading-[1.35] text-foreground italic">
            {study.pitch}
          </p>
        ) : null}
        <div className="mt-12">
          <ProjectHero project={project} />
        </div>
        {study ? <CaseStudy study={study} /> : null}
        {longform ? <CaseStudyBody Component={longform.Component} /> : null}
        <ProjectPager previous={previous} next={next} />
      </Section>
    </>
  );
}

function CaseStudyBody({ Component }: { readonly Component: ComponentType }) {
  return (
    <MdxProse>
      <Component />
    </MdxProse>
  );
}

function ProjectPager({
  previous,
  next,
}: {
  readonly previous?: Project;
  readonly next?: Project;
}) {
  return (
    <nav aria-label="More studies" className="grid border-t border-border sm:grid-cols-2">
      {previous ? (
        <Link href={`/projects/${previous.slug}`} className="group border-b border-border py-8 sm:border-r sm:border-b-0 sm:pr-8">
          <span className="inline-flex items-center gap-2 text-[0.68rem] tracking-[0.14em] text-muted-2 uppercase">
            <ArrowLeft size={13} aria-hidden="true" />
            Previous
          </span>
          <span className="mt-3 block font-display text-2xl text-foreground italic">{previous.title}</span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
      {next ? (
        <Link
          href={`/projects/${next.slug}`}
          className="group py-8 sm:pl-8 sm:text-right"
        >
          <span className="inline-flex items-center gap-2 text-[0.68rem] tracking-[0.14em] text-muted-2 uppercase">
            Next
            <ArrowRight size={13} aria-hidden="true" />
          </span>
          <span className="mt-3 block font-display text-2xl text-foreground italic">{next.title}</span>
        </Link>
      ) : null}
    </nav>
  );
}
