export interface StackGroup {
  readonly label: string;
  readonly items: readonly string[];
  readonly note?: string;
}

export interface CodePanel {
  readonly file: string;
  readonly code: string;
}

export interface CaseFeature {
  /** Left-column label, the way a case study names a section. */
  readonly label: string;
  readonly body: readonly string[];
  readonly code?: CodePanel;
  readonly diagram?: string;
}

export interface Tradeoff {
  readonly decision: string;
  readonly choice: string;
  readonly why: string;
}

export interface CaseFaq {
  readonly question: string;
  readonly answer: string;
}

export interface CaseStudyContent {
  readonly kind: string;
  readonly pitch: string;
  /** Left-column name for the opening. Different on every study. */
  readonly problemLabel: string;
  readonly problem: readonly string[];
  /** Short lines set apart from the paragraphs, when the opening needs them. */
  readonly problemLines?: readonly string[];
  readonly features: readonly CaseFeature[];
  readonly stackLabel: string;
  readonly stackIntro: string;
  readonly stackLayout: 'reasons' | 'pipeline' | 'split';
  readonly stack: readonly StackGroup[];
  readonly hard: {
    readonly title: string;
    readonly problem: string;
    readonly solution: string;
  };
  readonly tradeoffs: readonly Tradeoff[];
  readonly changes: readonly string[];
  readonly faqLabel: string;
  readonly faq: readonly CaseFaq[];
}

