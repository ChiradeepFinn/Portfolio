'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

interface ArtworkCardsProps {
  readonly sources: readonly string[];
}

const tilt = [-2.1, 1.5, -1.1, 1.8, -1.6, 0.9];

/**
 * Artwork prints land one after another. Each spring overshoots once, then
 * settles. The tilt is the resting angle, not a spin.
 */
export function ArtworkCards({ sources }: ArtworkCardsProps) {
  const reduce = useReducedMotion() === true;
  if (sources.length === 0) return null;

  return (
    <ul className="mt-8 flex flex-wrap items-end gap-x-4 gap-y-8 sm:gap-x-6">
      {sources.map((src, index) => {
        const angle = tilt[index % tilt.length] ?? 0;
        return (
          <motion.li
            key={src}
            className="w-[9.5rem] sm:w-[12.5rem]"
            initial={reduce ? false : { opacity: 0, y: 96, rotate: angle }}
            whileInView={{ opacity: 1, y: 0, rotate: angle }}
            viewport={{ once: true, margin: '-8%' }}
            transition={
              reduce
                ? { duration: 0 }
                : { type: 'spring', stiffness: 520, damping: 12, mass: 0.7, delay: index * 0.16 }
            }
          >
            <figure className="border border-border bg-background">
              <div className="relative aspect-[4/5]">
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 200px, 152px"
                  className="object-cover"
                />
              </div>
              <figcaption className="meta px-2 py-1.5">
                {String(index + 1).padStart(2, '0')}
              </figcaption>
            </figure>
          </motion.li>
        );
      })}
    </ul>
  );
}
