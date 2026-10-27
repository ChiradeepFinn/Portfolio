import { siteSections } from '@/lib/feeds/sections';
import { absolute } from '@/lib/feeds/paths';

/**
 * Paths that always exist as HTML (or generated files) even when they have no
 * Markdown twin. Used so Markdown Accept on a real page does not 404.
 */
const STATIC_PUBLIC = new Set<string>([
  ...siteSections.map((section) => section.path),
  '/rss.xml',
  '/sitemap.xml',
  '/llms.txt',
  '/llms-full.txt',
  '/robots.txt',
  '/manifest.webmanifest',
  '/icon',
  '/icon.svg',
  '/apple-icon',
  '/opengraph-image',
  '/index.md',
]);

const STATIC_PREFIXES = [
  '/api/',
  '/_next/',
  '/auth/',
  '/images/',
  '/brand/',
  '/videos/',
  '/fonts/',
] as const;

/** HTML page path → `/api/md/...` twin destination. */
export function markdownNegotiationDestination(pathname: string): string | null {
  if (pathname === '/') return '/api/md/index';
  const project = /^\/projects\/([a-z0-9-]+)$/.exec(pathname);
  if (project) return `/api/md/projects/${project[1]}`;
  const essay = /^\/philosophy\/([a-z0-9-]+)$/.exec(pathname);
  if (essay) return `/api/md/philosophy/${essay[1]}`;
  const research = /^\/archive\/research\/([a-z0-9-]+)$/.exec(pathname);
  if (research) return `/api/md/archive/research/${research[1]}`;
  return null;
}

/** True when this path is a known public surface, asset, or twin-shaped URL. */
export function isKnownPublicPath(pathname: string): boolean {
  if (STATIC_PUBLIC.has(pathname)) return true;
  if (STATIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return true;
  if (markdownNegotiationDestination(pathname)) return true;
  if (
    pathname === '/index.md' ||
    /^\/projects\/[a-z0-9-]+\.md$/.test(pathname) ||
    /^\/philosophy\/[a-z0-9-]+\.md$/.test(pathname) ||
    /^\/archive\/research\/[a-z0-9-]+\.md$/.test(pathname)
  ) {
    return true;
  }
  // Files with extensions (assets) are not agent 404 targets.
  if (/\.[a-z0-9]{1,8}$/i.test(pathname)) return true;
  return false;
}

/** Markdown body for an agent-facing 404. */
export function agentNotFoundMarkdown(base: string, path: string): string {
  return [
    '# Not found',
    `No published page exists at \`${path}\`.`,
    "This site is Chiradeep's personal portfolio. Start from one of these:",
    `- [Home](${absolute(base, '/')})`,
    `- [Projects](${absolute(base, '/projects')})`,
    `- [llms.txt](${absolute(base, '/llms.txt')})`,
    `- [Sitemap](${absolute(base, '/sitemap.xml')})`,
  ].join('\n\n') + '\n';
}
