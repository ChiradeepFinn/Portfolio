import { cn } from '@/lib/utils';

/**
 * One arc, treated as a light source. Several blur radii are tinted and
 * stacked so the edge blooms the way a real limb does: a hot core, a tight
 * halo, and a wide scatter that falls off into the page.
 */
export function HorizonGlow({ className }: { readonly className?: string }) {
  const arc = 'M-200 214 Q720 78 1640 214';

  return (
    <div aria-hidden="true" className={cn('horizon w-full', className)}>
      <svg
        className="horizon-svg"
        viewBox="0 0 1440 560"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="horizon-air" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--horizon-body-0)" stopOpacity="0.9" />
            <stop offset="18%" stopColor="var(--horizon-body-1)" stopOpacity="0.55" />
            <stop offset="40%" stopColor="var(--horizon-body-2)" stopOpacity="0.22" />
            <stop offset="68%" stopColor="var(--horizon-body-3)" stopOpacity="0" />
          </linearGradient>

          <filter id="horizon-air-blur" x="-8%" y="-40%" width="116%" height="180%" colorInterpolationFilters="sRGB">
            <feGaussianBlur stdDeviation="18" />
          </filter>

          {/*
            SourceAlpha of the arc is blurred at three scales, then tinted.
            The wide pass is shifted downward so more light falls into the
            atmosphere than up into the sky, which is how a limb actually reads.
          */}
          <filter id="horizon-bloom" x="-20%" y="-160%" width="140%" height="520%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceAlpha" stdDeviation="18 52" result="wideAlpha" />
            <feFlood floodColor="var(--horizon-body-2)" floodOpacity="0.8" result="wideColor" />
            <feComposite in="wideColor" in2="wideAlpha" operator="in" result="wide" />
            <feOffset in="wide" dy="18" result="wideDown" />

            <feGaussianBlur in="SourceAlpha" stdDeviation="6 20" result="midAlpha" />
            <feFlood floodColor="var(--horizon-body-0)" floodOpacity="0.9" result="midColor" />
            <feComposite in="midColor" in2="midAlpha" operator="in" result="mid" />

            <feGaussianBlur in="SourceAlpha" stdDeviation="1.4 6" result="tightAlpha" />
            <feFlood floodColor="var(--horizon-rim-soft)" floodOpacity="1" result="tightColor" />
            <feComposite in="tightColor" in2="tightAlpha" operator="in" result="tight" />

            <feMerge>
              <feMergeNode in="wideDown" />
              <feMergeNode in="wide" />
              <feMergeNode in="mid" />
              <feMergeNode in="tight" />
            </feMerge>
          </filter>
        </defs>

        <path d={`${arc} L1640 560 L-200 560 Z`} fill="url(#horizon-air)" filter="url(#horizon-air-blur)" />

        <path
          d={arc}
          fill="none"
          stroke="var(--horizon-rim-soft)"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#horizon-bloom)"
        />
      </svg>

      <div className="horizon-fade" />
    </div>
  );
}
