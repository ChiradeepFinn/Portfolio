import type { MetadataRoute } from 'next';
import { configuredOrigin } from '@/lib/http/origin';

export default function robots(): MetadataRoute.Robots {
  const site = configuredOrigin() ?? 'http://localhost:3000';

  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: 'Googlebot', allow: '/' },
      { userAgent: 'Bingbot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
    ],
    sitemap: `${site}/sitemap.xml`,
    host: site,
  };
}
