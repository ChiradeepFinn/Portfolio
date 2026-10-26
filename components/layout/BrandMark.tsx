'use client';

import Image, { type ImageProps } from 'next/image';
import { usePathname } from 'next/navigation';
import { brandLogo } from '@/lib/media';

type BrandMarkProps = Omit<ImageProps, 'src' | 'unoptimized'>;

/** Site mark. About keeps the still logo; every other page uses the gif. */
export function BrandMark({ decoding = 'async', ...props }: BrandMarkProps) {
  const logo = brandLogo(usePathname());
  // unoptimized keeps the animated GIF intact; decoding does not alter playback.
  return <Image {...props} src={logo.src} unoptimized={logo.unoptimized} decoding={decoding} />;
}
