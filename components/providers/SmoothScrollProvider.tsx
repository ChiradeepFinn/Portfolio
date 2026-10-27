'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Leaf Lenis mount. Does not wrap page content — layout keeps RSC children
 * as siblings so this file only ships the scroll effect.
 *
 * The loop stops while the tab is hidden. Lenis has nothing useful to do on a
 * background tab, and leaving `requestAnimationFrame` running burns battery.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });

    let frameId = 0;

    const tick = (time: number) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (frameId || document.hidden) return;
      frameId = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (!frameId) return;
      cancelAnimationFrame(frameId);
      frameId = 0;
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    start();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      stop();
      lenis.destroy();
    };
  }, []);

  return null;
}
