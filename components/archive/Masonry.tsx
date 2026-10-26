'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { SlotFrame } from '@/components/ui/SlotFrame';
import { cn } from '@/lib/utils';
import { Lightbox } from './Lightbox';
import { galleryItemLabel, type GalleryItem } from './gallery-item';

interface MasonryProps {
  readonly items: readonly GalleryItem[];
  readonly className?: string;
}

/** Soft, slightly varied radii so the wall feels curated rather than tiled. */
const FRAME_RADII = [
  '1.35rem',
  '1.7rem 1.15rem 1.45rem 1.25rem',
  '1.15rem 1.65rem 1.25rem 1.5rem',
  '1.85rem 1.3rem 1.4rem 1.55rem',
  '1.25rem 1.55rem 1.75rem 1.2rem',
  '1.5rem 1.2rem 1.35rem 1.7rem',
] as const;

function viewLabel(item: GalleryItem, index: number): string {
  return `View ${galleryItemLabel(item, index)}`;
}

/**
 * Curated masonry.
 *
 * Built on CSS multi-column rather than a measured, absolutely-positioned
 * layout: proportions come straight from each work's own aspect ratio, there is
 * no resize-measure loop on the main thread, and nothing reflows during load.
 * Frames stay image-only — no title/caption overlays on the wall.
 */
export function Masonry({ items, className }: MasonryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduce = useReducedMotion();

  const close = useCallback(() => setOpenIndex(null), []);

  return (
    <>
      <div
        className={cn(
          'columns-1 gap-4 sm:columns-2 sm:gap-5 lg:columns-3 lg:gap-6 [&>*]:mb-4 sm:[&>*]:mb-5 lg:[&>*]:mb-6',
          className,
        )}
      >
        {items.map((item, index) => {
          const radius = FRAME_RADII[index % FRAME_RADII.length];

          return (
            <motion.button
              key={item.slug}
              type="button"
              onClick={() => setOpenIndex(index)}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: 0.55, delay: (index % 6) * 0.04, ease: [0.16, 1, 0.3, 1] }
              }
              className="group relative block w-full break-inside-avoid text-left focus-visible:outline-none"
              aria-label={viewLabel(item, index)}
            >
              {item.src ? (
                <div
                  className="relative overflow-hidden border border-border/70 bg-background shadow-[0_1px_0_rgba(0,0,0,0.04)] transition-[transform,box-shadow] duration-500 ease-cinematic group-hover:scale-[1.012] group-hover:shadow-[0_12px_28px_-18px_rgba(0,0,0,0.35)] group-focus-visible:ring-2 group-focus-visible:ring-foreground/25 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-background motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  style={{ aspectRatio: item.ratio, borderRadius: radius }}
                >
                  <Image
                    src={item.src}
                    alt={galleryItemLabel(item, index)}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    priority={index < 2}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div
                  className="overflow-hidden transition-transform duration-500 ease-cinematic group-hover:scale-[1.012] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  style={{ borderRadius: radius }}
                >
                  <SlotFrame
                    label={item.label}
                    ratio={item.ratio}
                    tone="neutral"
                    quiet
                    className="rounded-none border-0"
                  />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      <Lightbox items={items} index={openIndex} onClose={close} onNavigate={setOpenIndex} />
    </>
  );
}
