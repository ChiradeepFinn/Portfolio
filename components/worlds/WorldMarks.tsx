import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Container, type ShellWidth } from '@/components/layout/Container';
import { GradientWord } from '@/components/ui/GradientWord';
import type { Headline } from '@/lib/data/worlds';

export function WorldIndex({
  index,
  label,
  className,
}: {
  readonly index?: string;
  readonly label: string;
  readonly className?: string;
}) {
  return (
    <p className={cn('eyebrow', className)}>
      {index ? (
        <>
          <span className="text-muted-2">{index}</span>
          <span className="px-2 text-muted-2" aria-hidden="true">
            /
          </span>
        </>
      ) : null}
      {label}
    </p>
  );
}

export function WorldHeadline({
  as = 'h1',
  headline,
  className,
  id,
}: {
  readonly as?: 'h1' | 'h2' | 'h3';
  readonly headline: Headline;
  readonly className?: string;
  readonly id?: string;
}) {
  const Tag = as;

  return (
    <Tag id={id} className={cn('display text-balance text-foreground', className)}>
      {headline.before ? <>{headline.before} </> : null}
      <GradientWord>{headline.emphasis}</GradientWord>
      {headline.after ? <> {headline.after}</> : null}
    </Tag>
  );
}

export function WorldTags({
  tags,
  className,
}: {
  readonly tags: readonly string[];
  readonly className?: string;
}) {
  return (
    <ul className={cn('flex flex-wrap gap-2', className)}>
      {tags.map((tag) => (
        <li key={tag} className="rounded-pill border border-border px-3 py-1 text-[0.75rem] text-muted">
          {tag}
        </li>
      ))}
    </ul>
  );
}

/**
 * Page-top frame. Shared spacing and atmosphere only - each world fills it
 * with its own composition.
 */
export function IntroFrame({
  atmosphere,
  children,
  width = 'default',
  className,
}: {
  readonly atmosphere?: string;
  readonly children: ReactNode;
  readonly width?: ShellWidth;
  readonly className?: string;
}) {
  return (
    <header className="relative">
      {atmosphere ? <div aria-hidden="true" className={cn('atmos', atmosphere)} /> : null}
      <Container width={width} className={cn('relative pt-32 pb-12 sm:pt-40 sm:pb-14', className)}>
        {children}
      </Container>
    </header>
  );
}
