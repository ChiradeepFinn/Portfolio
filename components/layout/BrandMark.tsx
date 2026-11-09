'use client';

import { useEffect, useState } from 'react';
import Image, { type ImageProps } from 'next/image';
import { usePathname } from 'next/navigation';
import { brandLogo, media } from '@/lib/media';

type BrandMarkProps = Omit<ImageProps, 'src' | 'unoptimized'>;

/**
 * Site mark. About stays still. Elsewhere: still first for paint, then the
 * animated GIF after idle so the ~460 KB file stays off the critical path.
 */
export function BrandMark({ decoding = 'async', ...props }: BrandMarkProps) {
  const pathname = usePathname();
  const logo = brandLogo(pathname);
  const [src, setSrc] = useState(logo.unoptimized ? media.brand.logo : logo.src);
  const [unoptimized, setUnoptimized] = useState(false);

  useEffect(() => {
    if (!logo.unoptimized) {
      setSrc(logo.src);
      setUnoptimized(false);
      return;
    }

    setSrc(media.brand.logo);
    setUnoptimized(false);

    let idleId: number | undefined;
    let timeoutId: number | undefined;
    const swap = () => {
      setSrc(logo.src);
      setUnoptimized(true);
    };

    const run = () => {
      if (typeof window.requestIdleCallback === 'function') {
        idleId = window.requestIdleCallback(swap, { timeout: 2500 });
      } else {
        timeoutId = window.setTimeout(swap, 1200);
      }
    };

    if (document.readyState === 'complete') run();
    else window.addEventListener('load', run, { once: true });

    return () => {
      window.removeEventListener('load', run);
      if (idleId !== undefined && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [logo.src, logo.unoptimized]);

  return <Image {...props} src={src} unoptimized={unoptimized} decoding={decoding} />;
}
