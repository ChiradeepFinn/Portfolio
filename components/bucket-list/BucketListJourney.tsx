'use client';

import { useRef } from 'react';
import { useScroll } from 'framer-motion';
import type { BucketChapter, BucketDream } from '@/lib/data/bucket-list';
import { useHydratedReducedMotion } from '@/lib/use-hydrated-reduced-motion';
import { Container } from '@/components/layout/Container';
import { TextParallaxContent, ParallaxFigure } from './TextParallaxContent';
import { cn } from '@/lib/utils';

type BucketListJourneyProps = {
  readonly chapters: readonly BucketChapter[];
};

export function BucketListJourney({ chapters }: BucketListJourneyProps) {
  return (
    <div className="pb-8 sm:pb-12">
      {chapters.map((chapter) => (
        <TextParallaxContent
          key={chapter.id}
          imgUrl={chapter.image}
          alt={chapter.alt}
          subheading={chapter.label}
          heading={chapter.heading}
          className="mt-6 first:mt-0 sm:mt-10"
        >
          <DreamList chapter={chapter} />
        </TextParallaxContent>
      ))}
    </div>
  );
}

function DreamList({ chapter }: { readonly chapter: BucketChapter }) {
  return (
    <Container width="default" className="pt-14 pb-16 sm:pt-20 sm:pb-28">
      <ol className="space-y-14 sm:space-y-20 lg:space-y-24">
        {chapter.dreams.map((dream, index) => (
          <DreamRow key={dream.id} dream={dream} index={index} />
        ))}
      </ol>
    </Container>
  );
}

function DreamRow({ dream, index }: { readonly dream: BucketDream; readonly index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const reduce = useHydratedReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const imageFirst = index % 2 === 0;

  return (
    <li
      ref={ref}
      className={cn(
        'grid items-center gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-12',
      )}
    >
      <div
        className={cn(
          'lg:col-span-4',
          imageFirst ? 'lg:order-1' : 'lg:order-2 lg:col-start-9',
        )}
      >
        <ParallaxFigure
          src={dream.image}
          alt={dream.alt}
          progress={scrollYProgress}
          reduce={reduce}
          range={imageFirst ? [36, -36] : [28, -48]}
          className="mx-auto w-full max-w-[14.5rem] sm:max-w-[16rem] lg:mx-0 lg:max-w-none"
        />
      </div>

      <div
        className={cn(
          'max-w-xl lg:col-span-7',
          imageFirst ? 'lg:order-2 lg:col-start-6' : 'lg:order-1 lg:col-start-1',
        )}
      >
        <p className="meta text-muted-2">{String(index + 1).padStart(2, '0')}</p>
        <h3 className="display mt-3 text-[clamp(1.55rem,3.2vw,2.35rem)] leading-[1.12] text-foreground">
          {dream.title}
        </h3>
        <p className="body-copy mt-4 max-w-md">{dream.note}</p>
      </div>
    </li>
  );
}
