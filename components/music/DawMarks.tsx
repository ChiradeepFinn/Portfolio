import { cn } from '@/lib/utils';

/**
 * Monochrome marks for the DAWs used at home. currentColor so they sit
 * with the muted type on the homepage, not as brand-color splash.
 *
 * One visible name per tool. Icons are decorative; the label under each
 * mark is the accessible name (same pattern as project stack chips).
 */
const tools = [
  { name: 'BandLab', mark: BandLabMark },
  { name: 'FL Studio', mark: FlStudioMark },
  { name: 'Cakewalk', mark: CakewalkMark },
] as const;

export function DawMarks({
  className,
  label = 'Where I make music',
}: {
  readonly className?: string;
  readonly label?: string;
}) {
  return (
    <ul
      aria-label={label}
      className={cn('flex items-stretch border-y border-border', className)}
    >
      {tools.map(({ name, mark: Mark }) => (
        <li
          key={name}
          className="group flex flex-1 flex-col items-start gap-2.5 border-l border-border px-3.5 py-3.5 first:border-l-0 first:pl-0 sm:px-5"
        >
          <Mark className="text-foreground/70 transition-colors duration-200 group-hover:text-foreground" />
          <span className="meta text-[0.62rem] tracking-[0.12em] text-muted-2 transition-colors duration-200 group-hover:text-foreground">
            {name}
          </span>
        </li>
      ))}
    </ul>
  );
}

function BandLabMark({ className }: { readonly className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width="24"
      height="24"
      aria-hidden="true"
      focusable="false"
      className={cn('block', className)}
    >
      {/* Rounded tile + rising bars — BandLab’s waveform mark */}
      <rect x="3" y="3" width="26" height="26" rx="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        fill="currentColor"
        d="M10 20.5v-5a1 1 0 0 1 2 0v5a1 1 0 0 1-2 0zm5 0V11a1 1 0 0 1 2 0v9.5a1 1 0 0 1-2 0zm5 0v-7a1 1 0 0 1 2 0v7a1 1 0 0 1-2 0z"
      />
    </svg>
  );
}

function FlStudioMark({ className }: { readonly className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width="24"
      height="24"
      aria-hidden="true"
      focusable="false"
      className={cn('block', className)}
    >
      {/* Fruit + stem leaf — FL Studio’s mark, flattened to ink */}
      <path
        fill="currentColor"
        d="M17.2 5.2c1.4.2 2.5 1.1 3 2.3.1.4-.2.7-.6.6-1.1-.3-2.2 0-3 .8-.2.2-.5.1-.6-.1-.4-1.1-.2-2.4.6-3.3.2-.2.4-.3.6-.3z"
      />
      <path
        fill="currentColor"
        d="M16 9.2c2.6 0 4.9 1.6 5.8 4 1.1 2.9.3 6.1-2.1 8.1-1.4 1.2-3.2 1.8-5 1.7-1.9-.1-3.6-.9-4.8-2.4-1.8-2.2-2-5.4-.5-7.9 1.2-2.1 3.5-3.5 6-3.5.2 0 .4 0 .6 0z"
      />
    </svg>
  );
}

function CakewalkMark({ className }: { readonly className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width="24"
      height="24"
      aria-hidden="true"
      focusable="false"
      className={cn('block', className)}
    >
      {/* A C, in the same ink weight as the other marks. The name underneath is the label. */}
      <path
        d="M21.2 11.4a6.6 6.6 0 1 0 .15 9.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
