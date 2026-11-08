/**
 * Cal.com booking links for the contact page embed.
 *
 * Defaults point at the public event types. Override with env when the
 * username or event slugs change without a code edit.
 */

const DEFAULT_USERNAME = 'chiradeep-s-vavdnc';
const DEFAULT_EVENT_15 = '15min';
const DEFAULT_EVENT_30 = '30min';

function readPublic(name: string): string | undefined {
  const value = process.env[name];
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/** Username (or full path prefix) without leading/trailing slashes. */
export function calUsername(): string {
  const fromLink = readPublic('NEXT_PUBLIC_CAL_LINK');
  const fromUser = readPublic('NEXT_PUBLIC_CAL_USERNAME');
  const raw = fromLink ?? fromUser ?? DEFAULT_USERNAME;
  return raw.replace(/^https?:\/\/(?:www\.)?cal\.com\//i, '').replace(/^\/+|\/+$/g, '');
}

export function calEventSlug15(): string {
  return (readPublic('NEXT_PUBLIC_CAL_EVENT_15') ?? DEFAULT_EVENT_15).replace(/^\/+|\/+$/g, '');
}

export function calEventSlug30(): string {
  return (readPublic('NEXT_PUBLIC_CAL_EVENT_30') ?? DEFAULT_EVENT_30).replace(/^\/+|\/+$/g, '');
}

export type CalDuration = '15' | '30';

export interface CalBookingOption {
  readonly duration: CalDuration;
  readonly label: string;
  /** Path for the Cal iframe, e.g. `user/15min`. */
  readonly calLink: string;
}

export function calBookingOptions(): readonly CalBookingOption[] {
  const user = calUsername();
  return [
    {
      duration: '15',
      label: '15 minutes',
      calLink: `${user}/${calEventSlug15()}`,
    },
    {
      duration: '30',
      label: '30 minutes',
      calLink: `${user}/${calEventSlug30()}`,
    },
  ] as const;
}

/**
 * Dark-theme iframe document URL for a Cal event path.
 * Plain event URL + embed query (not `/embed` path — that stays blank without Cal’s parent script).
 * `layout=month_view` requests the three-pane booker when width allows.
 */
export function calEmbedSrc(calLink: string): string {
  const path = calLink.replace(/^\/+|\/+$/g, '');
  const url = new URL(`https://cal.com/${path}`);
  url.searchParams.set('embed', 'true');
  url.searchParams.set('theme', 'dark');
  url.searchParams.set('layout', 'month_view');
  return url.toString();
}
