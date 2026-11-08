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
  anchor: '/music#working-order',
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
  lead: 'Writing that left the notebook. Titles appear here with the edition details that belong to them — publisher, place, and year when those facts are on record.',
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
  lead: 'I explore questions at the intersection of machine learning and human creativity. My research investigates how models interpret musical emotion across different audio contexts, and how writers’ self-assessments of AI-assisted creative work align with independent evaluations.',
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
  lead: 'Photographs from the folder — ordinary light, held a little longer. A quiet gallery of frames kept for how they look, not for a caption story.',
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
  lead: 'Canvas and texture, kept beside the photographs because they come from the same attention — colour studies and painted surfaces from that looking practice.',
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
    detail:
      'When a model can propose the next line, chord, or layout in seconds, originality stops being about access to ideas. It becomes about judgment: what you keep, what you refuse, and whether the finished thing still carries a point of view someone can recognize as yours.',
  },
  {
    title: 'Human identity and technology',
    line: 'Where a tool ends, and a person still has to begin.',
    detail:
      'Tools reshape the room you work in. They do not remove the need to decide what the work is for. The interesting edge is not human versus machine; it is where assistance stops and authorship, taste, and responsibility still have to start.',
  },
  {
    title: 'Consciousness and meaning',
    line: 'What it is like to notice, and why the noticing matters.',
    detail:
      'A lot of technical talk skips the quiet part: attending to a feeling, a sound, a frame, a sentence until it becomes clear. Meaning, here, is less a grand theory and more the practice of staying with something long enough that it changes how you see.',
  },
  {
    title: 'The creative process',
    line: 'The middle of the work: drafts, takes, and frames that do not survive.',
    detail:
      'Most of the shelf is unfinished on purpose. The middle is where the real craft lives: versions that almost work, recordings that almost hold, pages that teach you what the piece is not. Process is not a mood board. It is the record of decisions under constraint.',
  },
  {
    title: 'Questions from the work',
    line: 'What the technical practice keeps turning up, and will not settle.',
    detail:
      'Building interfaces, training instincts with models, and making music or images keep raising the same stubborn questions. They do not always want essays. Sometimes they want a better experiment, a clearer refusal, or another afternoon in the studio.',
  },
] as const;

/**
 * FAQ for /philosophy. Answers stay aligned with published site voice and
 * avoid invented biography. Items marked needsOwnerInput should be reviewed
 * before treating them as personal doctrine.
 */
export const philosophyFaq = [
  {
    question: 'Does cheap generation make creativity pointless?',
    answer:
      'No. It makes taste and commitment more visible. If anyone can summon a draft, the work that matters is still the one where someone chose, revised, and stood behind the result.',
    needsOwnerInput: false,
  },
  {
    question: 'Where do you draw the line between tool and author?',
    answer:
      'A tool proposes. An author is accountable for what ships. The line moves with the medium, but the responsibility does not: if it is under your name, you own the judgment that kept it.',
    needsOwnerInput: false,
  },
  {
    question: 'How do you keep learning when the stack changes every year?',
    answer:
      'By treating new tools as materials, not identities. Learn enough to make something real, then return to the slower skills that transfer: listening, structure, restraint, and clear questions.',
    needsOwnerInput: false,
  },
  {
    question: 'What do you do with failure in creative or technical work?',
    answer:
      'Treat it as information, not a verdict. A failed take or a broken build often shows the constraint you were avoiding. Keep the lesson; discard the drama.',
    needsOwnerInput: false,
  },
  {
    question: 'How ambitious should the work be when attention is scarce?',
    answer:
      'Ambitious enough to stretch the craft, small enough to finish. Ambition without a shippable edge becomes decoration. A finished modest piece teaches more than an endless grand plan.',
    needsOwnerInput: false,
  },
  {
    question: 'How do you balance music, code, writing, and images without splitting into five careers?',
    answer:
      'By treating them as one practice with different rooms. The same habits travel: notice carefully, edit hard, leave evidence. The portfolio is the filing system so the rooms stay connected.',
    needsOwnerInput: false,
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