const studies: Record<string, CaseStudyContent> = {
  sidequest: {
    kind: 'Cross-platform',
    pitch: 'What if an assistant didn’t tell you what to consume next, but gave you something worth doing?',
    problemLabel: 'Another thing to watch',
    problemLines: ['Another video.', 'Another song.', 'Another post.', 'Another article.'],
    problem: [
      'Recommendation systems are built to keep a session going. Sidequest refuses that job. The question on the screen is what to do once the phone is down.',
      'A vague wish to make something becomes one action with a time, a place, and the materials it needs. The page stays thin so it cannot become the afternoon.',
    ],
    features: [
      {
        label: 'A quest is an object',
        body: [
          'A Sidequest is not an AI paragraph. It is a structured experience: an activity, a category, a difficulty, a time, the materials it needs, and a creative objective.',
          'The quest engine decides what is valid. The model only fills variation inside that shape. An open prompt can sound like a plan. A quest can be done today.',
        ],
        code: {
          file: 'lib/quest-engine/quest.ts',
          code: `type Quest = {
  activity: string
  category: string
  difficulty: 'easy' | 'medium' | 'stretch'
  minutes: number
  materials: string[]
  environment: string
  objective: string
}

// The engine rejects a quest before it is shown.
// The model never gets to invent the shape.`,
        },
      },
      {
        label: 'Memory of what you did',
        body: [
          'Memory is not a chat log and it is not a journal. It records experiences: what was tried, what was discovered, what was avoided.',
          'That record is the only thing the next quest is allowed to learn from. Street photography can become a night walk. A long indoor task can stay off the list.',
        ],
        diagram: `Tried              Street photography
Discovered         Shadows and architecture
Skill              Manual exposure
Avoided            Long indoor activities
Next               A night photography quest`,
      },
      {
        label: 'One question on screen',
        body: [
          'The loop is short: discover, accept, do, complete, remember, return. The screen asks one question. What should I do now?',
          'Navigation stays at Today, a central New Quest, and Progress. Explore, Memory, Groups, and Profile sit behind that, not in front of it.',
        ],
        diagram: `Discover → Accept → Do → Complete → Remember → Return`,
      },
    ],
    stackLabel: 'Built to leave the screen',
    stackIntro:
      'One codebase ships as a native app and as a site, because a quest is accepted on a phone and read later in a browser. What is unusual is the split: the quest engine decides what is allowed, and the model only writes inside that shape.',
    stackLayout: 'reasons',
    stack: [
      {
        label: 'The screen',
        items: ['Expo', 'React Native', 'React Native Web', 'TypeScript', 'Expo Router', 'Reanimated'],
        note: 'Native on the phone, the same three places to go in a browser. Motion is for the quest arriving, not for a dashboard.',
      },
      {
        label: 'What you did',
        items: ['Supabase', 'PostgreSQL', 'Row Level Security', 'Storage'],
        note: 'Experiences, not a chat log. Street photography tried. Long indoor tasks avoided.',
      },
      {
        label: 'The quest, not the paragraph',
        items: ['OpenAI', 'Structured generation', 'Quest validation'],
        note: 'A response is dropped if it has no activity, no time, or no way to start it today.',
      },
      {
        label: 'After you finish',
        items: ['Resend', 'Vercel'],
        note: 'A note when a quest is waiting. The app itself is not the reminder to stay.',
      },
    ],
    hard: {
      title: 'A generated quest still has to be worth doing',
      problem:
        'The hard part was never calling a model. It was deciding whether the quest was actually worth doing: actionable, safe, varied, and fitted to the time and place a person has.',
      solution:
        'Generation, validation, personalization, and presentation stay separate. The engine sets the constraints. The model varies the quest inside them. A response is not shown until it passes.',
    },
    tradeoffs: [
      { decision: 'Content', choice: 'Structured quest data', why: 'More predictable than a free-form reply.' },
      { decision: 'Navigation', choice: 'Three primary items', why: 'The action matters more than a dashboard.' },
      { decision: 'Progress', choice: 'Quests, skills, categories', why: 'Activity, not points.' },
      { decision: 'Memory', choice: 'Experiences', why: 'So this does not become a journal.' },
      { decision: 'Interface', choice: 'One build, phone and browser', why: 'The product is used while moving, and reviewed later at a desk.' },
    ],
    changes: [
      'Stronger sense of where the person actually is.',
      'Richer offline behavior, for a day with no signal.',
      'Better difficulty calibration.',
      'Deeper group quests, and chains that last more than one day.',
    ],
    faqLabel: 'What people assume',
    faq: [
      {
        question: 'So this is a productivity app?',
        answer:
          'It has a next action, and that is where the resemblance ends. A quest is something to try - a night walk, a roll of film, a drawing with the materials already in the room - not a task to clear.',
      },
      {
        question: 'Does the model just invent the afternoon?',
        answer:
          'It fills a shape the engine already accepts: activity, difficulty, minutes, materials, environment, objective. An open prompt can sound like a plan. A quest can be started.',
      },
      {
        question: 'Will it ask how I feel?',
        answer:
          'It asks what you tried, what you found, and what you want to avoid next time. Mood is not a field. This is not a therapy product.',
      },
    ],
  },
  synesthesia: {
    kind: 'Web app',
    pitch: 'What if a photograph could become a song, and that song could become a story?',
    problemLabel: 'One medium per app',
    problemLines: ['Photographers get image tools.', 'Musicians get audio tools.', 'Writers get a page.'],
    problem: [
      'Each of those tools is good at its own file. None of them can hold what the file is doing - the pace, the color, the pressure - and rebuild it as something else.',
      'Synesthesia is the translator in the gap. A photograph is read, then heard. The distance between the two is the piece.',
    ],
    features: [
      {
        label: 'Meaning, then a medium',
        body: [
          'A source is read for atmosphere, rhythm, color, composition, intensity, and structure. Those qualities are reconstructed in another medium.',
          'The intermediate layer is the product. Without it, a photograph would only be stretched into a waveform.',
        ],
        code: {
          file: 'lib/transform/reading.ts',
          code: `type Reading = {
  atmosphere: string
  rhythm: string
  color: string
  structure: string
  intensity: number
}

type Transformation = {
  sourceId: string
  target: 'image' | 'audio' | 'text'
  reading: Reading
  outputId: string
}`,
        },
      },
      {
        label: 'Chains keep the lineage',
        body: [
          'One output can become the next input: photo, music, text, image, music again. Each step is a new interpretation, and the history stays attached to the artifact.',
        ],
        diagram: `Photo → Music → Text → Image → Music`,
      },
      {
        label: 'Two readings, one source',
        body: [
          'Two people receive the same source and make competing interpretations. The comparison is part of the work, not a scoreboard beside it.',
        ],
        diagram: `Original
   ├── Person A → Interpretation A
   └── Person B → Interpretation B
            └── Comparison`,
      },
    ],
    stackLabel: 'Open in one tab',
    stackIntro:
      'This one lives in a browser because the work does: a photograph dragged in, a paragraph pasted, a song playing back without an install. The stack follows that order.',
    stackLayout: 'pipeline',
    stack: [
      {
        label: 'Open the piece',
        items: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS', 'Motion'],
        note: 'One source on screen. The next medium arrives as a step, not a new page.',
      },
      {
        label: 'Keep the lineage',
        items: ['Supabase', 'PostgreSQL', 'Storage'],
        note: 'Photo, music, and text stay attached. A chain is a record, not a folder of exports.',
      },
      {
        label: 'Read, then rebuild',
        items: ['OpenAI'],
        note: 'Atmosphere, rhythm, color, structure, intensity. The model writes a reading before it writes a song.',
      },
      {
        label: 'Hear it',
        items: ['Web Audio'],
        note: 'If the translation is a song, it has to play on the same screen as the photograph it came from.',
      },
    ],
    hard: {
      title: 'There is no shared file format for a feeling',
      problem:
        'Image, sound, and language do not share a file format that preserves atmosphere. A direct conversion throws the meaning away and keeps the container.',
      solution:
        'The pipeline is media, then a semantic reading, then generation in the target medium. The reading is stored with the output, so a later step can argue with it.',
    },
    tradeoffs: [
      { decision: 'Fidelity', choice: 'A visible reading', why: 'A perfect translation can be dull. The distance should be seeable.' },
      { decision: 'Control', choice: 'Some surprise', why: 'Too much control removes the interpretation.' },
      { decision: 'Repeatability', choice: 'The same source can return', why: 'And it can also surprise.' },
    ],
    changes: [
      'Longer chains, and rooms where more than one person works the same source.',
      'A control for how far the interpretation may travel.',
      'More than one model on the same reading, so the difference is the point.',
    ],
    faqLabel: 'About the translation',
    faq: [
      {
        question: 'Can I drop in a JPEG and get a WAV?',
        answer:
          'You can start from a photograph and end with a song. What happens in between is a reading - atmosphere, rhythm, color - and the song is built from that, not from the pixels stretched into a waveform.',
      },
      {
        question: 'How long can a chain go?',
        answer:
          'Photo, then music, then text, then another image. Each step is a new interpretation, and the earlier ones stay attached so you can see where the piece drifted.',
      },
      {
        question: 'What happens when two people start from the same photograph?',
        answer:
          'They get two readings and two outputs. The comparison is the work: same source, different ear. There is no winner.',
      },
    ],
  },
  framework: {
    kind: 'Web app',
    pitch: 'The difficult part of photography isn’t taking 500 photographs. It’s knowing which five matter.',
    problemLabel: 'The card is full',
    problemLines: ['Duplicates.', 'Soft frames.', 'The same moment, three ways.', 'Two different pictures in one folder.'],
    problem: [
      'Taking the photograph got cheap. Deciding which one belongs in the edit did not. Framework starts when the card comes out of the camera.',
      'It clusters, then ranks, then waits. A sharp frame is a fact. Whether it is the frame is the photographer’s call, and the software is not allowed to collapse those into one number.',
    ],
    features: [
      {
        label: 'Signals stay separate',
        body: [
          'Technical quality, visual structure, and what the picture is of are different questions. Sharpness, exposure, composition, color, people, architecture. None of them is allowed to collapse into one quality score.',
        ],
        code: {
          file: 'lib/vision/signals.ts',
          code: `type FrameSignals = {
  technical: {
    sharpness: number
    exposure: number
    blur: number
  }
  visual: {
    composition: string
    color: string
    contrast: string
  }
  subject: string[]
}

// No single score. A recommendation is a set of reasons.`,
        },
      },
      {
        label: 'The keep is the training signal',
        body: [
          'A generic model can prefer the sharper frame. The photographer may keep the other one. That choice is the data.',
          'Recommendation, decision, preference, a more personal next recommendation. Explanations stay attached, so the model is not pretending the choice was objective.',
        ],
        diagram: `Recommendation
    ↓
Photographer keeps or rejects
    ↓
Preference signal
    ↓
A more personal next pass`,
      },
      {
        label: 'Sequence after the edit',
        body: [
          'Ranking is not a story. After the shortlist, frames are arranged for continuity, color, subject, and pace. The contact sheet, the reject pile, and the comparison view exist so that sequence has something real to follow.',
        ],
      },
    ],
    stackLabel: 'From the card to the sequence',
    stackIntro:
      'The tools are arranged the way an edit actually moves: get the files in, see them as signals, remember which ones were kept, then lay out the short story.',
    stackLayout: 'reasons',
    stack: [
      {
        label: 'Ingest',
        items: ['Sharp', 'Supabase Storage'],
        note: 'Hundreds of frames, including the near-duplicates. Previews are made so the contact sheet can be scrolled, not downloaded one by one.',
      },
      {
        label: 'See, without a grade',
        items: ['Computer vision pipeline', 'OpenAI'],
        note: 'Sharpness, exposure, blur, composition, color, subject. Each stays its own column. Nothing is averaged into “quality.”',
      },
      {
        label: 'The keep',
        items: ['PostgreSQL', 'Supabase'],
        note: 'What was recommended, what was kept, what was rejected. The keep is the only taste the next pass is allowed to learn.',
      },
      {
        label: 'The sequence',
        items: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS', 'Vercel'],
        note: 'Contact sheet, reject pile, comparison, then the order. Ranking ends before the story starts.',
      },
    ],
    hard: {
      title: 'Taste is not a score',
      problem:
        'The hard question was whether software can learn a photographer’s eye without announcing that the eye is objective. A technically imperfect frame is often the one that matters.',
      solution:
        'Recommendations are decision support. Signals stay separate. The keep, not a generic grade, is what the model is allowed to learn.',
    },
    tradeoffs: [
      { decision: 'Quality', choice: 'Several signals', why: 'Technical quality and artistic value are not the same fact.' },
      { decision: 'Taste', choice: 'Learn from keeps', why: 'A universal photography score is someone else’s eye.' },
      { decision: 'Volume', choice: 'Cluster, then rank', why: 'Hundreds of frames start as groups, not a single sort.' },
      { decision: 'Story', choice: 'Sequence after selection', why: 'A gallery is not a leaderboard.' },
    ],
    changes: [
      'A RAW-native path, and a way through Lightroom.',
      'Stronger personal embeddings.',
      'Collaborative curation, and publishing a sequence as a gallery.',
    ],
    faqLabel: 'In the edit',
    faq: [
      {
        question: 'Why isn’t there a score out of ten?',
        answer:
          'A technically clean frame and the frame you would print are often different pictures. Sharpness, subject, and composition stay listed beside each other. The recommendation is those reasons, written out.',
      },
      {
        question: 'Does it sequence the whole card?',
        answer:
          'Only after the cut. Continuity, color, and pace are arranged from the frames that were kept. A contact sheet of five hundred is not a story.',
      },
      {
        question: 'Whose eye is it learning?',
        answer:
          'Yours. If the model prefers the sharper frame and you keep the other one, that choice is the training signal. A universal “good photograph” is someone else’s taste.',
      },
    ],
  },
  path: {
    kind: 'Web app',
    pitch: 'The internet doesn’t have a shortage of learning resources. It has a shortage of direction.',
    problemLabel: 'How do I learn this?',
    problemLines: ['Courses.', 'Videos.', 'Books.', 'Roadmaps.', 'Bootcamps.'],
    problem: [
      'Search “how do I learn machine learning” and the page answers a different question: what exists. Path answers the one underneath it.',
      'Given what is already known, one node is open. The rest stay shut until the prerequisites are real. Python and the mathematics both have to be done before that node unlocks.',
    ],
    features: [
      {
        label: 'A graph, not a playlist',
        body: [
          'A course is a list. Path is a graph of concepts, prerequisites, skills, and projects. A node stays closed until the ones under it are done.',
          'Python sits beside mathematics. Both have to be real before machine learning opens.',
        ],
        code: {
          file: 'lib/graph/node.ts',
          code: `type LearningNode = {
  id: string
  title: string
  type: 'concept' | 'skill' | 'project'
  difficulty: number
  prerequisites: string[]
  resources: string[]
}

// A node with an open prerequisite cannot be the next step.`,
        },
      },
      {
        label: 'What now',
        body: [
          'The engine reads the goal, what is already known, completed nodes, prerequisites, the project in progress, and recent work. It returns one action.',
          'Not “study algorithms.” Implement binary search from scratch and test it against five edge cases.',
        ],
        diagram: `Goal
  ↓
Graph
  ↓
Prerequisites
  ↓
Progress
  ↓
One next action`,
      },
      {
        label: 'Resources stay on the node',
        body: [
          'A course, a book, a paper, an exercise, and a project can all hang on the same concept. They support the node. They are not allowed to become the path.',
        ],
      },
    ],
    stackLabel: 'A graph, and one verb',
    stackIntro:
      'Two jobs, kept apart. One side remembers the map and what is already finished. The other side is only allowed to name the next action.',
    stackLayout: 'split',
    stack: [
      {
        label: 'The map',
        items: ['PostgreSQL', 'Supabase'],
        note: 'Concepts, skills, projects, and the prerequisites between them. A node with an open prerequisite cannot be offered as next.',
      },
      {
        label: 'The verb',
        items: ['OpenAI'],
        note: 'Reads the goal, the finished nodes, and the project in progress. Returns one action: implement binary search and test five edge cases. Not “study algorithms.”',
      },
      {
        label: 'The page',
        items: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS', 'Vercel'],
        note: 'The graph is visible. The sentence at the top is the only thing that asks to be done today.',
      },
      {
        label: 'On the node, not the path',
        items: ['Courses', 'Books', 'Papers', 'Exercises'],
        note: 'Materials hang off a concept. They help you cross it. They are not allowed to become the path.',
      },
    ],
    hard: {
      title: 'Structure without becoming a syllabus',
      problem:
        'Too much structure is another rigid curriculum. Too little is another search engine. Either failure answers a question the learner did not ask.',
      solution:
        'Prerequisites are strict. The resource used to cross a node is not. What now returns one action, chosen from the graph, not a pile of links.',
    },
    tradeoffs: [
      { decision: 'Shape', choice: 'A prerequisite graph', why: 'A playlist hides what is missing.' },
      { decision: 'Next step', choice: 'One action', why: 'Forty-seven courses is not a decision.' },
      { decision: 'Materials', choice: 'Attached to a node', why: 'The resource must not replace the path.' },
    ],
    changes: [
      'A way to verify a skill, not only to mark a node done.',
      'Project evaluation, and stronger inference of prerequisites.',
      'Adaptation that still makes sense after months, not only after a week.',
    ],
    faqLabel: 'What now, exactly',
    faq: [
      {
        question: 'I already have a roadmap. What is different?',
        answer:
          'A roadmap is a list you can skip around. Here a node stays closed until the ones under it are done. Machine learning does not open because you bookmarked it.',
      },
      {
        question: 'What do I actually get when I ask what now?',
        answer:
          'One sentence you can start. “Implement binary search from scratch and test it against five edge cases.” If the answer is a pile of courses, the engine failed.',
      },
      {
        question: 'Where did all the courses go?',
        answer:
          'Onto the node they belong to, next to the book, the paper, and the exercise. You pick one to cross the concept. None of them is the path.',
      },
    ],
  },
  stem: {
    kind: 'Music app',
    pitch: 'Songs aren’t created in one file. They’re created through hundreds of decisions.',
    problemLabel: 'Seven files, no reason',
    problemLines: ['demo.wav', 'demo2.wav', 'new chorus.wav', 'final.wav', 'final-final.wav', 'actual-final.wav'],
    problem: [
      'The folder can count them. It cannot say why the second synth left, or why a vocal stayed when the timing was wrong and the feeling was right.',
      'STEM keeps the song as the unit. Every bounce stays, in order, with the sentence written on the version where the decision happened.',
    ],
    features: [
      {
        label: 'The song is the unit',
        body: [
          'Ideas, instrumentals, vocals, mixes, masters, references, and decisions all belong to one song. Files are children of the song, not the other way around.',
        ],
        diagram: `Song
├── Ideas
├── Instrumentals
├── Vocals
├── Mixes
├── Masters
├── References
└── Decisions`,
      },
      {
        label: 'The note stays on the version',
        body: [
          'Nothing is overwritten. v01 is the demo. v03 is the chorus rewrite. The reason lives on the version where it happened: the second synth left because the chorus felt crowded, or this vocal stayed because the feeling was right and the timing was not.',
        ],
        code: {
          file: 'lib/songs/version.ts',
          code: `type Version = {
  id: string
  songId: string
  label: string // "v03 - chorus rewrite"
  audioId: string
  decision: string | null
}

// A waveform says what happened.
// decision says why.`,
        },
      },
      {
        label: 'Analysis is not the producer',
        body: [
          'The model can compare takes, look at pitch and timing, and answer what changed between version 3 and version 5. It can flag a crowded section.',
          'It does not write the song. The musician remains the authority. The workspace is a desk, not a feed.',
        ],
      },
    ],
    stackLabel: 'A desk, not a feed',
    stackIntro:
      'Audio first. The rest of the stack exists so a waveform and the reason beside it can live in the same view, and so nothing gets overwritten to save a filename.',
    stackLayout: 'reasons',
    stack: [
      {
        label: 'Hear it',
        items: ['Web Audio API'],
        note: 'Playback and the waveform sit in the workspace. A version you cannot hear is just another file.',
      },
      {
        label: 'Never replace a bounce',
        items: ['Supabase Storage', 'PostgreSQL'],
        note: 'v01 is the demo. v03 is the chorus rewrite. Both stay. The song owns the files, not the other way around.',
      },
      {
        label: 'The sentence on the pass',
        items: ['A decision field, on the version'],
        note: '“The second synth left because the chorus felt crowded.” The note is data. It is not a comment thread.',
      },
      {
        label: 'Ask what changed',
        items: ['OpenAI', 'Next.js 16', 'React 19', 'TypeScript', 'Vercel'],
        note: 'The model can compare version 3 and version 5, and it can flag a crowded section. It does not write the song.',
      },
    ],
    hard: {
      title: 'A waveform is not a reason',
      problem:
        'Storing audio is ordinary. The hard part is keeping the creative context: why this pass replaced the last one, and which take was kept for the feeling rather than the timing.',
      solution:
        'Every version can carry a decision. Playback, the waveform, and the note sit in the same view. History is kept, including the passes that will never be released.',
    },
    tradeoffs: [
      { decision: 'Versioning', choice: 'Keep every pass', why: 'A tidy folder is how the reason disappears.' },
      { decision: 'AI', choice: 'Compare and describe', why: 'Assistance is not authorship.' },
      { decision: 'Interface', choice: 'A workspace', why: 'Not a social feed of bounces.' },
      { decision: 'Organization', choice: 'Song-centric', why: 'Files belong to the song.' },
    ],
    changes: [
      'A path into the DAW, and real stem-level files.',
      'Deeper waveform editing and collaborative sessions.',
      'A phone companion for ideas caught away from the desk.',
    ],
    faqLabel: 'On the session',
    faq: [
      {
        question: 'What happens to final-final.wav?',
        answer:
          'It becomes a version with a label, in order, under the song. The earlier demo is still there. Saving a new bounce never deletes the previous one.',
      },
      {
        question: 'Where do I write why I changed the chorus?',
        answer:
          'On that version. The waveform shows what happened. The decision is the line next to it, and it does not float off into a notes app.',
      },
      {
        question: 'Can it produce the next chorus for me?',
        answer:
          'It can tell you what moved between version 3 and version 5, and it can point at a section that feels crowded. The musician is still the one who decides. The model is not the producer.',
      },
    ],
  },
};

export function getCaseStudy(slug: string): CaseStudyContent | undefined {
  return studies[slug];
}

export function listCaseStudySlugs(): readonly string[] {
  return Object.keys(studies);
}
