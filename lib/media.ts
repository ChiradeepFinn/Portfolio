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
 */

export const media = {
  brand: {
    /** Still mark. About keeps this. */
    logo: '/brand/logo.jpg',
    /** Animated mark used everywhere else. */
    mark: '/brand/1000054925.gif',
  },
  images: {
    profile: '/images/profile.webp',
    photography: '/images/photography',
    projects: '/images/projects',
    screenshots: '/images/screenshots',
    artwork: '/images/artwork',
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
  folder: keyof typeof media.images | 'videos',
  filename: string,
): string {
  if (folder === 'videos') {
    return `${media.videos.root}/${filename}`;
  }
  return `${media.images[folder]}/${filename}`;
}
