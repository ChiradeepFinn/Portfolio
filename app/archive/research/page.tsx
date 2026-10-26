import type { Metadata } from 'next';
import { withCanonical } from '@/lib/seo';
import Link from 'next/link';
import { getResearchStudies } from '@/lib/content';
import type { ResearchStatus, ResearchStudy } from '@/lib/data/research';
import { researchWorld } from '@/lib/data/worlds';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { ArrowPill } from '@/components/ui/ArrowPill';
import { Schematic } from '@/components/research/Schematic';
import { ResearchIntro } from '@/components/worlds/ResearchIntro';
import { cn } from '@/lib/utils';

const description = researchWorld.lead;

export const metadata: Metadata = withCanonical('/archive/research', {
  title: 'Research',
  description,
  openGraph: {
    title: 'Research',
    description,
  },
});

const groups: readonly { readonly status: ResearchStatus; readonly id: string; readonly note: string }[] = [
  {
    status: 'In progress',
    id: 'in-progress',
    note: 'Planning and literature review. The files are in hand, and they are not yet ready for training.',
  },
  {
    status: 'Done',
    id: 'done',
    note: 'The evaluation has been carried out. Done is the state of the study, not a venue or a DOI.',
  },
];

export default function ResearchPage() {
  const studies = getResearchStudies();
  const inProgress = studies.filter((study) => study.status === 'In progress').length;
  const done = studies.filter((study) => study.status === 'Done').length;

  return (
    <>
      <ResearchIntro studies={studies} />

      <Section id="investigations" className="scroll-mt-28 pt-0" labelledBy="investigations-heading">
        <h2 id="investigations-heading" className="sr-only">
          Investigations
        </h2>
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-b border-border pb-6">
          <p className="text-sm text-muted">{tally(studies.length, 'investigations')}</p>
          <p className="text-sm text-muted">
            {tally(inProgress, 'In progress')} · {tally(done, 'Done')}
          </p>
        </div>

        <div className="mt-16 grid gap-20">
          {groups.map((group) => {
            const items = studies.filter((study) => study.status === group.status);
            if (items.length === 0) return null;

            return (
              <section key={group.status} aria-labelledby={group.id}>
                <h2 id={group.id} className="display text-[clamp(1.6rem,3vw,2.1rem)] text-foreground">
                  {group.status}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{group.note}</p>
                <div className="mt-8">
                  {items.map((study, index) => (
                    <Reveal key={study.slug} delay={index * 0.05}>
                      <StudyCard study={study} />
                    </Reveal>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </Section>
    </>
  );
}

function StudyCard({ study }: { readonly study: ResearchStudy }) {
  const figureFirst = study.figure === 'ideation';

  return (
    <article className="border-t border-border py-12">
      <div
        className={cn(
          'grid items-start gap-10 lg:items-center lg:gap-16',
          figureFirst ? 'lg:grid-cols-[17rem_minmax(0,1fr)]' : 'lg:grid-cols-[minmax(0,1fr)_17rem]',
        )}
      >
        <div className={figureFirst ? 'lg:order-2' : undefined}>
          <div className="flex items-baseline justify-between gap-6">
            <p className="meta">{study.index}</p>
            <p className="text-sm font-medium text-foreground">{study.status}</p>
          </div>
          <h3 className="display mt-5 text-balance text-[clamp(1.45rem,2.6vw,2.05rem)] leading-[1.14] text-foreground">
            <Link href={`/archive/research/${study.slug}`} className="transition-colors duration-200 hover:text-warm-2">
              {study.title}
            </Link>
          </h3>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">{study.domains.join(' · ')}</p>
          <p className="mt-5 max-w-xl font-display text-[1.15rem] leading-snug text-foreground italic">{study.question}</p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-2">{study.progress}</p>
          <ArrowPill
            href={`/archive/research/${study.slug}`}
            ariaLabel={`Read investigation ${study.index}: ${study.title}`}
            className="mt-8"
          >
            Read the investigation
          </ArrowPill>
        </div>
        <div className={figureFirst ? 'lg:order-1' : undefined}>
          <Schematic kind={study.figure} />
        </div>
      </div>
    </article>
  );
}

function tally(count: number, label: string) {
  return `${String(count).padStart(2, '0')} ${label}`;
}
