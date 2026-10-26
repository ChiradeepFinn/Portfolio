'use client';

import { useEffect, useState } from 'react';

/**
 * True once the page has moved far enough that the nav is sitting over content.
 * Used to firm up the nav's glass instead of animating it on every scroll tick.
 */
export function useScrolled(threshold = 24): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > threshold);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [threshold]);

  return scrolled;
}
