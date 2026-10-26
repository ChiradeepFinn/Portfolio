'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * `useReducedMotion()` is `null` during server render and the real
 * `prefers-reduced-motion` value on the first client render. Branching on it
 * while rendering produces different HTML when reduced motion is enabled.
 * This stays false until after hydration, then follows the preference.
 */
export function useHydratedReducedMotion(): boolean {
  const preferred = useReducedMotion();
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(preferred === true);
  }, [preferred]);

  return reduce;
}
