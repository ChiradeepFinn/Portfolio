'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { SearchItem } from '@/lib/search';
import { identity } from '@/lib/site';
import { BrandMark } from '@/components/layout/BrandMark';
import { PillNav } from './PillNav';
import { SearchButton } from './SearchButton';

/** Overlay panels — async chunks; mount/AnimatePresence behavior unchanged. */
const SearchPalette = dynamic(() => import('./SearchPalette').then((mod) => mod.SearchPalette));
const ExploreTray = dynamic(() => import('./ExploreTray').then((mod) => mod.ExploreTray));

type Panel = 'search' | 'explore' | null;

interface NavShellProps {
  readonly searchIndex: readonly SearchItem[];
}

/** Desktop starts here. Phones and tablets keep only the logo and search. */
const desktopNavQuery = '(min-width: 80rem)';

function LogoMark() {
  return (
    <Link
      href="/"
      aria-label={`${identity.name} - home`}
      className="relative z-10 block h-10 w-10 shrink-0 overflow-hidden rounded-full bg-black"
    >
      {/*
        Eager, but not preloaded. The mark is an unoptimized animated GIF of
        about 460 KB shown at 40px; `priority` put it in front of the hero
        heading in the critical path, and the mark is never the LCP element.
      */}
      <BrandMark
        alt=""
        fill
        loading="eager"
        sizes="80px"
        className="origin-center scale-[1.08] object-cover"
      />
    </Link>
  );
}

export function NavShell({ searchIndex }: NavShellProps) {
  const [panel, setPanel] = useState<Panel>(null);
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPanel(null);
  }, [pathname]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setPanel(null);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setPanel(null);
        return;
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPanel((current) => (current === 'search' ? null : 'search'));
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const query = window.matchMedia(desktopNavQuery);
    const closeExploreOnNarrow = () => {
      if (!query.matches) {
        setPanel((current) => (current === 'explore' ? null : current));
      }
    };

    closeExploreOnNarrow();
    query.addEventListener('change', closeExploreOnNarrow);
    return () => query.removeEventListener('change', closeExploreOnNarrow);
  }, []);

  const toggleExplore = useCallback(
    () => setPanel((current) => (current === 'explore' ? null : 'explore')),
    [],
  );
  const toggleSearch = useCallback(
    () => setPanel((current) => (current === 'search' ? null : 'search')),
    [],
  );
  const close = useCallback(() => setPanel(null), []);

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4 sm:top-5 sm:px-6 xl:px-8">
      <div ref={rootRef} className="relative flex items-center justify-between">
        <LogoMark />

        {/* Absolute so the pill stays on the viewport center, not between the two icons. */}
        <div className="absolute inset-x-0 top-1/2 hidden -translate-y-1/2 justify-center xl:flex">
          <PillNav isExploreOpen={panel === 'explore'} onExploreToggle={toggleExplore} />
        </div>

        <SearchButton isOpen={panel === 'search'} onClick={toggleSearch} />

        <SearchPalette isOpen={panel === 'search'} onClose={close} index={searchIndex} />
        <ExploreTray isOpen={panel === 'explore'} onClose={close} />
      </div>
    </header>
  );
}
