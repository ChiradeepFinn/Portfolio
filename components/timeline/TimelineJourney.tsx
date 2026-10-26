'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useReducedMotion } from 'framer-motion';
import type { TimelineChapter } from '@/lib/data/timeline';
import { cn } from '@/lib/utils';

interface TimelineJourneyProps {
  readonly chapters: readonly TimelineChapter[];
}

/**
 * A left-hand thread, not a two-sided résumé. Narrative stays on one edge so
 * the chapters can be read straight down. A figure, when one exists, sits
 * beside the text on large screens and under it on small ones.
 */
export function TimelineJourney({ chapters }: TimelineJourneyProps) {
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const [seen, setSeen] = useState<ReadonlySet<string>>(() => new Set());

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    if (reduce) {
      setSeen(new Set(chapters.map((chapter) => chapter.slug)));
      return;
    }

    const nodes = list.querySelectorAll<HTMLElement>('[data-chapter]');
    const observer = new IntersectionObserver(
      (entries) => {
        setSeen((current) => {
          let changed = false;
          const next = new Set(current);
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const id = entry.target.getAttribute('data-chapter');
            if (id && !next.has(id)) {
              next.add(id);
              changed = true;
            }
          }
          return changed ? next : current;
        });
      },
      { rootMargin: '0px 0px -18% 0px', threshold: 0.2 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [chapters, reduce]);

  return (
    <ol ref={listRef} className="mt-16 sm:mt-20">
      {chapters.map((chapter, index) => (
        <Chapter
          key={chapter.slug}
          chapter={chapter}
          index={index}
          isLast={index === chapters.length - 1}
          seen={seen.has(chapter.slug)}
        />
      ))}
    </ol>
  );
}

function Chapter({
  chapter,
  index,
  isLast,
  seen,
}: {
  readonly chapter: TimelineChapter;
  readonly index: number;
  readonly isLast: boolean;
  readonly seen: boolean;
}) {
  const ahead = chapter.phase === 'future';
  const present = chapter.phase === 'present';
  const label = chapter.dateTime ? (
    <time dateTime={chapter.dateTime}>{chapter.label}</time>
  ) : (
    chapter.label
  );

  return (
    <li
      data-chapter={chapter.slug}
      className={cn('grid grid-cols-[1rem_minmax(0,1fr)] gap-x-4 sm:grid-cols-[1.25rem_minmax(0,1fr)] sm:gap-x-7', ahead && 'mt-4')}
    >
      <div className="relative flex justify-center" aria-hidden="true">
        <span
          className={cn(
            'absolute bottom-0 left-1/2 w-px -translate-x-1/2',
            index === 0 ? 'top-3' : 'top-0',
            ahead
              ? 'bg-[repeating-linear-gradient(to_bottom,var(--color-warm-2)_0_5px,transparent_5px_10px)]'
              : 'bg-border',
          )}
        />
        <span
          className={cn(
            'relative z-10 mt-1.5 grid h-3.5 w-3.5 place-items-center rounded-full border bg-background motion-reduce:transition-none',
            ahead ? 'border-warm-2' : 'border-foreground/35',
            'transition-colors duration-500',
          )}
        >
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full motion-reduce:transition-none transition-colors duration-500',
              seen && ahead && 'bg-warm-2',
              seen && !ahead && 'bg-foreground',
              !seen && 'bg-transparent',
            )}
          />
        </span>
      </div>

      <div className={cn('min-w-0 pb-16 sm:pb-24', isLast && 'pb-0')}>
        <p
          className={cn(
            'meta uppercase tracking-[0.16em]',
            ahead ? 'text-warm-2' : 'text-muted-2',
            present && 'text-foreground',
          )}
        >
          {label}
        </p>

        <div className="timeline-chapter">
          <div
            className={cn(
              chapter.figure &&
                'lg:grid lg:grid-cols-[minmax(0,36rem)_13.5rem] lg:items-start lg:gap-x-14',
            )}
          >
            <div className={cn(!chapter.figure && 'max-w-[36rem]')}>
              <h2
                className={cn(
                  'display mt-3 text-[clamp(1.7rem,3.2vw,2.45rem)] text-balance text-foreground',
                  ahead && 'italic',
                )}
              >
                {chapter.title}
              </h2>
              <p
                className={cn(
                  'mt-3 font-display text-[1.05rem] leading-snug italic sm:text-lg',
                  ahead ? 'text-warm-2' : 'text-muted',
                )}
              >
                {chapter.subtitle}
              </p>
              <div className="mt-5 grid max-w-[36rem] gap-4">
                {chapter.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-[1.02rem] leading-[1.75] text-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
              {ahead ? (
                <p className="meta mt-6 uppercase tracking-[0.16em] text-warm-2">An ambition, not a milestone</p>
              ) : null}
              {chapter.links.length > 0 ? (
                <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
                  {chapter.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="link-underline text-sm text-foreground">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            {chapter.figure ? <ChapterFigure figure={chapter.figure} /> : null}
          </div>
        </div>
      </div>
    </li>
  );
}

function ChapterFigure({ figure }: { readonly figure: NonNullable<TimelineChapter['figure']> }) {
  return (
    <figure className="mt-8 max-w-[16rem] lg:mt-3 lg:max-w-none lg:justify-self-end">
      <div
        className="relative overflow-hidden border border-border bg-surface motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-cinematic motion-safe:hover:-translate-y-0.5"
        style={{ aspectRatio: figure.aspect }}
      >
        <Image
          src={figure.src}
          alt={figure.alt}
          fill
          sizes="(min-width: 1024px) 216px, 70vw"
          className={figure.fit === 'contain' ? 'object-contain' : 'object-cover'}
        />
      </div>
      <figcaption className="mt-3">
        <span className="block text-sm text-foreground">{figure.caption}</span>
        <span className="mt-1 block text-xs leading-relaxed text-muted-2">{figure.detail}</span>
      </figcaption>
    </figure>
  );
}
