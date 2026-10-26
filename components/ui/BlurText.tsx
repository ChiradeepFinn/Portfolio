import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface BlurTextProps {
  readonly text: string;
  readonly className?: string;
  /** Per-unit stagger in milliseconds. */
  readonly delay?: number;
  /** Wait before the first unit, so a following line can continue the same gesture. */
  readonly startDelay?: number;
  readonly animateBy?: 'words' | 'chars';
}

/**
 * Reveals a line of display type as one gesture. Markup is server-rendered;
 * CSS staggers the units. Text stays in the HTML even if CSS is unavailable.
 */
export function BlurText({
  text,
  className,
  delay = 55,
  startDelay = 0,
  animateBy = 'words',
}: BlurTextProps) {
  const units = animateBy === 'words' ? text.split(' ') : [...text];

  return (
    <span
      className={cn('blur-text', className)}
      style={
        {
          '--blur-stagger': `${delay}ms`,
          '--blur-start': `${startDelay}ms`,
        } as CSSProperties
      }
    >
      {units.flatMap((unit, index) => {
        const word = (
          <span
            key={`${unit}-${index}`}
            className="blur-text__unit"
            style={{ '--blur-i': index } as CSSProperties}
          >
            {unit}
          </span>
        );
        if (animateBy === 'words' && index < units.length - 1) return [word, ' '];
        return [word];
      })}
    </span>
  );
}
