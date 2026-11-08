'use client';

import { useEffect, useRef, useState } from 'react';
import BounceCards from '@/components/ui/BounceCards';

import { media } from '@/lib/media';

const portraits = [
  { src: media.images.aboutPortraits.transit, alt: 'Chiradeep, seated on a bus at night.' },
  { src: media.images.aboutPortraits.studio, alt: 'Chiradeep, in a studio portrait.' },
  { src: media.images.aboutPortraits.wall, alt: 'Chiradeep, photographed against a pale wall.' },
];

/**
 * Controlled fan for the about header.
 * Image stays secondary to the copy: smaller cards, reserved height for the
 * enter animation so the column does not shift when BounceCards mounts.
 */
function fanProps(width: number, count: number) {
  const cardSize = width < 420 ? 112 : width < 640 ? 132 : width < 900 ? 148 : 160;
  const pushDistance = width < 420 ? 18 : width < 640 ? 24 : 30;
  const half = Math.max(1, (count - 1) / 2);
  const halfBox = cardSize * 0.58;
  const room = width / 2 - halfBox - pushDistance - 8;
  const spread = Math.round(Math.max(28, Math.min(78, room / half)));
  const containerHeight = Math.round(cardSize * 1.28 + pushDistance * 0.35);
  return {
    containerWidth: Math.max(cardSize, Math.floor(width)),
    containerHeight,
    cardSize,
    spread,
    pushDistance,
  };
}

export function AboutPortraits() {
  const frame = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = frame.current;
    if (!el) return undefined;
    const measure = () => setWidth(el.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const sized = fanProps(width || 280, portraits.length);

  return (
    <div
      ref={frame}
      className="about-portraits mx-auto w-full max-w-[18rem] min-w-0 px-1 py-2 sm:max-w-[20rem] md:max-w-[22rem] lg:mx-0 lg:max-w-[17.5rem] lg:justify-self-end lg:px-0 lg:py-1"
      style={{ minHeight: sized.containerHeight }}
      aria-label="Portrait photographs"
    >
      {width > 0 ? (
        <BounceCards
          images={portraits}
          containerWidth={sized.containerWidth}
          containerHeight={sized.containerHeight}
          cardSize={sized.cardSize}
          spread={sized.spread}
          rotation={12}
          arc={-3}
          pushDistance={sized.pushDistance}
          hoverScale={1.04}
          bounciness={0.3}
          animationDelay={0.35}
          animationStagger={0.28}
          borderWidth={1}
          borderColor="var(--color-foreground)"
          radius={18}
          shadow
          enableHover
        />
      ) : (
        <div style={{ height: sized.containerHeight }} aria-hidden="true" />
      )}
    </div>
  );
}
