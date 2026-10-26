'use client';

import { useEffect, useRef, useState } from 'react';
import BounceCards from '@/components/ui/BounceCards';

const portraits = [
  { src: '/images/about_pics/transit.jpg', alt: 'Chiradeep, seated on a bus at night.' },
  { src: '/images/about_pics/studio.jpg', alt: 'Chiradeep, in a studio portrait.' },
  { src: '/images/about_pics/wall.jpg', alt: 'Chiradeep, photographed against a pale wall.' },
];

/** Wider fan than the pictures section, sized to stay inside the header slot. */
function fanProps(width: number, count: number) {
  const cardSize = width < 480 ? 136 : width < 720 ? 196 : 252;
  const pushDistance = width < 480 ? 28 : width < 720 ? 52 : 64;
  const half = Math.max(1, (count - 1) / 2);
  const halfBox = cardSize * 0.62;
  const room = width / 2 - halfBox - pushDistance - 8;
  const spread = Math.round(Math.max(36, Math.min(168, room / half)));
  return {
    containerWidth: Math.max(cardSize, Math.floor(width)),
    containerHeight: width < 480 ? 220 : width < 720 ? 300 : 340,
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

  const sized = fanProps(width || 360, portraits.length);

  return (
    <div ref={frame} className="about-portraits mx-auto min-w-0 w-full lg:mx-0 lg:justify-self-end">
      {width > 0 ? (
        <BounceCards
          images={portraits}
          containerWidth={sized.containerWidth}
          containerHeight={sized.containerHeight}
          cardSize={sized.cardSize}
          spread={sized.spread}
          rotation={14}
          arc={-4}
          pushDistance={sized.pushDistance}
          hoverScale={1.06}
          bounciness={0.35}
          animationDelay={0.5}
          animationStagger={0.5}
          borderWidth={1}
          borderColor="var(--color-foreground)"
          radius={25}
          shadow
          enableHover
        />
      ) : (
        <div style={{ height: sized.containerHeight }} />
      )}
    </div>
  );
}
