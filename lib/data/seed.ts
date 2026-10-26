import type {
  Artwork,
  Book,
  Certification,
  Photograph,
  Project,
  Track,
  WritingEntry,
} from '@/lib/types';

/**
 * Reconstruction seed.
 *
 * The original content was lost with the pendrive. Collections that were not
 * recovered stay flagged `isPlaceholder`. The five projects are the studies
 * in `project_plan.md`: the mechanism, the constraint, and the trade-off.
 * No usage numbers are invented. Each `liveUrl` is a placeholder to replace
 * with the real site. This module is also the source of truth for
 * `supabase/seed.sql`, and the fallback the site reads when Supabase
 * credentials are not configured.
 */

export const seedProjects: readonly Project[] = [
  {
    slug: 'sidequest',
    isPlaceholder: false,
    title: 'Sidequest',
    category: 'AI / Creative technology',
    year: '-',
    status: 'Study',
    role: '-',
    hook: 'One quest, sized to the time you have.',
    summary:
      'A quest system that builds one doable action from interests, time, and place, then remembers what you actually did so the next one is not a repeat.',
    description:
      'What if an assistant did not tell you what to watch next, but gave you something worth doing?',
    highlights: [
      'Quest fields are structured - time, place, difficulty, medium - and the model fills them. It does not write an essay.',
      'Personalization reads interests, context, and previous quests, so the next action is neither a repeat nor a leap you cannot make.',
      'Memory stores experiences: what you tried, what you avoided. It does not store a chat transcript.',
      'The loop is discover, do, complete, remember. The screen asks one question: what should I do now?',
    ],
    stack: ['React Native', 'Expo', 'TypeScript', 'React Native Web', 'Supabase', 'PostgreSQL', 'AI', 'Reanimated'],
    tone: 'rose',
    liveUrl: 'https://sidequest.chiradeep.me',
    repoUrl: 'https://github.com/ChiradeepFinn/sidequest',
    featured: true,
  },
  {
    slug: 'synesthesia',
    isPlaceholder: false,
    title: 'Synesthesia',
    category: 'AI / Generative art',
    year: '-',
    status: 'Study',
    role: '-',
    hook: 'Photo to music to language to image.',
    summary:
      'A creative system that reads atmosphere, rhythm, and structure in one medium and constructs another, then lets a second person challenge that reading.',
    description: 'A photograph becomes music. Music becomes language. Language becomes an image.',
    highlights: [
      'Image, audio, and text share one semantic layer. The output is an interpretation, not a file conversion.',
      'Chains keep history: photo to music to text to image, each step the input for the next.',
      'Interpretation battles give two people the same source and two competing readings.',
      'Generation runs after feature extraction, so meaning is structured before a new medium is made.',
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'AI', 'Generative media', 'Supabase'],
    tone: 'blue',
    liveUrl: 'https://synesthesia.chiradeep.me',
    repoUrl: 'https://github.com/ChiradeepFinn/synesthesia',
    featured: true,
  },
  {
    slug: 'framework',
    isPlaceholder: false,
    title: 'Framework',
    category: 'AI / Photography',
    year: '-',
    status: 'Study',
    role: '-',
    hook: 'Which five frames belong.',
    summary:
      'A photography workspace that clusters a shoot, ranks what remains against composition and your own keeps, then sequences the frames that belong together.',
    description:
      'The hardest part of photography is not taking five hundred photographs. It is knowing which five matter.',
    highlights: [
      'A shoot comes in as a set. Near-duplicates cluster. What remains is ranked for selection.',
      'Sharpness, subject, composition, and personal taste stay separate signals. Nothing collapses into one score.',
      'Sequence is a second pass, after the edit, so a gallery reads as a story.',
      'Every keep is a preference signal. The model learns your eye, not a generic photography grade.',
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'AI', 'Computer vision', 'Supabase'],
    tone: 'teal',
    liveUrl: 'https://framework.chiradeep.me',
    repoUrl: 'https://github.com/ChiradeepFinn/framework',
    featured: true,
  },
  {
    slug: 'path',
    isPlaceholder: false,
    title: 'Path',
    category: 'AI / Education',
    year: '-',
    status: 'Study',
    role: '-',
    hook: 'One next action, always named.',
    summary:
      'A learning system that turns a broad goal into a prerequisite graph, maps resources onto the nodes, and answers one question: what now?',
    description: 'The internet has infinite learning resources. The problem is knowing what to learn next.',
    highlights: [
      'A goal becomes a graph of concepts and dependencies, not a syllabus and not a list of search results.',
      'A node stays closed until its prerequisites are done, so the path cannot skip the foundation.',
      'Courses, docs, books, and exercises attach to a node. They do not replace the path.',
      'What now reads the goal, the completed nodes, and the current project, and returns one next action.',
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'AI', 'Graph data', 'Supabase'],
    tone: 'blue',
    liveUrl: 'https://path.chiradeep.me',
    repoUrl: 'https://github.com/ChiradeepFinn/path',
    featured: true,
  },
  {
    slug: 'stem',
    isPlaceholder: false,
    title: 'STEM',
    category: 'Music technology',
    year: '-',
    status: 'Study',
    role: '-',
    hook: 'Every version, and why it changed.',
    summary:
      'A workspace for the passes of a song - demos, vocals, mixes - with the reason each one changed kept on the version where it happened.',
    description: 'Songs are not created in one file. They are created through hundreds of decisions.',
    highlights: [
      'Versions stay in order, from the first demo to the current mix. Nothing is overwritten to save a filename.',
      'Vocals, instrumentals, mixes, references, and notes live on the song, not in a folder.',
      'A creative decision stays attached to the version where it was made.',
      'Analysis can compare takes and flag repeated patterns. It does not produce the track.',
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Web Audio', 'Supabase', 'AI'],
    tone: 'rose',
    liveUrl: 'https://stem.chiradeep.me',
    repoUrl: 'https://github.com/ChiradeepFinn/stem',
    featured: true,
  },
];

export const seedTracks: readonly Track[] = [
  {
    slug: 'track-slot-01',
    isPlaceholder: true,
    title: 'Featured track',
    mood: '-',
    duration: '-:-',
    year: '-',
    note: 'The homepage listening slot. One track, one atmosphere, one door into the music page.',
    listenUrl: null,
    featured: true,
  },
  {
    slug: 'track-slot-02',
    isPlaceholder: true,
    title: 'Second track',
    mood: '-',
    duration: '-:-',
    year: '-',
    note: 'Reserved for a release.',
    listenUrl: null,
    featured: false,
  },
  {
    slug: 'track-slot-03',
    isPlaceholder: true,
    title: 'Third track',
    mood: '-',
    duration: '-:-',
    year: '-',
    note: 'Reserved for a release.',
    listenUrl: null,
    featured: false,
  },
];

/**
 * The Inward Silhouette is the title supplied for this portfolio.
 * The jacket is on file. Synopsis, year, and publisher are still absent.
 * A second published book is an older site fact; its title was never recovered.
 */
export const seedBooks: readonly Book[] = [
  {
    slug: 'book-one',
    isPlaceholder: false,
    index: '01',
    title: 'The Inward Silhouette',
    subtitle: '',
    synopsis:
      'A published book. The synopsis and the edition details are not in the site record, so they stay off this page.',
    excerpt: '',
    year: null,
    publisher: null,
  },
  {
    slug: 'book-two',
    isPlaceholder: true,
    index: '02',
    title: 'Second published book',
    subtitle: 'Title to be added',
    synopsis:
      'A second published book is part of the record. Its title, cover, and edition details are not, so they stay blank.',
    excerpt: '',
    year: null,
    publisher: null,
  },
];

export const seedArtworks: readonly Artwork[] = [
  { slug: 'artwork-01', isPlaceholder: true, title: 'Untitled', medium: '-', year: '-', size: 'tall', featured: true },
  { slug: 'artwork-02', isPlaceholder: true, title: 'Untitled', medium: '-', year: '-', size: 'square', featured: true },
  { slug: 'artwork-03', isPlaceholder: true, title: 'Untitled', medium: '-', year: '-', size: 'wide', featured: true },
  { slug: 'artwork-04', isPlaceholder: true, title: 'Untitled', medium: '-', year: '-', size: 'square', featured: false },
  { slug: 'artwork-05', isPlaceholder: true, title: 'Untitled', medium: '-', year: '-', size: 'tall', featured: false },
  { slug: 'artwork-06', isPlaceholder: true, title: 'Untitled', medium: '-', year: '-', size: 'wide', featured: false },
  { slug: 'artwork-07', isPlaceholder: true, title: 'Untitled', medium: '-', year: '-', size: 'square', featured: false },
  { slug: 'artwork-08', isPlaceholder: true, title: 'Untitled', medium: '-', year: '-', size: 'tall', featured: false },
];

export const seedPhotographs: readonly Photograph[] = [
  {
    slug: 'photo-01',
    isPlaceholder: true,
    title: 'Untitled frame',
    place: '-',
    captured: '-',
    camera: null,
    size: 'wide',
    featured: true,
  },
  {
    slug: 'photo-02',
    isPlaceholder: true,
    title: 'Untitled frame',
    place: '-',
    captured: '-',
    camera: null,
    size: 'tall',
    featured: true,
  },
  {
    slug: 'photo-03',
    isPlaceholder: true,
    title: 'Untitled frame',
    place: '-',
    captured: '-',
    camera: null,
    size: 'square',
    featured: true,
  },
  {
    slug: 'photo-04',
    isPlaceholder: true,
    title: 'Untitled frame',
    place: '-',
    captured: '-',
    camera: null,
    size: 'tall',
    featured: true,
  },
  {
    slug: 'photo-05',
    isPlaceholder: true,
    title: 'Untitled frame',
    place: '-',
    captured: '-',
    camera: null,
    size: 'wide',
    featured: false,
  },
  {
    slug: 'photo-06',
    isPlaceholder: true,
    title: 'Untitled frame',
    place: '-',
    captured: '-',
    camera: null,
    size: 'square',
    featured: false,
  },
];

/**
 * Research papers are authored in lib/data/research.ts. Re-exported here so the
 * seed fallback stays on the same titles, questions, and statuses as the archive.
 */
export { researchPaperSeed as seedResearch } from '@/lib/data/research';

export const seedWriting: readonly WritingEntry[] = [
  {
    slug: 'writing-slot-01',
    isPlaceholder: true,
    title: 'Things I cannot stop thinking about',
    category: 'Essay',
    excerpt:
      'A single thought belongs here - the one worth more than a caption. Held open until there is a real passage to put in it, because a borrowed thought would defeat the point of the section.',
    published: null,
    featured: true,
  },
];

export const seedCertifications: readonly Certification[] = [
  {
    slug: 'certification-01',
    isPlaceholder: true,
    title: 'Certification',
    issuer: '-',
    year: '-',
    note: 'Reserved slot. Certificates go here once the issuer and date are confirmed.',
    verifyUrl: null,
  },
  {
    slug: 'certification-02',
    isPlaceholder: true,
    title: 'Certification',
    issuer: '-',
    year: '-',
    note: 'Reserved slot.',
    verifyUrl: null,
  },
  {
    slug: 'certification-03',
    isPlaceholder: true,
    title: 'Certification',
    issuer: '-',
    year: '-',
    note: 'Reserved slot.',
    verifyUrl: null,
  },
];

export { seedTimeline } from '@/lib/data/timeline';
