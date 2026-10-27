import { getProjects } from '@/lib/content';
import { Section } from '@/components/layout/Section';
import { ProjectDetail } from '@/components/projects/ProjectDetail';
import { ArrowPill } from '@/components/ui/ArrowPill';
import { GradientWord } from '@/components/ui/GradientWord';

/** Home shows three studies. Framework and STEM stay on /projects. */
const homeSlugs = new Set(['sidequest', 'synesthesia', 'path']);

/**
 * Three studies on the homepage. Previews alternate sides. The full set is
 * the pill beside the heading.
 */
export async function FeaturedProject() {
  const projects = (await getProjects()).filter((project) => homeSlugs.has(project.slug));
  if (projects.length === 0) return null;

  return (
    <Section border="top" className="seam-after">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="display text-balance text-[clamp(2rem,4.2vw,3.15rem)] text-foreground">
            Curated <GradientWord>work</GradientWord>
          </h2>
          <p className="mt-4 max-w-sm text-[0.82rem] leading-6 text-muted">
            Three studies here. The rest of the set is one step further.
          </p>
        </div>
        <ArrowPill href="/projects" className="shrink-0">
          Projects
        </ArrowPill>
      </div>

      <div className="mt-16 grid gap-20 lg:mt-20 lg:gap-28">
        {projects.map((project, index) => (
          <ProjectDetail
            key={project.slug}
            project={project}
            titleAs="h3"
            facing={index % 2 === 0 ? 'card' : 'copy'}
          />
        ))}
      </div>
    </Section>
  );
}
