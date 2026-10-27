'use client';

import { useEffect, useMemo, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { capitalizeDisplayName } from '@/lib/journal/validate';
import type { JournalSlipNote } from './JournalEntries';

/** A note long enough to need a second breath reads badly as a highlight. */
const MAX_QUOTE = 200;
const HOLD_MS = 6_000;
const MAX_QUOTES = 8;

/**
 * One published note at a time, above the wall that holds all of them.
 * Every quote here is repeated in full below, so the reel is hidden from
 * screen readers rather than read out twice.
 */
export function JournalReel({ notes }: { readonly notes: readonly JournalSlipNote[] }) {
  const quotes = useMemo(
    () =>
      notes
        .filter((note) => !note.body.includes('\n') && Array.from(note.body).length <= MAX_QUOTE)
        .slice(0, MAX_QUOTES),
    [notes],
  );

  const reduce = useReducedMotion() === true;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || paused || quotes.length < 2) return undefined;
    const id = window.setInterval(() => setActive((index) => (index + 1) % quotes.length), HOLD_MS);
    return () => window.clearInterval(id);
  }, [reduce, paused, quotes.length]);

  if (quotes.length === 0) return null;

  const shown = active % quotes.length;

  return (
    <figure
      aria-hidden="true"
      className="mt-12 mb-12 sm:mt-14 sm:mb-14"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <p className="eyebrow text-warm-2">Already in the margin</p>
      {/* Every quote keeps its cell, so the block is as tall as the longest one and nothing jumps. */}
      <div className="mt-7 grid border-l border-border pl-6">
        {quotes.map((note, index) => (
          <div
            key={note.id}
            className={cn(
              'col-start-1 row-start-1 transition-opacity duration-700',
              index === shown ? 'opacity-100' : 'opacity-0',
            )}
          >
            <blockquote>
              <p className="max-w-2xl font-display text-[clamp(1.2rem,2.4vw,1.55rem)] leading-snug text-foreground italic">
                &ldquo;{note.body}&rdquo;
              </p>
            </blockquote>
            <p className="meta mt-4 uppercase">{capitalizeDisplayName(note.displayName)}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}
