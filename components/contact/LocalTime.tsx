'use client';

import { memo, useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { DottedMap, type Marker, type MarkerConnection } from '@/components/ui/dotted-map';

/** Karur, where the replies are written from. */
const HOME = { zone: 'Asia/Kolkata', lat: 10.9601, lng: 78.0766 } as const;

const TICK_MS = 30_000;

/**
 * `zone: null` on Yours means the visitor's machine timezone.
 * City rows carry real IANA zones and coordinates for the map connector.
 */
const comparisons = [
  { id: 'yours', label: 'Yours', zone: null },
  { id: 'san-francisco', label: 'San Francisco', zone: 'America/Los_Angeles', lat: 37.7749, lng: -122.4194 },
  { id: 'new-york', label: 'New York', zone: 'America/New_York', lat: 40.7128, lng: -74.006 },
  { id: 'london', label: 'London', zone: 'Europe/London', lat: 51.5074, lng: -0.1278 },
  { id: 'berlin', label: 'Berlin', zone: 'Europe/Berlin', lat: 52.52, lng: 13.405 },
  { id: 'dubai', label: 'Dubai', zone: 'Asia/Dubai', lat: 25.2048, lng: 55.2708 },
  { id: 'singapore', label: 'Singapore', zone: 'Asia/Singapore', lat: 1.3521, lng: 103.8198 },
  { id: 'tokyo', label: 'Tokyo', zone: 'Asia/Tokyo', lat: 35.6762, lng: 139.6503 },
  { id: 'sydney', label: 'Sydney', zone: 'Australia/Sydney', lat: -33.8688, lng: 151.2093 },
] as const;

type Comparison = (typeof comparisons)[number];
type ComparisonId = Comparison['id'];
type CityOption = Extract<Comparison, { zone: string }>;

function isCityOption(option: Comparison): option is CityOption {
  return option.zone !== null;
}

function clockIn(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-US', { timeZone, hour: 'numeric', minute: '2-digit' }).format(date);
}

/** Minutes a zone sits from UTC at this instant, so the gap survives daylight saving. */
function offsetMinutes(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(date);

  const read = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? '0');
  const local = Date.UTC(read('year'), read('month') - 1, read('day'), read('hour') % 24, read('minute'), read('second'));
  return Math.round((local - date.getTime()) / 60_000);
}

function gapLabel(date: Date, timeZone: string): string {
  const gap = offsetMinutes(date, timeZone) - offsetMinutes(date, HOME.zone);
  if (gap === 0) return 'Same timezone';
  const hours = Math.floor(Math.abs(gap) / 60);
  const minutes = Math.abs(gap) % 60;
  const span = minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
  return `${span} ${gap < 0 ? 'behind' : 'ahead'}`;
}

function formatCoord(lat: number, lng: number): string {
  const ns = lat >= 0 ? 'N' : 'S';
  const ew = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(2)}°${ns} · ${Math.abs(lng).toFixed(2)}°${ew}`;
}

const HOME_MARKER: Marker = { lat: HOME.lat, lng: HOME.lng, size: 1.25, pulse: true };
const LINK_HOME_TO_CITY: readonly MarkerConnection[] = [{ from: 0, to: 1 }];

/** Sampling the land is costly and indifferent to the clock, so it sits out the tick. */
const WorldDots = memo(function WorldDots({
  markers,
  connections,
}: {
  readonly markers: readonly Marker[];
  readonly connections: readonly MarkerConnection[];
}) {
  return (
    <DottedMap
      width={150}
      height={75}
      mapSamples={3200}
      // r≈0.2 reads as sub-pixel once the 150-wide viewBox stretches to the card.
      dotRadius={0.38}
      markers={markers}
      connections={connections}
      // Muted ink over wash dots — readable without neon route glow.
      connectionColor="var(--color-muted)"
      markerColor="var(--color-accent-blue)"
      pulse
      className="h-full w-full text-muted"
      aria-hidden="true"
    />
  );
});

/**
 * Local time where the email is read, and the gap to wherever the reader is.
 * Nothing renders until the browser has a clock, so the server markup does not
 * claim a time it cannot know.
 */
export function LocalTime({ place }: { readonly place: string }) {
  const [clock, setClock] = useState<{ readonly now: Date; readonly zone: string } | null>(null);
  const [pick, setPick] = useState<ComparisonId>('yours');

  useEffect(() => {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const read = () => setClock({ now: new Date(), zone });
    read();
    const id = window.setInterval(read, TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  const chosen = comparisons.find((option) => option.id === pick) ?? comparisons[0];
  const targetZone = chosen.zone ?? clock?.zone ?? null;
  const remote = isCityOption(chosen) ? chosen : null;

  const { markers, connections } = useMemo(() => {
    if (!remote) {
      return { markers: [HOME_MARKER] as const, connections: [] as const };
    }
    return {
      markers: [
        { ...HOME_MARKER, pulse: false },
        { lat: remote.lat, lng: remote.lng, size: 1.05, pulse: false },
      ] as const,
      connections: LINK_HOME_TO_CITY,
    };
  }, [remote]);

  return (
    <div className="mt-8 overflow-hidden rounded-card border border-border bg-surface">
      <div className="px-5 py-5">
        <p className="meta uppercase">{place}</p>
        <p className="display mt-2 text-[clamp(1.9rem,4vw,2.4rem)] text-foreground tabular-nums">
          {clock ? clockIn(clock.now, HOME.zone) : '-'}
        </p>

        <p className="meta mt-6">Compare with</p>
        <div role="group" aria-label="Compare with timezone" className="mt-3 flex flex-wrap gap-2">
          {comparisons.map((option) => {
            const active = option.id === pick;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={active}
                onClick={() => setPick(option.id)}
                className={cn(
                  'rounded-pill border px-3 py-1 text-xs transition-colors duration-200',
                  active
                    ? 'border-border-strong text-foreground'
                    : 'border-border text-muted hover:border-border-strong hover:text-foreground',
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <p className="meta mt-6 border-t border-border pt-4 uppercase">
          {clock && targetZone ? `${gapLabel(clock.now, targetZone)} · ${clockIn(clock.now, targetZone)}` : 'Reading the clock'}
        </p>
      </div>

      <div className="relative aspect-[2/1] border-t border-border bg-wash/40">
        <div className="absolute inset-0 px-3 py-2 sm:px-4 sm:py-3">
          <WorldDots markers={markers} connections={connections} />
        </div>
        <p className="meta pointer-events-none absolute right-3 bottom-2.5 left-3 flex justify-between gap-3 text-[0.65rem] text-muted-2 sm:right-4 sm:bottom-3 sm:left-4">
          <span>{remote ? `Karur → ${remote.label}` : 'Where replies leave from'}</span>
          <span className="tabular-nums">
            {remote ? formatCoord(remote.lat, remote.lng) : formatCoord(HOME.lat, HOME.lng)}
          </span>
        </p>
      </div>
    </div>
  );
}
