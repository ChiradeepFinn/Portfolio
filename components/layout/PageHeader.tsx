import type { ReactNode } from 'react';
import { Container, type ShellWidth } from './Container';
import { cn } from '@/lib/utils';

type Accent = 'blue' | 'purple' | 'rose' | 'warm';

interface PageHeaderProps {
  readonly eyebrow: string;
  readonly title: ReactNode;
  readonly description?: string;
  /** Kept for call-site compatibility; eyebrows always use muted-2. */
  readonly accent?: Accent;
  readonly width?: ShellWidth;
  /** Decorative atmosphere class from globals.css. */
  readonly atmosphere?: string;
  /**
   * `aside` puts the eyebrow on the right of the title, sharing the first line.
   * `inline` keeps the eyebrow immediately left of the title with a short gap.
   * Narrow screens keep labels above, where a side label would crush the headline.
   */
  readonly eyebrowPlacement?: 'above' | 'aside' | 'inline';
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
  /** Optional trail above the eyebrow (visible breadcrumbs that match JSON-LD). */
  readonly trail?: ReactNode;
  /**
   * Shell vertical padding. `compact` shortens the space under the nav
   * (contact form pages) without changing sitewide heroes.
   */
  readonly density?: 'default' | 'compact';
}

/** Eyebrows share one muted label color across the site (matches home worlds). */
const eyebrowColorClass = 'text-muted-2';

export function PageHeader({
  eyebrow,
  title,
  description,
  width = 'default',
  atmosphere = 'atmos-spotlight',
  eyebrowPlacement = 'above',
  titleTone = 'default',
  stamp,
  live = false,
  children,
  trail,
  density = 'default',
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

  const shellPadding =
    density === 'compact'
      ? 'pt-28 pb-10 sm:pt-32 sm:pb-12'
      : 'pt-36 pb-14 sm:pt-44 sm:pb-16';

  return (
    <header className="relative">
      <div aria-hidden="true" className={cn('atmos', atmosphere)} />
      <Container width={width} className={cn('relative', shellPadding)}>
        {trail ? <div className="mb-8">{trail}</div> : null}
        {eyebrowPlacement === 'aside' ? (
          <div className="lg:flex lg:items-start lg:justify-between lg:gap-x-8 xl:gap-x-16">
            <p
              className={cn(
                'eyebrow whitespace-nowrap lg:order-2 lg:shrink-0 lg:pt-[1.15rem] lg:text-right xl:pt-[1.65rem]',
                eyebrowLiveClass,
                eyebrowColorClass,
              )}
            >
              {eyebrowContent}
            </p>
            <div className="min-w-0 lg:order-1 lg:max-w-3xl">
              <h1 className={cn(titleClass, 'mt-5 lg:mt-0')}>{title}</h1>
              {description && <p className="body-copy mt-6 max-w-xl">{description}</p>}
            </div>
          </div>
        ) : eyebrowPlacement === 'inline' ? (
          <div className="gap-x-5 lg:flex lg:items-start lg:gap-x-8">
            <p
              className={cn(
                'eyebrow whitespace-nowrap lg:shrink-0 lg:pt-[1.15rem] xl:pt-[1.65rem]',
                eyebrowLiveClass,
                eyebrowColorClass,
              )}
            >
              {eyebrowContent}
            </p>
            <div className="min-w-0 lg:max-w-3xl">
              <h1 className={cn(titleClass, 'mt-5 lg:mt-0')}>{title}</h1>
              {description && <p className="body-copy mt-6 max-w-xl">{description}</p>}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4">
              <p className={cn('eyebrow', eyebrowLiveClass, eyebrowColorClass)}>{eyebrowContent}</p>
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
