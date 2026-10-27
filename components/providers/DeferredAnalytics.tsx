'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Analytics = dynamic(() => import('@vercel/analytics/next').then((mod) => mod.Analytics), {
  ssr: false,
});
const SpeedInsights = dynamic(
  () => import('@vercel/speed-insights/next').then((mod) => mod.SpeedInsights),
  { ssr: false },
);

/** Long enough to stay out of the first paint, short enough not to lose a visit. */
const FALLBACK_MS = 3000;

/**
 * Analytics, loaded once the browser is idle.
 *
 * Neither script renders anything, so nothing about the page moves. Waiting for
 * idle keeps two requests out of the window where the hero is still painting.
 *
 * Idle is used rather than first interaction because Speed Insights reports
 * Core Web Vitals: its observers read buffered entries, so a short wait keeps
 * LCP and CLS, while waiting for a click could miss a visit that never has one.
 * A failed chunk leaves this island rendering nothing; the page does not care.
 */
export function DeferredAnalytics() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const idle = window.requestIdleCallback;
    if (typeof idle === 'function') {
      const handle = idle(() => setReady(true), { timeout: FALLBACK_MS });
      return () => window.cancelIdleCallback?.(handle);
    }

    const timer = window.setTimeout(() => setReady(true), FALLBACK_MS);
    return () => window.clearTimeout(timer);
  }, []);

  if (!ready) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
