import { cn } from '@/lib/utils';
import type { ResearchFigure } from '@/lib/data/research';

/**
 * Signatures for the two investigations.
 *
 * Both are diagrams of a structure: an annotation space, or a pair of
 * conditions against shared measures. Neither contains plotted results.
 * A mark inside the valence plane, or a bar with a height, would read as data.
 */

const captions: Record<ResearchFigure, string> = {
  valence:
    'The valence-arousal plane, with an audio trace drawn underneath. Not a plot of songs or of model output.',
  ideation:
    'Unaided and assisted ideation, held against the same three measures. Not a score chart.',
};

export function Schematic({
  kind,
  className,
}: {
  readonly kind: ResearchFigure;
  readonly className?: string;
}) {
  return (
    <figure className={cn('border border-border bg-surface px-4 py-4 sm:px-5', className)}>
      {kind === 'valence' ? <ValenceFigure /> : <IdeationFigure />}
      <figcaption className="mt-4 text-[0.75rem] leading-relaxed text-muted-2">{captions[kind]}</figcaption>
    </figure>
  );
}

function ValenceFigure() {
  return (
    <svg viewBox="0 0 320 240" className="h-auto w-full font-sans text-foreground" aria-hidden="true">
      <line x1="28" y1="84" x2="292" y2="84" stroke="currentColor" strokeOpacity="0.28" />
      <line x1="160" y1="22" x2="160" y2="146" stroke="currentColor" strokeOpacity="0.28" />
      <text x="160" y="16" textAnchor="middle" fill="currentColor" fillOpacity="0.55" fontSize="11">
        Arousal
      </text>
      <text x="160" y="166" textAnchor="middle" fill="currentColor" fillOpacity="0.55" fontSize="11">
        Valence
      </text>
      <text x="36" y="100" fill="currentColor" fillOpacity="0.4" fontSize="10">
        −
      </text>
      <text x="276" y="100" fill="currentColor" fillOpacity="0.4" fontSize="10">
        +
      </text>
      <path
        d="M16 228 C 30 228 34 214 48 214 C 62 214 66 228 82 228 C 98 228 104 202 122 202 C 140 202 146 228 164 228 C 182 228 190 192 208 192 C 226 192 234 228 252 228 C 268 228 274 216 290 216 C 300 216 304 228 312 228"
        fill="none"
        stroke="var(--color-accent-blue)"
        strokeWidth="1.25"
      />
    </svg>
  );
}

function IdeationFigure() {
  const rows = [
    { label: 'Originality', y: 92 },
    { label: 'Ownership', y: 136 },
    { label: 'Agency', y: 180 },
  ] as const;

  return (
    <svg viewBox="0 0 320 210" className="h-auto w-full font-sans text-foreground" aria-hidden="true">
      <text x="8" y="22" fill="currentColor" fontSize="12">
        Unaided
      </text>
      <text x="312" y="22" textAnchor="end" fill="currentColor" fontSize="12">
        Assisted
      </text>
      <line x1="8" y1="34" x2="78" y2="34" stroke="currentColor" strokeOpacity="0.35" />
      <line x1="242" y1="34" x2="312" y2="34" stroke="var(--color-warm-2)" strokeOpacity="0.85" />
      {rows.map((row) => (
        <g key={row.label}>
          <path
            d={`M8 34 C 8 ${row.y - 28}, 28 ${row.y}, 72 ${row.y}`}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.35"
          />
          <path
            d={`M312 34 C 312 ${row.y - 28}, 292 ${row.y}, 248 ${row.y}`}
            fill="none"
            stroke="var(--color-warm-2)"
            strokeOpacity="0.8"
          />
          <line x1="78" y1={row.y} x2="242" y2={row.y} stroke="currentColor" strokeOpacity="0.18" />
          <text x="160" y={row.y - 8} textAnchor="middle" fill="currentColor" fillOpacity="0.72" fontSize="12">
            {row.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
