'use client';

import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchButtonProps {
  readonly isOpen: boolean;
  readonly onClick: () => void;
}

/**
 * A bare glyph, matching the reference bar: search sits opposite the logo
 * with no enclosing circle, so it reads as a tool rather than a second pill.
 */
export function SearchButton({ isOpen, onClick }: SearchButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-label="Search"
      className={cn(
        'relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground/75 transition-colors duration-200 hover:text-foreground',
        isOpen && 'text-foreground',
      )}
    >
      <Search size={18} strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}
