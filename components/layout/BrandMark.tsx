'use client';

import Image, { type ImageProps } from 'next/image';
import { usePathname } from 'next/navigation';
import { brandLogo, media } from '@/lib/media';

type BrandMarkProps = Omit<ImageProps, 'src' | 'unoptimized'> & {
  /**
   * When true, may use the animated GIF on non-About routes.
   * Nav keeps the still mark (~10 KB) so Lighthouse does not pay ~460 KB for a 40px logo.
   */
  readonly animated?: boolean;
};

/** Site mark. About is always still. Nav defaults to still for performance. */
export function BrandMark({ decoding = 'async', animated = false, ...props }: BrandMarkProps) {
  const logo = brandLogo(usePathname());
  const useGif = animated && logo.unoptimized;
  const src = useGif ? logo.src : media.brand.logo;
  const unoptimized = useGif;

  return <Image {...props} src={src} unoptimized={unoptimized} decoding={decoding} />;
}
