import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Container, type ShellWidth } from './Container';
import { FrameBreak } from './FrameBreak';

interface SectionProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly containerClassName?: string;
  readonly width?: ShellWidth;
  readonly id?: string;
  readonly labelledBy?: string;
  /** Skips the container so a child can run edge to edge. */
  readonly bleed?: boolean;
  readonly border?: 'top' | 'none';
  /** Decorative atmosphere class from globals.css, e.g. `atmos-paper`. */
  readonly atmosphere?: string;
  /** Full-bleed layer painted behind the container. The section stays the positioning parent. */
  readonly backdrop?: ReactNode;
  /** Shorter vertical rhythm for previews that should not dominate the page. */
  readonly compact?: boolean;
}

export function Section({
  children,
  className,
  containerClassName,
  width = 'default',
  id,
  labelledBy,
  bleed = false,
  border = 'none',
  atmosphere,
  backdrop,
  compact = false,
}: SectionProps) {
  const flush = className?.split(/\s+/).includes('pt-0') ?? false;

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        'relative',
        compact ? 'section-compact' : 'section-y',
        className,
      )}
    >
      {atmosphere && <div aria-hidden="true" className={cn('atmos', atmosphere)} />}
      {border === 'top' && <FrameBreak edge={flush ? 'flow' : 'rule'} />}
      {backdrop}
      {bleed ? (
        children
      ) : (
        <Container width={width} className={cn('relative', containerClassName)}>
          {children}
        </Container>
      )}
    </section>
  );
}
