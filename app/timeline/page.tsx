import type { Metadata } from 'next';
import { withCanonical } from '@/lib/seo';
import { timelineChapters, timelineClosing } from '@/lib/data/timeline';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { ArrowPill } from '@/components/ui/ArrowPill';
import { TimelineJourney } from '@/components/timeline/TimelineJourney';
import { GradientWord } from '@/components/ui/GradientWord';

export const metadata: Metadata = withCanonical('/timeline', {
  title: 'Timeline',
  description:
    'A life in progress. Curiosity, across technology, music, writing, and research - still being written.',
});

const disciplines = ['Technology', 'Music', 'Words', 'Ideas'] as const;

export default function TimelinePage() {
  return (
    <>
      <header className="relative">
        <Container className="pt-36 pb-6 sm:pt-44 sm:pb-8">
          <p className="eyebrow text-accent-blue">The story so far</p>
          <h1 className="display mt-5 max-w-3xl text-balance text-[clamp(2.6rem,6.4vw,4.75rem)] text-foreground">
            A life <GradientWord>in progress.</GradientWord>
          </h1>
          <p className="body-copy mt-6 max-w-xl">
            Not a story of having everything figured out. A story of slowly discovering what I could become.
          </p>
          <ul className="meta mt-8 flex flex-wrap gap-x-5 gap-y-2 uppercase tracking-[0.16em]">
            {disciplines.map((word) => (
              <li key={word}>{word}</li>
            ))}
          </ul>
          <ArrowPill href="#chapters" className="mt-10">
            The chapters
          </ArrowPill>
        </Container>
      </header>

      <Section id="chapters" className="scroll-mt-28 pt-0" labelledBy="chapters-heading">
        <h2 id="chapters-heading" className="sr-only">
          Chapters
        </h2>

        <blockquote className="max-w-2xl border-t border-border pt-8">
          <p className="font-display text-[clamp(1.45rem,2.8vw,2.05rem)] leading-snug text-foreground">
            Every version of me led here.
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
            I didn&apos;t have the whole picture. I started with curiosity.
          </p>
        </blockquote>

        <TimelineJourney chapters={timelineChapters} />

        <div className="timeline-chapter mt-20 max-w-3xl border-t border-border pt-12 sm:mt-28 sm:pt-16">
          <p className="meta uppercase tracking-[0.16em]">Still writing</p>
          <p className="display mt-5 text-[clamp(1.85rem,4vw,3.1rem)] leading-[1.08] text-balance text-foreground">
            <span className="italic">{timelineClosing.lead}</span>{' '}
            <span className="mt-3 block">{timelineClosing.rest}</span>
          </p>
        </div>
      </Section>
    </>
  );
}
