'use client';

import { usePathname } from 'next/navigation';
import { NebulaCta } from './NebulaCta';

/** The site has one closing invitation. The contact page already is that invitation. */
export function ClosingBand() {
  const pathname = usePathname();
  if (pathname === '/contact') return null;
  return <NebulaCta />;
}
