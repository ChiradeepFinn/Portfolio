import { extname } from 'node:path';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { media } from '@/lib/media';

const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

type ImageFolder = Exclude<keyof typeof media.images, 'profile'>;

/**
 * Public image URLs in a media folder, sorted by filename.
 * Server-only: this reads the filesystem.
 */
export function listPublicImages(folder: ImageFolder): readonly string[] {
  const directory = path.join(process.cwd(), 'public', 'images', folder);
  let names: string[];
  try {
    names = readdirSync(directory);
  } catch {
    return [];
  }

  return names
    .filter((name) => imageExtensions.has(extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((name) => `${media.images[folder]}/${encodeURIComponent(name)}`);
}
