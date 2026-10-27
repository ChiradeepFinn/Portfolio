/** Absolute URL for a site path, given the public origin. */
export function absolute(base: string, path: string): string {
  return path === '/' ? `${base}/` : `${base}${path}`;
}

/**
 * Twin request to canonical page path.
 *
 * Only the shapes listed here are served, so a twin cannot be talked into
 * reading something that is not a published record. The `.md` suffix is
 * stripped from every segment, which lets the handler answer both the rewritten
 * `/projects/sidequest.md` and a direct `/api/md/projects/sidequest`.
 */
export function canonicalPathFor(segments: readonly string[]): string | null {
  const parts = segments
    .map((segment) => segment.replace(/\.md$/i, ''))
    .filter((segment) => segment.length > 0);

  if (parts.length === 0) return null;
  if (parts.some((part) => part.includes('..') || part.includes('/') || part.includes('\\'))) return null;
  if (parts.some((part) => !/^[a-z0-9-]+$/.test(part))) return null;

  if (parts.length === 1 && parts[0] === 'index') return '/';
  if (parts.length === 2 && parts[0] === 'projects') return `/projects/${parts[1]}`;
  if (parts.length === 2 && parts[0] === 'philosophy') return `/philosophy/${parts[1]}`;
  if (parts.length === 3 && parts[0] === 'archive' && parts[1] === 'research') {
    return `/archive/research/${parts[2]}`;
  }

  return null;
}
