import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface RevealProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly delay?: number;
}

/**
 * Shared scroll/load entrance. Server Component: content is always in the HTML.
 * Motion is CSS (view-timeline when supported; otherwise a short load rise).
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <div
      className={cn('reveal', className)}
      style={delay ? ({ '--reveal-delay': `${delay}s` } as CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
