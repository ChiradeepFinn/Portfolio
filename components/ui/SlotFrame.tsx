import { cn } from '@/lib/utils';

interface SlotFrameProps {
  /** What belongs here, e.g. "Photograph", "Cover", "Case study". */
  readonly label: string;
  readonly className?: string;
  /** Aspect ratio as a CSS value, e.g. `4 / 5`. Omit when the parent sizes it. */
  readonly ratio?: string;
  readonly tone?: 'blue' | 'rose' | 'teal' | 'neutral';
  /** Hide the registration marks and label when another control sits on the plate. */
  readonly quiet?: boolean;
}

const toneWash: Record<NonNullable<SlotFrameProps['tone']>, string> = {
  blue: 'from-[#131d33] via-[#0c0e16] to-[#08080c]',
  rose: 'from-[#2a1526] via-[#150e15] to-[#08080c]',
  teal: 'from-[#0d2426] via-[#0b1517] to-[#08080c]',
  neutral: 'from-[#141419] via-[#0c0c10] to-[#08080c]',
};

/**
 * The reserved-slot treatment used everywhere real media is still missing.
 *
 * It borrows registration marks from print: a plate that is positioned and
 * ready but not yet inked. That reads as deliberate rather than broken, and it
 * keeps every layout at its final proportions so dropping in the real asset
 * changes nothing but the pixels.
 */
export function SlotFrame({ label, className, ratio, tone = 'neutral', quiet = false }: SlotFrameProps) {
  return (
    <div
      style={ratio ? { aspectRatio: ratio } : undefined}
      data-theme-scope="dark"
      className={cn(
        'grain relative isolate flex items-center justify-center overflow-hidden rounded-card border border-border bg-gradient-to-br',
        toneWash[tone],
        className,
      )}
    >
      {quiet ? null : (
        <>
          <span aria-hidden="true" className="absolute left-3 top-3 h-3 w-px bg-white/15" />
          <span aria-hidden="true" className="absolute left-3 top-3 h-px w-3 bg-white/15" />
          <span aria-hidden="true" className="absolute right-3 top-3 h-3 w-px bg-white/15" />
          <span aria-hidden="true" className="absolute right-3 top-3 h-px w-3 bg-white/15" />
          <span aria-hidden="true" className="absolute bottom-3 left-3 h-3 w-px bg-white/15" />
          <span aria-hidden="true" className="absolute bottom-3 left-3 h-px w-3 bg-white/15" />
          <span aria-hidden="true" className="absolute bottom-3 right-3 h-3 w-px bg-white/15" />
          <span aria-hidden="true" className="absolute bottom-3 right-3 h-px w-3 bg-white/15" />

          <span className="px-4 text-center">
            <span className="meta block">{label}</span>
            <span className="mt-1 block text-[0.62rem] tracking-[0.18em] text-white/20 uppercase">
              Reserved
            </span>
          </span>
        </>
      )}
    </div>
  );
}
