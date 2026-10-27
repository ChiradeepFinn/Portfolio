'use client';

import { useEffect, useRef } from 'react';

/**
 * Pauses the CSS animations under one element while nobody can see them.
 *
 * Returns a ref. While the element is more than `margin` outside the viewport,
 * or the tab is hidden, the element carries `data-offscreen`, and the single
 * rule in `globals.css` pauses every animation beneath it. Paused keeps the
 * animation's position, so coming back does not restart a loop mid-scroll.
 *
 * The margin exists so an element that is about to scroll into view is already
 * running when it arrives.
 */
export function usePauseOffscreen<T extends HTMLElement>(margin = '200px') {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;

    let onScreen = true;

    const apply = () => {
      if (onScreen && !document.hidden) node.removeAttribute('data-offscreen');
      else node.setAttribute('data-offscreen', '');
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!entry) return;
        onScreen = entry.isIntersecting;
        apply();
      },
      { rootMargin: margin },
    );

    observer.observe(node);
    document.addEventListener('visibilitychange', apply);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', apply);
      node.removeAttribute('data-offscreen');
    };
  }, [margin]);

  return ref;
}
