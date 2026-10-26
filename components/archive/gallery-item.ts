import type { ArtworkSize } from '@/lib/types';

export interface GalleryItem {
  readonly slug: string;
  readonly title: string;
  /** Secondary line, e.g. medium and year, or place. */
  readonly meta: string;
  /** CSS aspect-ratio value; keeps the masonry honest about proportions. */
  readonly ratio: string;
  readonly label: string;
  /** Public image URL. Absent while the slot is still reserved. */
  readonly src?: string;
}

/** Placeholder titles that should not appear as captions in the UI. */
const GENERIC_TITLES = new Set(['', 'artwork', 'reserved', 'photograph', 'untitled']);

/**
 * True when the item has a real title worth showing (not a file-scan placeholder).
 */
export function hasGalleryCaption(item: GalleryItem): boolean {
  return !GENERIC_TITLES.has(item.title.trim().toLowerCase());
}

/** Accessible label when the item has no real caption (file-scan / reserved). */
export function galleryItemLabel(item: GalleryItem, index: number): string {
  if (hasGalleryCaption(item)) return item.title;
  return `${item.label} ${index + 1}`;
}

export function ratioForSize(size: ArtworkSize): string {
  if (size === 'tall') return '3 / 4';
  if (size === 'wide') return '4 / 3';
  return '1 / 1';
}
