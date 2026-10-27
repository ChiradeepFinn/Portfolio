import type { Metadata } from 'next';
import { withCanonical } from '@/lib/seo';
import Link from 'next/link';
import { getProjects } from '@/lib/content';
import { siteStudy } from '@/lib/data/site-stack';
import { projectsWorld } from '@/lib/data/worlds';
import { Section } from '@/components/layout/Section';
import { ProjectDetail } from '@/components/projects/ProjectDetail';
import { PortfolioStudy } from '@/components/projects/PortfolioStudy';
import { IntroFrame, WorldHeadline, WorldIndex } from '@/components/worlds/WorldMarks';

export const metadata: Metadata = withCanonical('/projects', {
  title: 'Projects',
  description:
    'Selected projects and case studies - AI products, web apps, and creative technology builds from concept through ship.',
});

export default async function ProjectsPage() {
  const projects = await getProjects();
  /** Seed order on the spine: Sidequest first (06) … Portfolio last (01). */
  const studies = projects;
  const spineCount = studies.length + 1;

  return (
    <>
      <IntroFrame atmosphere="atmos-blueprint">
        <div className="lg:flex lg:items-start lg:justify-between lg:gap-x-10">
          <WorldIndex label={projectsWorld.label} className="text-accent-blue lg:order-2 lg:pt-3" />
          <div className="mt-5 min-w-0 lg:order-1 lg:mt-0 lg:max-w-3xl">
            <WorldHeadline
              headline={projectsWorld.headline}
              className="text-[clamp(2.3rem,5.2vw,4.1rem)]"
            />
            <p className="body-copy mt-6 max-w-xl">{projectsWorld.lead}</p>
          </div>
        </div>
        <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
          {studies.map((project) => (
            <li key={project.slug}>
              <Link
                href={`#${project.slug}`}
                className="text-sm text-muted transition-colors duration-200 hover:text-foreground"
              >
                {project.title}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href={`#${siteStudy.id}`}
              className="text-sm text-muted transition-colors duration-200 hover:text-foreground"
            >
              {siteStudy.title}
            </Link>
          </li>
        </ul>
      </IntroFrame>

      <Section id="studies" className="pt-0" labelledBy="studies-heading">
        <h2 id="studies-heading" className="sr-only">
          Studies
        </h2>
        <div className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1 bottom-1 left-[1.375rem] w-px bg-foreground/55 [mask-image:linear-gradient(to_bottom,transparent,black_3%,black_97%,transparent)] lg:left-1/2 lg:w-[2px] lg:-translate-x-1/2"
          />
          <ol className="grid gap-20 lg:gap-28">
            {studies.map((project, index) => {
              const number = String(spineCount - index).padStart(2, '0');
              return (
                <li
                  id={project.slug}
                  key={project.slug}
                  className="relative grid scroll-mt-28 grid-cols-[2.75rem_minmax(0,1fr)] items-start lg:grid-cols-1"
                >
                  <p
                    aria-hidden="true"
                    className="display relative z-10 justify-self-center bg-background pt-1 text-[1.15rem] leading-none text-foreground/70 italic lg:absolute lg:top-[0.35rem] lg:left-1/2 lg:-translate-x-1/2 lg:px-3 lg:pt-0 lg:text-[1.45rem]"
                  >
                    {number}
                  </p>
                  <ProjectDetail
                    project={project}
                    titleAs="h2"
                    timeline
                    facing={index % 2 === 0 ? 'copy' : 'card'}
                  />
                </li>
              );
            })}

            <li
              id={siteStudy.id}
              className="relative grid scroll-mt-28 grid-cols-[2.75rem_minmax(0,1fr)] items-start lg:grid-cols-1"
            >
              <p
                aria-hidden="true"
                className="display relative z-10 justify-self-center bg-background pt-1 text-[1.15rem] leading-none text-foreground/70 italic lg:absolute lg:top-[0.35rem] lg:left-1/2 lg:-translate-x-1/2 lg:px-3 lg:pt-0 lg:text-[1.45rem]"
              >
                01
              </p>
              <PortfolioStudy />
            </li>
          </ol>
        </div>
      </Section>
    </>
  );
}
