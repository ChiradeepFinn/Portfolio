import type { MetadataRoute } from 'next';
import { siteDescription } from '@/lib/seo';
import { identity } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: identity.name,
    short_name: identity.preferredName,
    description: siteDescription,
    start_url: '/',
    display: 'browser',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      { src: '/icon', sizes: '48x48', type: 'image/png', purpose: 'any' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
