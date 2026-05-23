import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Snakke',
    short_name: 'Snakke',
    description:
      'Augmentative and Alternative Communication (AAC) app for accessible communication',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0ea5e9',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    categories: ['education', 'health', 'accessibility'],
    shortcuts: [
      {
        name: 'Communicate',
        short_name: 'Communicate',
        description: 'Start communicating with icons',
        url: '/communicate',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
    ],
    prefer_related_applications: false,
    screenshots: [],
  };
}
