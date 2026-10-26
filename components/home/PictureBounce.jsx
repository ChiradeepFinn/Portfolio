'use client';

import { useEffect, useRef, useState } from 'react';
import BounceCards from '@/components/ui/BounceCards';

const FAN = 6;

function sample(images, count) {
  if (images.length <= count) return [...images];
  const last = images.length - 1;
  return Array.from({ length: count }, (_, index) => images[Math.round((index * last) / (count - 1))]);
}

function fanProps(width, count, span) {
  const page = span === 'page';
  const cardSize = page
    ? width < 480
      ? 132
      : width < 800
        ? 188
        : count > 6
          ? 210
          : 260
    : width < 480
      ? 112
      : width < 800
        ? 160
        : 200;
  const pushDistance = page
    ? width < 480
      ? 24
      : width < 800
        ? 40
        : 64
    : width < 480
      ? 40
      : width < 800
        ? 88
        : 145;
  const half = Math.max(1, (count - 1) / 2);
  const room = width / 2 - cardSize / 2 - pushDistance - 16;
  const spread = Math.round(Math.max(18, Math.min(page ? 150 : 85, room / half)));
  return {
    containerWidth: Math.max(cardSize, Math.floor(width)),
    containerHeight: page ? (width < 480 ? 250 : width < 800 ? 340 : 420) : width < 480 ? 210 : 320,
    cardSize,
    spread,
    pushDistance,
  };
}

export function PictureBounce({ images, label = 'Artwork', span = 'aside', limit = FAN }) {
  const frame = useRef(null);
  const [width, setWidth] = useState(0);
  const sources = sample(images, limit).map((src, index) => ({
    src,
    alt: `${label} ${index + 1}`,
  }));

  useEffect(() => {
    const el = frame.current;
    if (!el) return undefined;
    const measure = () => setWidth(el.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (sources.length === 0) return null;

  const sized = fanProps(width || 500, sources.length, span);

  return (
    <div ref={frame} className="min-w-0">
      {width > 0 ? (
        <BounceCards
          images={sources}
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
          animationStagger={0.16}
          borderWidth={2}
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
