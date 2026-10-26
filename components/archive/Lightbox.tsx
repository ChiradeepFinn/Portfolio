'use client';

import { useCallback, useEffect } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { SlotFrame } from '@/components/ui/SlotFrame';
import { galleryItemLabel, hasGalleryCaption, type GalleryItem } from './gallery-item';

interface LightboxProps {
  readonly items: readonly GalleryItem[];
  readonly index: number | null;
  readonly onClose: () => void;
  readonly onNavigate: (index: number) => void;
}

const chromeBtn =
  'flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/55 transition-[color,background-color,border-color,transform] duration-200 hover:border-white/20 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100';

/**
 * Fullscreen viewer for the archive galleries. Arrow keys move between works
 * and Escape closes, so the collection can be read without touching the mouse.
 */
export function Lightbox({ items, index, onClose, onNavigate }: LightboxProps) {
  const reduce = useReducedMotion();
  const isOpen = index !== null;

  const step = useCallback(
    (delta: number) => {
      if (index === null || items.length === 0) return;
      onNavigate((index + delta + items.length) % items.length);
    },
    [index, items.length, onNavigate],
  );

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
      else if (event.key === 'ArrowRight') step(1);
      else if (event.key === 'ArrowLeft') step(-1);
    }

    document.addEventListener('keydown', handleKeyDown);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [isOpen, onClose, step]);

  const item = index === null ? null : items[index];
  const current = (index ?? 0) + 1;
  const showCaption = item ? hasGalleryCaption(item) || Boolean(item.meta.trim()) : false;
  const dialogLabel = item
    ? `${galleryItemLabel(item, index ?? 0)} of ${items.length}`
    : 'Gallery viewer';

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={dialogLabel}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
          data-theme-scope="dark"
          className="fixed inset-0 z-60 flex flex-col" style={{ backgroundColor: "#070708" }}
        >
          <header className="relative z-10 flex items-center justify-between px-5 pt-5 sm:px-8 sm:pt-6">
            <p className="font-mono text-[0.72rem] tracking-[0.14em] text-white/40 tabular-nums">
              <span className="text-white/85">{String(current).padStart(2, '0')}</span>
              <span className="mx-2 text-white/20">/</span>
              <span>{String(items.length).padStart(2, '0')}</span>
            </p>
            <button type="button" onClick={onClose} aria-label="Close viewer" className={chromeBtn}>
              <X size={16} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </header>

          <div className="relative z-10 flex min-h-0 flex-1 items-center px-2 sm:px-4">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous"
              className={`${chromeBtn} absolute left-3 z-20 hidden sm:flex lg:left-6`}
            >
              <ChevronLeft size={18} strokeWidth={1.5} aria-hidden="true" />
            </button>

            <motion.figure
              key={item.slug}
              initial={reduce ? false : { opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={reduce ? { duration: 0 } : { duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col items-center justify-center px-12 sm:px-16 lg:px-20"
            >
              {item.src ? (
                <div className="flex h-[min(68vh,42rem)] w-full items-center justify-center">
                  <Image
                    src={item.src}
                    alt={galleryItemLabel(item, index ?? 0)}
                    width={1600}
                    height={2000}
                    sizes="(min-width: 1024px) 56rem, 100vw"
                    className="max-h-[min(68vh,42rem)] w-auto max-w-full rounded-[1.35rem] object-contain sm:rounded-[1.65rem]"
                    priority
                  />
                </div>
              ) : (
                <SlotFrame
                  label={item.label}
                  ratio={item.ratio}
                  tone="neutral"
                  quiet={!hasGalleryCaption(item)}
                  className="h-[min(68vh,42rem)] w-auto max-w-full rounded-[1.5rem] sm:rounded-[1.85rem]"
                />
              )}

              {showCaption ? (
                <figcaption className="mt-6 max-w-md text-center">
                  {hasGalleryCaption(item) ? (
                    <p className="text-[0.92rem] tracking-wide text-white/80">{item.title}</p>
                  ) : null}
                  {item.meta.trim() ? (
                    <p className="mt-1.5 font-mono text-[0.65rem] tracking-[0.12em] text-white/35">
                      {item.meta}
                    </p>
                  ) : null}
                </figcaption>
              ) : null}
            </motion.figure>

            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next"
              className={`${chromeBtn} absolute right-3 z-20 hidden sm:flex lg:right-6`}
            >
              <ChevronRight size={18} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>

          {/* Mobile prev/next — keeps affordances without crowding the stage */}
          <div className="relative z-10 flex items-center justify-center gap-3 pb-2 sm:hidden">
            <button type="button" onClick={() => step(-1)} aria-label="Previous" className={chromeBtn}>
              <ChevronLeft size={18} strokeWidth={1.5} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => step(1)} aria-label="Next" className={chromeBtn}>
              <ChevronRight size={18} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>

          <footer className="relative z-10 px-5 pb-6 pt-3 text-center sm:px-8 sm:pb-7">
            <p className="font-mono text-[0.62rem] tracking-[0.16em] text-white/25 uppercase">
              <span className="text-white/40">←</span>
              <span className="mx-2">arrows</span>
              <span className="text-white/40">→</span>
              <span className="mx-3 text-white/15">·</span>
              <span className="text-white/40">esc</span>
              <span className="ml-2">close</span>
            </p>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
