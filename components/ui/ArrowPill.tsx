'use client';

import type { MouseEvent, ReactNode } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * The site's pill with a disc.
 *
 * The whole control leans a few pixels toward the pointer. The arrow then
 * leaves up-right, and the next one arrives from the opposite corner once the
 * first has cleared the disc. Keyboard focus plays the same arrow pass.
 */
export function ArrowPill({
  href,
  onClick,
  expanded,
  controls,
  children,
  className,
  ariaLabel,
}: {
  readonly href?: string;
  readonly onClick?: () => void;
  readonly expanded?: boolean;
  readonly controls?: string;
  readonly children: ReactNode;
  readonly className?: string;
  /** Replaces the visible text as the accessible name when the destination needs the title. */
  readonly ariaLabel?: string;
}) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 24, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 260, damping: 24, mass: 0.35 });

  const lean = (event: MouseEvent<HTMLElement>) => {
    if (reduce) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.08);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.12);
  };

  const rest = () => {
    x.set(0);
    y.set(0);
  };

  const controlClass = cn(
    'group flex w-fit max-w-full items-center gap-1.5 rounded-pill border border-border bg-wash py-0.5 pr-0.5 pl-3.5 text-[0.72rem] font-medium text-foreground backdrop-blur-md transition-[border-color,background-color,scale] duration-300 ease-cinematic hover:border-border-strong hover:bg-foreground/[0.04] focus-visible:border-border-strong focus-visible:bg-foreground/[0.04] focus-visible:outline-none active:scale-[0.98] sm:gap-2 sm:text-[0.9rem]',
    className,
  );
  const inner = (
    <>
      <span className="min-w-0 transition-transform duration-500 ease-cinematic motion-safe:group-hover:translate-x-0.5 motion-safe:group-focus-visible:translate-x-0.5">
        {children}
      </span>
      <span className="relative grid h-6 w-6 shrink-0 place-items-center overflow-hidden rounded-full bg-foreground text-background transition-colors duration-300 ease-cinematic group-hover:bg-accent-blue group-focus-visible:bg-accent-blue motion-reduce:transition-none sm:h-7 sm:w-7">
        <ArrowUpRight
          size={13}
          strokeWidth={2}
          aria-hidden="true"
          className="col-start-1 row-start-1 motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-cinematic motion-safe:group-hover:translate-x-[180%] motion-safe:group-hover:-translate-y-[180%] motion-safe:group-focus-visible:translate-x-[180%] motion-safe:group-focus-visible:-translate-y-[180%]"
        />
        <ArrowUpRight
          size={13}
          strokeWidth={2}
          aria-hidden="true"
          className="col-start-1 row-start-1 motion-reduce:hidden motion-safe:-translate-x-[180%] motion-safe:translate-y-[180%] motion-safe:transition-transform motion-safe:delay-0 motion-safe:duration-500 motion-safe:ease-cinematic motion-safe:group-hover:translate-x-0 motion-safe:group-hover:translate-y-0 motion-safe:group-hover:delay-100 motion-safe:group-focus-visible:translate-x-0 motion-safe:group-focus-visible:translate-y-0 motion-safe:group-focus-visible:delay-100"
        />
      </span>
    </>
  );

  return (
    <motion.span style={{ x: springX, y: springY }} className="inline-flex max-w-full">
      {onClick ? (
        <button
          type="button"
          aria-label={ariaLabel}
          aria-expanded={expanded}
          aria-controls={controls}
          onClick={onClick}
          onMouseMove={lean}
          onMouseLeave={rest}
          className={controlClass}
        >
          {inner}
        </button>
      ) : (
        <Link
          href={href ?? '/'}
          aria-label={ariaLabel}
          onMouseMove={lean}
          onMouseLeave={rest}
          className={controlClass}
        >
          {inner}
        </Link>
      )}
    </motion.span>
  );
}
