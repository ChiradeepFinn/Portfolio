import { getCaseStudy } from '@/lib/data/case-studies';
import { listPublicImages } from '@/lib/public-images';
import type { Project } from '@/lib/types';

/**
 * Device frames for the study card plate.
 *
 * Drop shots into `public/images/screenshots/` as `{slug}-01.webp`,
 * `{slug}-02.webp`, … (any image extension). They are picked up in
 * filename order. Missing files leave the frame empty — same honesty as
 * other placeholder slots on the site.
 */

export type StudyDevice = 'safari' | 'android';

export interface StudyScreen {
  readonly src?: string;
  /** Safari address bar only. */
  readonly url?: string;
}

export interface StudyScreenSet {
  readonly device: StudyDevice;
  readonly screens: readonly StudyScreen[];
}

const WEB_COUNT = 2;
const MOBILE_COUNT = 3;

function hostFrom(url: string | null): string | undefined {
  if (!url) return undefined;
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return undefined;
  }
}

function isMobileProject(project: Project): boolean {
  const kind = getCaseStudy(project.slug)?.kind;
  if (kind === 'Mobile app' || kind === 'Cross-platform') return true;
  if (kind === 'Web app') return false;
  return project.stack.some((item) => /react native|^expo$/i.test(item));
}

function shotsForSlug(slug: string, available: readonly string[]): readonly string[] {
  const prefix = `${slug}-`;
  return available.filter((href) => {
    const name = decodeURIComponent(href.split('/').pop() ?? '').toLowerCase();
    return name.startsWith(prefix);
  });
}

/**
 * Resolve Safari (2) or Android (3) screens by slug from files under
 * screenshots/. Missing files leave the frame empty.
 */
export function getStudyScreensBySlug(
  slug: string,
  options: { readonly mobile?: boolean; readonly liveUrl?: string | null } = {},
): StudyScreenSet {
  const available = listPublicImages('screenshots');
  const shots = shotsForSlug(slug, available);
  const mobile = options.mobile ?? false;
  const count = mobile ? MOBILE_COUNT : WEB_COUNT;
  const host = hostFrom(options.liveUrl ?? null);

  const screens: StudyScreen[] = Array.from({ length: count }, (_, index) => ({
    src: shots[index],
    url: mobile ? undefined : host,
  }));

  return {
    device: mobile ? 'android' : 'safari',
    screens,
  };
}

/**
 * Resolve Safari (2) or Android (3) screens for a project from case-study
 * kind / stack, live URL, and any files already under screenshots/.
 */
export function getStudyScreens(project: Project): StudyScreenSet {
  return getStudyScreensBySlug(project.slug, {
    mobile: isMobileProject(project),
    liveUrl: project.liveUrl,
  });
}
