import type { ReactNode } from 'react';
import { Container, type ShellWidth } from './Container';
import { cn } from '@/lib/utils';

type Accent = 'blue' | 'purple' | 'rose' | 'warm';

interface PageHeaderProps {
  readonly eyebrow: string;
  readonly title: ReactNode;
  readonly description?: string;
  readonly accent?: Accent;
  readonly width?: ShellWidth;
  /** Decorative atmosphere class from globals.css. */
  readonly atmosphere?: string;
  /**
   * `aside` puts the eyebrow on the right of the title, sharing the first line.
   * Narrow screens keep it above, where a side label would crush the headline.
   */
  readonly eyebrowPlacement?: 'above' | 'aside';
  /** Paints the whole heading in the warm gradient. */
  readonly titleTone?: 'default' | 'warm';
  /** Small glowing tag set on the right of the eyebrow line, e.g. a revision date. */
  readonly stamp?: { readonly tag: string; readonly text: string };
  /**
   * Live pulse point + soft text glow on the eyebrow (Guest Journal, etc.).
   * Off by default so other pages stay still.
   */
  readonly live?: boolean;
  /** Content rendered below the intro copy, still inside the header shell. */
  readonly children?: ReactNode;
}

const accentClass: Record<Accent, string> = {
  blue: 'text-accent-blue',
  purple: 'text-accent-purple',
  rose: 'text-accent-rose',
  warm: 'text-warm-2',
};

export function PageHeader({
  eyebrow,
  title,
  description,
  accent = 'blue',
  width = 'default',
  atmosphere = 'atmos-spotlight',
  eyebrowPlacement = 'above',
  titleTone = 'default',
  stamp,
  live = false,
  children,
}: PageHeaderProps) {
  const titleClass = cn(
    'display max-w-3xl text-balance text-[clamp(2.4rem,6vw,4.4rem)]',
    titleTone === 'warm' ? 'title-warm' : 'text-foreground',
  );

  const eyebrowLiveClass = live ? 'eyebrow-live inline-flex items-center gap-2' : undefined;
  const eyebrowContent = (
    <>
      {live ? <span className="status-pulse" aria-hidden="true" /> : null}
      {eyebrow}
    </>
  );

  return (
    <header className="relative">
      <div aria-hidden="true" className={cn('atmos', atmosphere)} />
      <Container width={width} className="relative pt-36 pb-14 sm:pt-44 sm:pb-16">
        {eyebrowPlacement === 'aside' ? (
          <div className="lg:flex lg:items-start lg:justify-between lg:gap-x-8 xl:gap-x-16">
            <p
              className={cn(
                'eyebrow whitespace-nowrap lg:order-2 lg:shrink-0 lg:pt-[1.15rem] lg:text-right xl:pt-[1.65rem]',
                eyebrowLiveClass,
                accentClass[accent],
              )}
            >
              {eyebrowContent}
            </p>
            <div className="min-w-0 lg:order-1 lg:max-w-3xl">
              <h1 className={cn(titleClass, 'mt-5 lg:mt-0')}>{title}</h1>
              {description && <p className="body-copy mt-6 max-w-xl">{description}</p>}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4">
              <p className={cn('eyebrow', eyebrowLiveClass, accentClass[accent])}>{eyebrowContent}</p>
              {stamp && (
                <p className="inline-flex shrink-0 items-center gap-2 rounded-pill border border-border bg-wash py-1 pr-3 pl-1 text-[0.7rem] text-muted backdrop-blur-md sm:text-xs">
                  <span className="badge-glow rounded-pill bg-[#236ff3] px-2 py-[0.15rem] text-[0.6rem] font-semibold tracking-[0.08em] text-white uppercase sm:text-[0.65rem]">
                    {stamp.tag}
                  </span>
                  <span>{stamp.text}</span>
                </p>
              )}
            </div>
            <h1 className={cn(titleClass, 'mt-5')}>{title}</h1>
            {description && <p className="body-copy mt-6 max-w-xl">{description}</p>}
          </>
        )}
        {children ? <div className="mt-8">{children}</div> : null}
      </Container>
    </header>
  );
}
