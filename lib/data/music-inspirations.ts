/**
 * Artists that shape the working-order section on /music.
 * Image files live in public/images/artists/ (Wikimedia Commons sources).
 */

export interface MusicInspiration {
  readonly name: string;
  readonly role: string;
  readonly image: string;
  readonly alt: string;
}

export const musicInspirations = [
  {
    name: 'Conan Gray',
    role: 'Singer-songwriter',
    image: '/images/artists/conan-gray.jpg',
    alt: 'Conan Gray performing on the Superache tour.',
  },
  {
    name: 'Billie Eilish',
    role: 'Singer-songwriter',
    image: '/images/artists/billie-eilish.jpg',
    alt: 'Billie Eilish at the 2019 iHeartRadio Music Awards.',
  },
  {
    name: 'FINNEAS',
    role: 'Producer',
    image: '/images/artists/finneas.jpg',
    alt: 'FINNEAS photographed in February 2025.',
  },
  {
    name: 'JVKE',
    role: 'Singer / Producer',
    image: '/images/artists/jvke.jpg',
    alt: 'JVKE performing in 2023.',
  },
  {
    name: 'LANY',
    role: 'Band',
    image: '/images/artists/lany.jpg',
    alt: 'LANY performing at The Shrine in 2019.',
  },
  {
    name: 'Cigarettes After Sex',
    role: 'Band',
    image: '/images/artists/cigarettes-after-sex.jpg',
    alt: 'Cigarettes After Sex performing in Manila in 2025.',
  },
  {
    name: 'Coldplay',
    role: 'Band',
    image: '/images/artists/coldplay.jpg',
    alt: 'Coldplay performing live.',
  },
  {
    name: 'Radiohead',
    role: 'Band',
    image: '/images/artists/radiohead.jpg',
    alt: 'Radiohead performing live.',
  },
] as const satisfies readonly MusicInspiration[];
