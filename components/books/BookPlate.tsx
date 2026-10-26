'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useReducedMotion } from 'framer-motion';

/**
 * A short hardcover, about seventy pages. The rest angle is already in
 * perspective. Moving the pointer tilts it; a drag turns it and stays.
 * The cover image is not a drag source.
 */
const coverSrc = '/images/The Inward Silhouette.webp';

const restY = -36;
const restX = 10;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function BookPlate({ title }: { readonly title: string }) {
  const reduce = useReducedMotion() === true;
  const sceneRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; ax: number; ay: number } | null>(null);
  const turned = useRef({ x: 0, y: 0 });
  const shown = useRef({ x: 0, y: 0 });
  const [angle, setAngle] = useState({ x: 0, y: 0 });
  const [holding, setHolding] = useState(false);

  const show = (next: { x: number; y: number }, park = false) => {
    shown.current = next;
    if (park) turned.current = next;
    setAngle(next);
  };

  const tiltTo = (clientX: number, clientY: number) => {
    const rect = sceneRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (clientX - rect.left) / rect.width - 0.5;
    const py = (clientY - rect.top) / rect.height - 0.5;
    show({
      y: clamp(turned.current.y + px * 18, -42, 50),
      x: clamp(turned.current.x + py * -12, -20, 18),
    });
  };

  return (
    <div
      ref={sceneRef}
      className="book-scene relative"
      onDragStart={(event) => event.preventDefault()}
      onPointerDown={(event) => {
        if (reduce || event.button !== 0) return;
        event.preventDefault();
        drag.current = {
          x: event.clientX,
          y: event.clientY,
          ax: shown.current.x,
          ay: shown.current.y,
        };
        setHolding(true);
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (reduce) return;
        const held = drag.current;
        if (held) {
          show(
            {
              y: clamp(held.ay + (event.clientX - held.x) * 0.45, -42, 50),
              x: clamp(held.ax + (event.clientY - held.y) * -0.35, -20, 18),
            },
            true,
          );
          return;
        }
        tiltTo(event.clientX, event.clientY);
      }}
      onPointerUp={() => {
        drag.current = null;
        setHolding(false);
      }}
      onPointerCancel={() => {
        drag.current = null;
        setHolding(false);
      }}
      onPointerLeave={() => {
        if (drag.current) return;
        show(turned.current);
      }}
    >
      <div
        className="book"
        style={{
          transform: `rotateY(${restY + angle.y}deg) rotateX(${restX + angle.x}deg)`,
          transition: holding ? 'none' : undefined,
        }}
        aria-hidden="true"
      >
        <div className="book-back" />
        <div className="book-page-top" />
        <div className="book-pages" />
        <div className="book-spine">
          <span>{title}</span>
        </div>
        <div className="book-cover">
          <Image src={coverSrc} alt="" fill sizes="480px" draggable={false} />
          <span className="book-hinge" />
          <span className="book-sheen" />
        </div>
      </div>
      <p className="sr-only">{title} cover</p>
    </div>
  );
}
