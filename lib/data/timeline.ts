import type { TimelineItem } from '@/lib/types';
import { media } from '@/lib/media';

/**
 * Authored life story for /timeline.
 *
 * Years and events below are the ones supplied for this page. Nothing else
 * is dated. The second book's title is unknown, so it is not named. Research
 * is named as work in progress, not as publication. STEM is a beginning.
 *
 * Compact rows for the about page and `supabase/seed.sql` are derived at the
 * bottom. The timeline page reads `timelineChapters` so a reserved database
 * row cannot replace the story.
 */

export type TimelinePhase = 'past' | 'present' | 'future';

export interface TimelineLink {
  readonly href: string;
  readonly label: string;
}

export interface TimelineFigure {
  readonly src: string;
  readonly alt: string;
  readonly caption: string;
  readonly detail: string;
  /** CSS aspect-ratio, matching the file so the frame does not crop it. */
  readonly aspect: string;
  readonly fit: 'contain' | 'cover';
}

export interface TimelineChapter {
  readonly slug: string;
  readonly phase: TimelinePhase;
  /** Shown as the date. Not always a calendar year. */
  readonly label: string;
  /** Machine date when the label is a real month or year. */
  readonly dateTime?: string;
  readonly title: string;
  readonly subtitle: string;
  readonly paragraphs: readonly string[];
  readonly links: readonly TimelineLink[];
  readonly figure?: TimelineFigure;
  /** One line for compact surfaces. */
  readonly summary: string;
}

export const timelineChapters: readonly TimelineChapter[] = [
  {
    slug: 'before-the-beginning',
    phase: 'past',
    label: 'Before the beginning',
    title: 'The chapter that changed everything',
    subtitle: 'What could I make of my life?',
    paragraphs: [
      'There was a time when life looked very different from the future I imagined. A major change in my family brought my mother, my younger brother, and me to my maternal grandparents’ home.',
      'It was a difficult transition, but somewhere in that period, I began asking myself a different question: What could I make of my life?',
      'I didn’t have an answer. I only knew that I wanted to discover one.',
    ],
    links: [],
    summary: 'A family change raised a different question: what I could make of my life.',
  },
  {
    slug: '2020',
    phase: 'past',
    label: '2020',
    dateTime: '2020',
    title: 'The first spark',
    subtitle: 'Curiosity became my own world.',
    paragraphs: [
      'When the world slowed down during the pandemic, I found myself exploring it in a different way. I spent time researching, following questions, and discovering subjects I had never thought deeply about before.',
      'This was also the year I began coding. I was only at the beginning, but the idea that I could use technology to build something of my own stayed with me.',
      'I didn’t know where that curiosity would lead. I kept following it.',
    ],
    links: [],
    summary: 'Curiosity, research, and the year coding began.',
  },
  {
    slug: '2023',
    phase: 'past',
    label: '2023',
    dateTime: '2023',
    title: 'A new language',
    subtitle: 'Learning to create through sound.',
    paragraphs: [
      'Music opened another door. I began exploring music production, discovering how sounds, melodies, and ideas could become something people could feel.',
      'Technology gave me a way to build. Music gave me another way to express.',
      'I started to understand that I didn’t have to choose just one way to create.',
    ],
    links: [{ href: '/music', label: 'Music' }],
    summary: 'Music production opened another way to create.',
  },
  {
    slug: '2024',
    phase: 'past',
    label: '2024',
    dateTime: '2024',
    title: 'Words, ideas, and first builds',
    subtitle: 'Turning thoughts into something real.',
    paragraphs: [
      'I began writing seriously, giving my thoughts another place to exist beyond my own mind.',
      'This was also the year I started STEM, my first major project. I was beginning to move from imagining possibilities to thinking about how they could become real.',
      'Writing taught me to explore ideas. Building taught me to give them form.',
      'Neither journey was finished. Both had begun.',
    ],
    links: [
      { href: '/archive/books', label: 'Books' },
      { href: '/projects/stem', label: 'STEM' },
      { href: '/projects', label: 'Projects' },
    ],
    summary: 'Writing began, and so did STEM. Neither was finished.',
  },
  {
    slug: 'october-2026',
    phase: 'past',
    label: 'October 2026',
    dateTime: '2026-10',
    title: 'The work becomes visible',
    subtitle: 'From private curiosity to public work.',
    paragraphs: [
      'My writing journey reached another milestone with the publication of my second book.',
      'At the same time, I was developing my portfolio, exploring new product ideas, and beginning research into music emotion recognition and AI-assisted creativity.',
      'The interests that once lived in separate corners of my life were starting to connect: technology, music, writing, research, and visual art.',
      'I was no longer just collecting interests. I was learning how to build a body of work around them.',
    ],
    links: [
      { href: '/archive/books', label: 'Books' },
      { href: '/archive/research', label: 'Research' },
      { href: '/projects', label: 'Projects' },
    ],
    figure: {
      src: '/images/The Inward Silhouette.webp',
      alt: 'Cover of The Inward Silhouette, an illustrated profile looking upward beside a faint second silhouette.',
      caption: 'The Inward Silhouette',
      detail: 'A published book on the shelf. The October 2026 book is not named here.',
      aspect: '934 / 1411',
      fit: 'contain',
    },
    summary:
      'A second book was published. The portfolio and the research were underway, not finished papers.',
  },
  {
    slug: 'now',
    phase: 'present',
    label: 'Now',
    title: 'Still becoming',
    subtitle: 'There is more to discover.',
    paragraphs: [
      'I’m continuing to build, write, experiment, and ask better questions. I’m working toward a future in Computer Science and AI, while keeping creativity at the center of what I do.',
      'I don’t see this journey as a finished story or a race toward a perfect version of myself.',
      'I see it as the beginning of a life spent learning, creating, and making things that matter.',
    ],
    links: [],
    figure: {
      src: media.images.profile,
      alt: 'Portrait of Chiradeep.',
      caption: 'Chiradeep',
      detail: 'A recent portrait.',
      aspect: '1 / 1',
      fit: 'cover',
    },
    summary: 'Still building, writing, and working toward computer science and AI.',
  },
  {
    slug: 'the-future',
    phase: 'future',
    label: 'The future',
    title: 'The unwritten chapter',
    subtitle: 'The future is still mine to build.',
    paragraphs: [
      'I want to explore the boundaries between technology and creativity, develop ideas into meaningful products, pursue research, and continue telling stories through different mediums.',
      'The destination may change. The curiosity stays.',
    ],
    links: [],
    summary: 'Ambitions for technology, products, research, and stories. Not accomplishments.',
  },
];

export const timelineClosing = {
  lead: 'This is not the end of the story.',
  rest: 'It’s the part I’m writing now.',
} as const;

export const seedTimeline: readonly TimelineItem[] = timelineChapters.map((chapter) => ({
  slug: chapter.slug,
  isPlaceholder: false,
  year: chapter.label,
  title: chapter.title,
  note: chapter.summary,
}));
