import { configuredOrigin } from '@/lib/http/origin';

/**
 * Everything public is crawlable. The named agents are listed so the rule for
 * each one is explicit rather than inherited from `*`; naming an agent allows
 * it to read the site and claims nothing about how it ranks or cites the site.
 *
 * The Markdown twins are not disallowed here. They answer `X-Robots-Tag:
 * noindex` with a canonical `Link` to the HTML page, which keeps them out of an
 * index while still letting an agent fetch one.
 *
 * `Agentmap:` advertises the ARD v0.91 manifest (§5.1).
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

const DISALLOW = ['/api/', '/auth/'] as const;

function ruleBlock(userAgent: string): string {
  return [
    `User-agent: ${userAgent}`,
    'Allow: /',
    ...DISALLOW.map((path) => `Disallow: ${path}`),
    '',
  ].join('\n');
}

export function robotsTxtBody(site = configuredOrigin() ?? 'http://localhost:3000'): string {
  const ard = `${site}/.well-known/ard.json`;

  const blocks = [
    ruleBlock('*'),
    [
      'User-agent: Googlebot',
      'Allow: /',
      ...DISALLOW.map((path) => `Disallow: ${path}`),
      '',
    ].join('\n'),
    ['User-agent: Googlebot-Image', 'Allow: /', ''].join('\n'),
    ruleBlock('Bingbot'),
    ...AI_AGENTS.map((agent) => ruleBlock(agent)),
    `Sitemap: ${site}/sitemap.xml`,
    `Host: ${site}`,
    `Agentmap: ${ard}`,
    '',
  ];

  return blocks.join('\n');
}

/** Shape used by SEO tests that previously read MetadataRoute.Robots. */
export function robotsDocument(site = configuredOrigin() ?? 'http://localhost:3000') {
  return {
    sitemap: `${site}/sitemap.xml`,
    host: site,
    agentmap: `${site}/.well-known/ard.json`,
    rules: [
      { userAgent: '*', allow: '/', disallow: [...DISALLOW] },
      { userAgent: 'Googlebot', allow: '/', disallow: [...DISALLOW] },
      { userAgent: 'Googlebot-Image', allow: '/' },
      { userAgent: 'Bingbot', allow: '/', disallow: [...DISALLOW] },
      ...AI_AGENTS.map((userAgent) => ({ userAgent, allow: '/', disallow: [...DISALLOW] })),
    ],
  };
}
