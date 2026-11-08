'use client';

import { useEffect, useId, useState } from 'react';
import { preconnect, prefetchDNS, preload } from 'react-dom';
import { calBookingOptions, calEmbedSrc, type CalDuration } from '@/lib/cal';
import { cn } from '@/lib/utils';

const options = calBookingOptions();

/** Warm Cal origins + both event documents as early as this client island runs. */
function warmCalDocuments() {
  preconnect('https://cal.com');
  preconnect('https://app.cal.com');
  prefetchDNS('https://cal.com');
  prefetchDNS('https://app.cal.com');
  for (const option of options) {
    preload(calEmbedSrc(option.calLink), { as: 'document' });
  }
}

function resourceAlreadyLoaded(src: string): boolean {
  const entries = performance.getEntriesByName(src);
  return entries.some((entry) => {
    const end = (entry as PerformanceResourceTiming).responseEnd;
    return typeof end === 'number' && end > 0;
  });
}

export function BookingEmbed() {
  const [duration, setDuration] = useState<CalDuration>('30');
  const [ready, setReady] = useState<Partial<Record<CalDuration, boolean>>>({});
  const baseId = useId();

  warmCalDocuments();

  const markReady = (value: CalDuration) => {
    setReady((prev) => (prev[value] ? prev : { ...prev, [value]: true }));
  };

  // Catch iframe loads that finished before hydration attached onLoad.
  useEffect(() => {
    for (const option of options) {
      if (resourceAlreadyLoaded(calEmbedSrc(option.calLink))) {
        markReady(option.duration);
      }
    }
  }, []);

  return (
    <section aria-labelledby={`${baseId}-heading`}>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-muted-2">Book a call</p>
          <h2
            id={`${baseId}-heading`}
            className="mt-4 text-lg font-medium tracking-tight text-foreground"
          >
            Pick a time
          </h2>
          <p className="body-copy mt-3 max-w-prose text-[0.95rem]">
            Prefer a live conversation over email. Choose a length, then book in place.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Call length"
          className="flex w-fit gap-1 rounded-[var(--radius-pill)] border border-border p-1"
        >
          {options.map((option) => {
            const active = option.duration === duration;
            const tabId = `${baseId}-tab-${option.duration}`;
            return (
              <button
                key={option.duration}
                type="button"
                role="tab"
                id={tabId}
                aria-selected={active}
                aria-controls={`${baseId}-panel-${option.duration}`}
                tabIndex={active ? 0 : -1}
                onClick={() => setDuration(option.duration)}
                onKeyDown={(event) => {
                  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
                  event.preventDefault();
                  const index = options.findIndex((item) => item.duration === duration);
                  const next =
                    event.key === 'ArrowRight'
                      ? options[(index + 1) % options.length]
                      : options[(index - 1 + options.length) % options.length];
                  setDuration(next.duration);
                }}
                className={cn(
                  'rounded-[var(--radius-pill)] px-3.5 py-1.5 text-sm transition-colors duration-200',
                  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/40',
                  active
                    ? 'bg-foreground text-background'
                    : 'text-muted-2 hover:text-muted',
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reference-style booker plate: bordered, rounded, wide enough for details | calendar | slots */}
      <div
        className={cn(
          'relative mt-8 overflow-hidden rounded-[var(--radius-card)] border border-border',
          'bg-[color-mix(in_oklab,var(--color-background)_88%,var(--color-foreground)_12%)]',
        )}
      >
        {!ready[duration] && (
          <p className="absolute inset-x-0 top-10 z-20 text-center text-sm text-muted-2" aria-live="polite">
            Loading calendar…
          </p>
        )}
        <div className="relative min-h-[36rem] sm:min-h-[40rem] lg:min-h-[42rem]">
          {options.map((option) => {
            const active = option.duration === duration;
            return (
              <div
                key={option.calLink}
                role="tabpanel"
                id={`${baseId}-panel-${option.duration}`}
                aria-labelledby={`${baseId}-tab-${option.duration}`}
                aria-hidden={!active}
                className={cn(
                  active ? 'relative z-10' : 'pointer-events-none absolute inset-0 z-0',
                )}
              >
                <iframe
                  title={`Book a ${option.label} call`}
                  src={calEmbedSrc(option.calLink)}
                  tabIndex={active ? undefined : -1}
                  onLoad={() => markReady(option.duration)}
                  className={cn(
                    'h-[36rem] w-full border-0 bg-transparent transition-opacity duration-300 sm:h-[40rem] lg:h-[42rem]',
                    active && ready[option.duration] ? 'opacity-100' : 'opacity-0',
                  )}
                  allow="payment *"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
