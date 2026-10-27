import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  if (!site.startsWith('https://') || /localhost|127\.0\.0\.1/.test(site)) {
    console.warn(
      'NEXT_PUBLIC_SITE_URL must be the public https origin before this build is deployed. Localhost is only for development.',
    );
  }
}

/** React needs unsafe-eval in development for stack reconstruction; never in production. */
const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  ...(isProd ? [] : ["'unsafe-eval'"]),
  'https://www.youtube.com',
  'https://s.ytimg.com',
].join(' ');

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  `script-src ${scriptSrc}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self'",
  "media-src 'self' blob:",
  "worker-src 'self' blob:",
  // 127.0.0.1:7618 = Cursor debug-mode ingest (dev only); never in production.
  `connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.youtube.com https://*.googlevideo.com https://youtubei.googleapis.com${isProd ? '' : ' http://127.0.0.1:7618'}`,
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
  ...(isProd ? ['upgrade-insecure-requests'] : []),
].join('; ');

const nextConfig: NextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  // Local Windows workaround: custom dist dirs avoid locked `.next` folders.
  // On Vercel, always use the platform default so the builder finds the output.
  distDir: process.env.VERCEL
    ? '.next'
    : isProd
      ? process.env.NEXT_DIST_DIR || '.next-build'
      : '.next-dev',
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  experimental: {
    // The on-disk Turbopack cache on this drive was compacting for minutes and stalling every request.
    turbopackFileSystemCacheForDev: false,
  },
  async redirects() {
    return [
      { source: '/sitemap', destination: '/sitemap.xml', permanent: false },
      { source: '/feed.xml', destination: '/rss.xml', permanent: false },
      { source: '/rss', destination: '/rss.xml', permanent: false },
    ];
  },
  /**
   * Markdown twins. A published page answers at the same URL with `.md`
   * appended; the handler serializes the record the page renders. The pattern
   * requires the suffix, so `/projects/sidequest` still returns the HTML page.
   */
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/index.md', destination: '/api/md/index' },
        { source: '/projects/:slug\\.md', destination: '/api/md/projects/:slug' },
        { source: '/philosophy/:slug\\.md', destination: '/api/md/philosophy/:slug' },
        { source: '/archive/research/:slug\\.md', destination: '/api/md/archive/research/:slug' },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Content-Security-Policy', value: contentSecurityPolicy },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
          ...(isProd
            ? [{ key: 'Strict-Transport-Security', value: 'max-age=15552000' }]
            : []),
        ],
      },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // The ESM entry has been incomplete on this machine before. The CJS build is the one Turbopack should resolve.
  turbopack: {
    resolveAlias: {
      'framer-motion': './node_modules/framer-motion/dist/cjs/index.js',
    },
  },
};

const withMDX = createMDX({
  extension: /\.mdx$/,
  options: {
    // String names stay serializable for Turbopack. Function imports do not.
    remarkPlugins: ['remark-frontmatter', 'remark-mdx-frontmatter'],
  },
});

export default withMDX(nextConfig);
