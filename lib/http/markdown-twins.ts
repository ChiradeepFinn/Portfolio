const twinRoutes = [
  { pattern: /^\/index\.md$/, destination: '/api/md/index' },
  { pattern: /^\/projects\/([a-z0-9-]+)\.md$/, prefix: '/api/md/projects/' },
  { pattern: /^\/philosophy\/([a-z0-9-]+)\.md$/, prefix: '/api/md/philosophy/' },
  {
    pattern: /^\/archive\/research\/([a-z0-9-]+)\.md$/,
    prefix: '/api/md/archive/research/',
  },
] as const;

export function markdownTwinDestination(pathname: string): string | null {
  for (const route of twinRoutes) {
    const match = route.pattern.exec(pathname);
    if (!match) continue;
    if ('destination' in route) return route.destination;
    return `${route.prefix}${match[1]}`;
  }

  return null;
}
