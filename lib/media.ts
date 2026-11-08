/**
 * Global public media paths.
 *
 * Drop files into `public/` using this layout - components read URLs from here
 * so add / update / remove never requires hunting string literals:
 *
 *   public/
 *     brand/logo.jpg
 *     brand/1000054925.gif
 *     images/profile.webp
 *     images/photography/…
 *     images/projects/…
 *     images/screenshots/…
 *     images/artwork/…
 *     images/artists/…
 */

export const media = {
  brand: {
    /** Still mark. About keeps this. */
    logo: '/brand/logo.jpg',
    /** Animated mark used everywhere else. */
    mark: '/brand/1000054925.gif',
    /** Official abstract-C mark used for favicons / Google Search. */
    official: '/brand/official-mark.png',
  },
  images: {
    profile: '/images/profile.webp',
    /** Cover for The Inward Silhouette (books shelf + timeline). */
    bookCover: '/images/the-inward-silhouette.webp',
    photographyPic: '/images/photography_pic.png',
    aboutPic: '/images/about_pic.webp',
    photography: '/images/photography',
    projects: '/images/projects',
    screenshots: '/images/screenshots',
    artwork: '/images/artwork',
    rooms: {
      projects: '/images/rooms/project.jpg',
      music: '/images/rooms/music-production.jpg',
      books: '/images/rooms/books.jpg',
      research: '/images/rooms/research.jpg',
      photography: '/images/rooms/photography.jpg',
      artwork: '/images/rooms/art.jpg',
      philosophy: '/images/rooms/philosophy.jpg',
    },
    aboutPortraits: {
      transit: '/images/about_pics/transit.jpg',
      studio: '/images/about_pics/studio.jpg',
      wall: '/images/about_pics/wall.jpg',
    },
  },
  videos: {
    root: '/videos',
    /** Placeholder / final film: https://youtu.be/DIqngAXHzTI */
    introductionYouTubeId: 'DIqngAXHzTI',
  },
} as const;

/** Still logo on About. Animated gif on every other route. */
export function brandLogo(pathname: string) {
  const still = pathname === '/about';
  return {
    src: still ? media.brand.logo : media.brand.mark,
    unoptimized: !still,
  } as const;
}

/** Build a path under a media folder, e.g. `mediaPath('projects', 'know-who.jpg')`. */
export function mediaPath(
  folder: 'photography' | 'projects' | 'screenshots' | 'artwork' | 'videos',
  filename: string,
): string {
  if (folder === 'videos') {
    return `${media.videos.root}/${filename}`;
  }
  return `${media.images[folder]}/${filename}`;
}
