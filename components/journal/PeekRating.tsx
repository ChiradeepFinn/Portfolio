'use client';

import { useRef, useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { JOURNAL_MARKS } from '@/lib/journal/mark';

const MARKS = JOURNAL_MARKS;

export function PeekRating({
  value,
  onChange,
  disabled,
}: {
  readonly value: number;
  readonly onChange: (value: number) => void;
  readonly disabled?: boolean;
}) {
  const [peek, setPeek] = useState<number | null>(null);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const shown = peek ?? value;
  const shownMark = MARKS.find((mark) => mark.value === shown);

  function move(next: number) {
    const clamped = Math.min(5, Math.max(1, next));
    onChange(clamped);
    buttons.current[clamped - 1]?.focus();
  }

  return (
    <div className="grid gap-1">
      <div className="flex items-baseline justify-between gap-3">
        <span id="journal-rating-label" className="text-[0.62rem] tracking-[0.14em] text-muted-2 uppercase">
          How it felt
        </span>
        <span className="text-right font-display text-sm text-foreground italic" aria-live="polite">
          {shownMark?.label ?? 'Unsaid'}
        </span>
      </div>
      <div
        role="radiogroup"
        aria-labelledby="journal-rating-label"
        aria-required="true"
        className="flex w-[calc(35%+7.3125rem)] items-center justify-between"
        onPointerLeave={() => setPeek(null)}
        onKeyDown={(event) => {
          if (disabled) return;
          if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
            event.preventDefault();
            move(value === 0 ? 1 : value + 1);
          } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
            event.preventDefault();
            move(value === 0 ? 5 : value - 1);
          } else if (event.key === 'Home') {
            event.preventDefault();
            move(1);
          } else if (event.key === 'End') {
            event.preventDefault();
            move(5);
          }
        }}
      >
        {MARKS.map((mark) => {
          const filled = shown >= mark.value;
          const tip = shown === mark.value;
          return (
            <button
              key={mark.value}
              ref={(node) => {
                buttons.current[mark.value - 1] = node;
              }}
              type="button"
              role="radio"
              aria-checked={value === mark.value}
              aria-label={`${mark.label}, ${mark.value} of 5`}
              tabIndex={value === mark.value || (value === 0 && mark.value === 1) ? 0 : -1}
              disabled={disabled}
              className="grid h-9 w-9 place-items-center rounded-full disabled:cursor-default"
              onPointerEnter={() => {
                if (!disabled) setPeek(mark.value);
              }}
              onFocus={() => {
                if (!disabled) setPeek(mark.value);
              }}
              onBlur={(event) => {
                const next = event.relatedTarget;
                if (!(next instanceof Node) || !event.currentTarget.parentElement?.contains(next)) {
                  setPeek(null);
                }
              }}
              onClick={() => onChange(mark.value)}
            >
              <Heart
                aria-hidden="true"
                strokeWidth={1.6}
                fill={filled ? 'currentColor' : 'transparent'}
                className={cn(
                  'h-6 w-6 origin-center motion-safe:transition-[fill,color,transform] motion-safe:duration-300 motion-safe:ease-cinematic',
                  filled ? 'text-accent-rose' : 'text-muted-2 motion-safe:scale-90',
                  tip && 'motion-safe:scale-125 motion-safe:-translate-y-1',
                )}
                style={{ transitionDelay: filled ? `${(mark.value - 1) * 36}ms` : '0ms' }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
