import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Chiradeep',
    short_name: 'CF',
    description: 'Portfolio of Chiradeep, creative technologist.',
    start_url: '/',
    display: 'browser',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
