import type { MetadataRoute } from 'next';
import { configuredOrigin } from '@/lib/http/origin';

/**
 * Everything public is crawlable. The named agents are listed so the rule for
 * each one is explicit rather than inherited from `*`; naming an agent allows
 * it to read the site and claims nothing about how it ranks or cites the site.
 *
 * The Markdown twins are not disallowed here. They answer `X-Robots-Tag:
 * noindex` with a canonical `Link` to the HTML page, which keeps them out of an
 * index while still letting an agent fetch one.
 */
const AI_AGENTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'Bytespider',
  'Amazonbot',
  'meta-externalagent',
  'cohere-ai',
] as const;

/** Routes that are not meant for search indexes (APIs, auth handshakes). */
const DISALLOW = ['/api/', '/auth/'] as const;

export default function robots(): MetadataRoute.Robots {
  const site = configuredOrigin() ?? 'http://localhost:3000';

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: [...DISALLOW] },
      { userAgent: 'Googlebot', allow: '/', disallow: [...DISALLOW] },
      { userAgent: 'Googlebot-Image', allow: '/' },
      { userAgent: 'Bingbot', allow: '/', disallow: [...DISALLOW] },
      ...AI_AGENTS.map((userAgent) => ({ userAgent, allow: '/', disallow: [...DISALLOW] })),
    ],
    sitemap: `${site}/sitemap.xml`,
    host: site,
  };
}
