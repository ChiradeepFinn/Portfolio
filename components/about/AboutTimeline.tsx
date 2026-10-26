'use client';

import { useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useReducedMotion } from 'framer-motion';
import type { TimelineChapter } from '@/lib/data/timeline';

const portrait = {
  src: '/images/about_pics/transit.jpg',
  /** The face sits high in the frame, so the circle crops there. */
  position: 'center 18%',
} as const;

/**
 * The practice line. One portrait rides the rail and settles on the event
 * nearest the reading line. It dissolves on the unwritten chapter.
 */
const fade = 360;
/** Seconds to glide most of the way to the next written chapter. */
const glide = 0.55;
/** Faster follow once the portrait is dissolving into the unwritten chapter. */
const dissolvePace = 0.2;

export function AboutTimeline({ chapters }: { readonly chapters: readonly TimelineChapter[] }) {
  const list = useRef<HTMLOListElement>(null);
  const marks = useRef<Array<HTMLSpanElement | null>>([]);
  const face = useRef<HTMLDivElement>(null);
  const trace = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() === true;
  const goal = useRef<number | null>(null);
  const shown = useRef<number | null>(null);
  const goalTrace = useRef<number | null>(null);
  const shownTrace = useRef<number | null>(null);
  const goalPresence = useRef(1);
  const shownPresence = useRef(1);
  const pace = useRef(glide);
  const futureIndex = chapters.findIndex((chapter) => chapter.phase === 'future');

  const paint = useCallback((value: number, traceValue: number, presence: number) => {
    const traveled = Math.max(0, traceValue - 8);
    const scale = 0.82 + 0.18 * presence;
    /** The rose tip softens, and more of it disappears as the portrait does. */
    const tail = 28 + (1 - presence) * 40;
    if (face.current) {
      face.current.style.top = `${value}px`;
      face.current.style.opacity = String(presence);
      face.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }
    if (trace.current) {
      trace.current.style.height = `${traveled}px`;
      trace.current.style.backgroundSize = traveled > fade ? `100% ${fade}px` : '100% 100%';
      const mask = `linear-gradient(to bottom, #000 0, #000 calc(100% - ${tail}px), transparent 100%)`;
      trace.current.style.maskImage = mask;
      trace.current.style.setProperty('-webkit-mask-image', mask);
    }
  }, []);

  const readGoal = useCallback(() => {
    const root = list.current;
    if (!root) return;
    const rootTop = root.getBoundingClientRect().top;
    const reading = window.innerHeight * 0.38 - rootTop;
    const tops = marks.current.map((mark) => (mark ? mark.getBoundingClientRect().top - rootTop : null));
    let nearest = 0;
    let distance = Number.POSITIVE_INFINITY;

    tops.forEach((top, index) => {
      if (top === null) return;
      const gap = Math.abs(top - reading);
      if (gap < distance) {
        distance = gap;
        nearest = index;
      }
    });

    const markTop = tops[nearest];
    if (markTop === null || markTop === undefined) return;

    const doorTop = futureIndex > 0 ? tops[futureIndex - 1] : null;
    const futureTop = futureIndex >= 0 ? tops[futureIndex] : null;
    const span = doorTop !== null && futureTop !== null ? futureTop - doorTop : 0;
    const crossing = doorTop !== null && futureTop !== null && span > 1 && reading >= doorTop;

    if (crossing && doorTop !== null && futureTop !== null) {
      const t = Math.min(1, (reading - doorTop) / span);
      const smooth = t * t * (3 - 2 * t);
      const along = doorTop + span * (reduce ? (t > 0.5 ? 1 : 0) : t);
      goal.current = along;
      goalPresence.current = reduce ? (t > 0.5 ? 0 : 1) : 1 - smooth;
      goalTrace.current = doorTop + (along - doorTop) * goalPresence.current;
      pace.current = dissolvePace;
      return;
    }

    goal.current = markTop;
    goalPresence.current = 1;
    goalTrace.current = markTop;
    pace.current = glide;
  }, [futureIndex, reduce]);

  useEffect(() => {
    let frame = 0;
    let last = 0;
    let running = false;

    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const step = (now: number) => {
      const target = goal.current;
      const traceTarget = goalTrace.current;
      if (target === null || traceTarget === null) {
        stop();
        return;
      }
      const current = shown.current ?? target;
      const currentTrace = shownTrace.current ?? traceTarget;
      const dt = last === 0 ? 0 : Math.min(0.05, (now - last) / 1000);
      last = now;
      const ease = reduce || shown.current === null ? 1 : 1 - Math.exp(-dt / pace.current);
      const next = current + (target - current) * ease;
      const nextTrace = currentTrace + (traceTarget - currentTrace) * ease;
      const presence = shownPresence.current + (goalPresence.current - shownPresence.current) * ease;
      const settled =
        Math.abs(target - next) < 0.35 &&
        Math.abs(traceTarget - nextTrace) < 0.35 &&
        Math.abs(goalPresence.current - presence) < 0.01;
      shown.current = settled ? target : next;
      shownTrace.current = settled ? traceTarget : nextTrace;
      shownPresence.current = settled ? goalPresence.current : presence;
      paint(shown.current, shownTrace.current, shownPresence.current);
      if (settled) {
        stop();
        return;
      }
      frame = requestAnimationFrame(step);
    };

    const follow = () => {
      readGoal();
      if (goal.current === null || goalTrace.current === null) return;
      if (reduce || shown.current === null) {
        shown.current = goal.current;
        shownTrace.current = goalTrace.current;
        shownPresence.current = goalPresence.current;
        paint(goal.current, goalTrace.current, goalPresence.current);
        return;
      }
      const settled =
        Math.abs(goal.current - shown.current) < 0.35 &&
        Math.abs(goalTrace.current - (shownTrace.current ?? goalTrace.current)) < 0.35 &&
        Math.abs(goalPresence.current - shownPresence.current) < 0.01;
      if (settled) return;
      if (running) return;
      running = true;
      last = 0;
      frame = requestAnimationFrame(step);
    };

    follow();
    window.addEventListener('scroll', follow, { passive: true });
    window.addEventListener('resize', follow);
    return () => {
      stop();
      window.removeEventListener('scroll', follow);
      window.removeEventListener('resize', follow);
    };
  }, [paint, readGoal, reduce]);

  return (
    <div className="relative mt-12 sm:mt-16">
      <div
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-[12.5rem] hidden w-px -translate-x-1/2 bg-border sm:block"
      />
      {/* Color only covers the distance already walked. The rest of the rail stays the plain rule. */}
      <div
        ref={trace}
        aria-hidden="true"
        className="absolute top-2 left-[12.5rem] hidden w-0.5 -translate-x-1/2 rounded-full sm:block"
        style={{
          height: 0,
          backgroundColor: 'var(--color-accent-blue)',
          backgroundImage:
            'linear-gradient(to bottom, var(--color-accent-blue), var(--color-accent-purple) 55%, var(--color-accent-rose))',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'bottom',
          boxShadow: '0 0 10px color-mix(in srgb, var(--color-accent-purple) 55%, transparent)',
        }}
      />
      <div
        ref={face}
        aria-hidden="true"
        className="absolute left-[12.5rem] z-10 hidden h-9 w-9 overflow-hidden rounded-full border border-border-strong bg-black opacity-0 sm:block"
        style={{ top: 0, transform: 'translate(-50%, -50%)' }}
      >
        <Image
          src={portrait.src}
          alt=""
          fill
          sizes="36px"
          className="object-cover"
          style={{ objectPosition: portrait.position }}
        />
      </div>
      <ol ref={list}>
        {chapters.map((chapter, index) => (
          <li
            key={chapter.slug}
            className="grid gap-3 border-t border-border py-8 first:border-t-0 first:pt-0 sm:grid-cols-[12.5rem_minmax(0,1fr)] sm:gap-0 sm:border-0 sm:py-7"
          >
            <div className="relative sm:pr-12 sm:text-right">
              <p className="meta sm:pt-1">{chapter.label}</p>
              <span
                aria-hidden="true"
                ref={(node) => {
                  marks.current[index] = node;
                }}
                className="absolute top-2.5 right-0 hidden h-px w-px sm:block"
              />
            </div>
            <div className="sm:pl-10">
              <h3 className="text-[1.02rem] text-foreground">{chapter.title}</h3>
              <p className="mt-1 text-sm text-muted">{chapter.subtitle}</p>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-2">{chapter.paragraphs[0]}</p>
              {chapter.links.length > 0 ? (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {chapter.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="rounded-pill border border-border px-2.5 py-1 text-xs text-muted transition-colors duration-200 hover:border-border-strong hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
