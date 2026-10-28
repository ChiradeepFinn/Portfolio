/**
 * Introductions shared by the homepage previews and the world pages.
 *
 * Archive entries stay in the seed and the research catalog. This file is
 * only the doorway: label, headline, and the sentence that opens the room.
 */

export interface Headline {
  readonly before: string;
  readonly emphasis: string;
  readonly after: string;
}

export interface WorldCopy {
  readonly index: string;
  readonly label: string;
  readonly href: string;
  readonly anchor: string;
  readonly enter: string;
  readonly headline: Headline;
  readonly lead: string;
  readonly homeLead: string;
  readonly tags: readonly string[];
}

export const musicWorld = {
  index: '01',
  label: 'Music & Sound',
  href: '/music',
  anchor: '/music#releases',
  enter: 'Enter the listening room',
  headline: { before: 'Same ideas,', emphasis: 'different language.', after: '' },
  lead: 'I record at home, mostly at night. Original compositions, demos, and production experiments. A title appears here only when there is a recording to name.',
  homeLead:
    'Original compositions, demos, and production experiments. A track is named when there is a file to stand behind.',
  tags: ['Dream pop', 'Bedroom pop', 'Cinematic', 'Ambient'],
} as const satisfies WorldCopy;

export const booksWorld = {
  index: '02',
  label: 'Books & Published Writing',
  href: '/archive/books',
  anchor: '/archive/books#the-inward-silhouette',
  enter: 'Open the shelf',
  headline: { before: 'Published work,', emphasis: 'under its own title.', after: '' },
  lead: 'Writing that left the notebook. Edition details stay off this page until they come from the book.',
  homeLead: 'Writing that left the notebook.',
  tags: ['Published book'],
} as const satisfies WorldCopy;

export const researchWorld = {
  index: '03',
  label: 'Research & Experiments',
  href: '/archive/research',
  anchor: '/archive/research#investigations',
  enter: 'Read the investigations',
  headline: { before: 'Questions I would rather', emphasis: 'test than assume.', after: '' },
  lead: 'I explore questions at the intersection of machine learning and human creativity. My research investigates how models interpret musical emotion across different audio contexts, and how AI-assisted ideation influences the originality and ownership of human creative work.',
  homeLead: "Yea.. these are the ones I'm still chasing.",
  tags: ['Machine learning', 'Music emotion', 'Human-AI creativity'],
} as const satisfies WorldCopy;

export const photographyWorld = {
  index: '04',
  label: 'Photography & Visual Art',
  href: '/archive/photography',
  anchor: '/archive/photography#gallery',
  enter: 'View the photographs',
  headline: { before: 'Looking at ordinary things', emphasis: 'a little longer.', after: '' },
  lead: 'Photographs from the folder - ordinary light, held a little longer.',
  homeLead: 'A short look across the photographs, with artwork directly underneath.',
  tags: ['Photography', 'Artwork'],
} as const satisfies WorldCopy;

export const artworkWorld = {
  index: '04',
  label: 'Artwork',
  href: '/archive/artwork',
  anchor: '/archive/artwork#gallery',
  enter: 'Enter the gallery',
  headline: { before: 'Thinking out loud,', emphasis: 'in colour.', after: '' },
  lead: 'Canvas and texture, kept beside the photographs because they come from the same attention.',
  homeLead: 'Canvas and texture, beside the photographs.',
  tags: ['Canvas', 'Texture', 'Colour'],
} as const satisfies WorldCopy;

export const philosophyWorld = {
  index: '05',
  label: 'Philosophy & Reflections',
  href: '/philosophy',
  anchor: '/philosophy#subjects',
  enter: 'Enter the shelf',
  headline: { before: 'What is still mine', emphasis: 'when the model can answer?', after: '' },
  lead: 'Essays and observations on creativity, identity, consciousness, and the practice of making. The subjects below are the territory I want to write into. They are not finished essays, and they are not quotations.',
  homeLead:
    "Still circling these. Open questions I keep running into - originality, identity, what making is worth when the model can answer. Not essays. Just the shelf I'm still walking.",
  tags: [
    'Creativity and originality',
    'Human identity and technology',
    'Consciousness and meaning',
    'The creative process',
    'Questions from the work',
  ],
} as const satisfies WorldCopy;

export const philosophyThemes = [
  {
    title: 'Creativity and originality',
    line: 'What making is worth when the next suggestion is cheap.',
  },
  {
    title: 'Human identity and technology',
    line: 'Where a tool ends, and a person still has to begin.',
  },
  {
    title: 'Consciousness and meaning',
    line: 'What it is like to notice, and why the noticing matters.',
  },
  {
    title: 'The creative process',
    line: 'The middle of the work: drafts, takes, and frames that do not survive.',
  },
  {
    title: 'Questions from the work',
    line: 'What the technical practice keeps turning up, and will not settle.',
  },
] as const;

export const aboutWorld = {
  label: 'About',
  headline: { before: 'Different mediums.', emphasis: 'One mind.', after: '' },
} as const;

export const projectsWorld = {
  label: 'Selected work',
  anchor: '/projects#studies',
  enter: 'The studies',
  headline: { before: 'Five studies, then the site -', emphasis: 'by the mechanism.', after: '' },
  lead: 'Six entries on one spine. Sidequest opens; the portfolio closes as 01. Each block is the mechanism, the refusal, and the trade-off underneath.',
} as const;
