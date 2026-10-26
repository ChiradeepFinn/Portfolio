import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * The one italic accent. Lilac, blush, and honey - soft on black,
 * jewel-toned on paper. Stops live in globals.css; flow is CSS-only.
 */
export function GradientWord({
  children,
  className = '',
}: {
  readonly children: ReactNode;
  readonly className?: string;
}) {
  return <span className={cn('gradient-word italic', className)}>{children}</span>;
}
