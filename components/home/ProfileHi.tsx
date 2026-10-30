'use client';

import { useCallback, useEffect, useRef, useState, type FocusEvent } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { media } from '@/lib/media';

const finePointerQuery = '(hover: hover) and (pointer: fine)';

/** How far the cursor can be from the portrait before the greeting appears. */
const approachPadding = 72;

/** Wave length when the pointer is nearby but not on the portrait. */
const waveLimitMs = 2500;

/**
 * Portrait in the hero identity line. On a fine pointer the wave appears as
 * the cursor approaches and, unless the pointer is on the portrait, lasts
 * under three seconds. A hover keeps it waving. Touch and keyboard show the
 * same short wave.
 */
export function ProfileHi() {
  const reduce = useReducedMotion();
  const frameRef = useRef<HTMLButtonElement>(null);
  const nearRef = useRef(false);
  const hoveredRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const [hovered, setHovered] = useState(false);
  const [waving, setWaving] = useState(false);

  const stopWave = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setWaving(false);
  }, []);

  const startTimedWave = useCallback(() => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    setWaving(true);
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      setWaving(false);
    }, waveLimitMs);
  }, []);

  useEffect(() => () => stopWave(), [stopWave]);

  useEffect(() => {
    const fine = window.matchMedia(finePointerQuery);
    if (!fine.matches) return;

    function handleMove(event: PointerEvent) {
      const frame = frameRef.current;
      if (!frame) return;
      const rect = frame.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const reach = Math.hypot(rect.width, rect.height) / 2 + approachPadding;
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      const isNear = dx * dx + dy * dy < reach * reach;

      if (inside !== hoveredRef.current) {
        hoveredRef.current = inside;
        setHovered(inside);
        if (inside && timerRef.current !== null) {
          window.clearTimeout(timerRef.current);
          timerRef.current = null;
          setWaving(false);
        }
      }

      if (isNear !== nearRef.current) {
        const entered = isNear && !nearRef.current;
        nearRef.current = isNear;
        if (entered && !inside) startTimedWave();
        if (!isNear && !hoveredRef.current) stopWave();
      }
    }

    function handleLeave() {
      nearRef.current = false;
      hoveredRef.current = false;
      setHovered(false);
      stopWave();
    }

    window.addEventListener('pointermove', handleMove, { passive: true });
    document.addEventListener('pointerleave', handleLeave);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerleave', handleLeave);
    };
  }, [startTimedWave, stopWave]);

  useEffect(() => {
    if (!waving) return;
    const fine = window.matchMedia(finePointerQuery);
    if (fine.matches) return;

    function handlePointerDown(event: PointerEvent) {
      if (frameRef.current?.contains(event.target as Node)) return;
      stopWave();
    }

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [waving, stopWave]);

  function handleClick() {
    if (window.matchMedia(finePointerQuery).matches) return;
    startTimedWave();
  }

  function handleFocus(event: FocusEvent<HTMLButtonElement>) {
    if (event.currentTarget.matches(':focus-visible')) startTimedWave();
  }

  const visible = hovered || waving;

  return (
    <button
      type="button"
      ref={frameRef}
      aria-label="Chiradeep Finn"
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={() => stopWave()}
      className="relative inline-block h-12 w-12 shrink-0 cursor-default rounded-full border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-white/40 sm:h-14 sm:w-14"
    >
      <span className="absolute inset-0 overflow-hidden rounded-full bg-black ring-1 ring-white/30">
        <Image
          src={media.images.profile}
          alt=""
          fill
          priority
          sizes="56px"
          className="object-cover object-center"
        />
      </span>

      <AnimatePresence>
        {visible && (
          <motion.span
            key="wave"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.15 }}
            className="pointer-events-none absolute bottom-0 left-0 z-10 inline-block origin-[70%_80%] -translate-x-[18%] translate-y-[22%] text-base leading-none animate-wave"
          >
            👋
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
