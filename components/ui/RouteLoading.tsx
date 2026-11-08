import { cn } from '@/lib/utils';

type RouteLoadingProps = {
  readonly label: string;
  readonly hint?: string;
  readonly className?: string;
  /** Tighter padding when nested under an existing header shell. */
  readonly compact?: boolean;
};

/**
 * Typographic route placeholder: hairline progress, display label, no spinner.
 * Safe for journal/auth: never renders private content.
 */
export function RouteLoading({ label, hint, className, compact = false }: RouteLoadingProps) {
  return (
    <div
      className={cn(
        'route-loading',
        compact ? 'pt-28 pb-16 sm:pt-32' : 'pt-36 pb-20 sm:pt-44',
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <p className="eyebrow text-muted-2">Loading</p>
      <p className="display mt-5 text-[clamp(1.55rem,3.2vw,2.35rem)] text-foreground">{label}</p>
      {hint ? <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">{hint}</p> : null}
      <div className="route-loading-track mt-10" aria-hidden="true">
        <span className="route-loading-bar" />
      </div>
    </div>
  );
}
