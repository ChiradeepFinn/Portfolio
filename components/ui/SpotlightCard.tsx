'use client';

import { useCallback, useRef, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SpotlightCardProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly spotlightColor?: string;
}

/**
 * A card that reveals a soft light where the cursor is. The pointer position is
 * written to CSS variables rather than React state so hovering never triggers a
 * re-render.
 */
export function SpotlightCard({
  children,
  className,
  spotlightColor = 'rgba(91, 140, 255, 0.16)',
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty('--spotlight-x', `${event.clientX - rect.left}px`);
    node.style.setProperty('--spotlight-y', `${event.clientY - rect.top}px`);
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      style={{ '--spotlight-color': spotlightColor } as CSSProperties}
      className={cn(
        'group relative isolate overflow-hidden rounded-card border border-border',
        'before:pointer-events-none before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-300',
        'before:bg-[radial-gradient(circle_at_var(--spotlight-x,50%)_var(--spotlight-y,50%),var(--spotlight-color),transparent_60%)]',
        'hover:before:opacity-100',
        className,
      )}
    >
      {children}
    </div>
  );
}
