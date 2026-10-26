'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { navItems } from '@/lib/site';
import { cn } from '@/lib/utils';

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

interface PillNavProps {
  readonly isExploreOpen: boolean;
  readonly onExploreToggle: () => void;
}

const itemClass =
  'relative flex shrink-0 items-center whitespace-nowrap rounded-full px-3.5 py-[0.4rem] text-[0.8125rem] font-medium leading-none tracking-[-0.01em] transition-colors duration-200';

const pillClass = 'absolute inset-0 rounded-full bg-chrome-active';

/** Shared layout highlight — Framer layoutId only after mount to avoid SSR attribute mismatches. */
function ActivePill({ animate }: { readonly animate: boolean }) {
  if (animate) {
    return (
      <motion.span
        layoutId="pill-nav-active"
        className={pillClass}
        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
      />
    );
  }
  return <span className={pillClass} />;
}

export function PillNav({ isExploreOpen, onExploreToggle }: PillNavProps) {
  const pathname = usePathname() ?? '/';
  const [motionReady, setMotionReady] = useState(false);

  useEffect(() => {
    setMotionReady(true);
  }, []);

  return (
    <nav
      aria-label="Primary"
      className="nav-glass flex h-11 items-center rounded-full border border-border-strong px-1.5 backdrop-blur-[14px] [@media(prefers-reduced-transparency:reduce)]:border-border [@media(prefers-reduced-transparency:reduce)]:bg-chrome [@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none"
    >
      {navItems.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(itemClass, active ? 'text-foreground' : 'text-muted hover:text-foreground')}
          >
            {active ? <ActivePill animate={motionReady} /> : null}
            <span className="relative z-10">{item.label}</span>
          </Link>
        );
      })}

      <button
        type="button"
        onClick={onExploreToggle}
        aria-expanded={isExploreOpen}
        aria-controls="explore-tray"
        className={cn(itemClass, isExploreOpen ? 'text-foreground' : 'text-muted hover:text-foreground')}
      >
        {isExploreOpen ? <ActivePill animate={motionReady} /> : null}
        <span className="relative z-10 flex items-center gap-1">
          Explore
          <ChevronDown
            size={13}
            strokeWidth={2}
            aria-hidden="true"
            className={cn(
              'text-current opacity-80 transition-transform duration-300 ease-cinematic',
              isExploreOpen && 'rotate-180',
            )}
          />
        </span>
      </button>
    </nav>
  );
}
