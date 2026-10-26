-- Reconstruction seed. Mirrors lib/data/seed.ts exactly.
--
-- The five projects are the studies. Research rows match the investigations
-- in lib/data/research.ts. Other collections stay placeholders until the real
-- work is in hand. Nothing here claims a usage figure, a release, a venue,
-- or a credential that has not been confirmed.

truncate table
  public.projects, public.tracks, public.books, public.artworks,
  public.photographs, public.research_papers, public.writing_entries,
  public.certifications, public.timeline_items
restart identity;

insert into public.projects
  (slug, title, category, year, status, role, summary, hook, description, highlights, stack, tone, featured, is_placeholder, position, live_url, repo_url)
values
  ('sidequest', 'Sidequest', 'AI / Creative technology', '-', 'Study', '-',
   $sq$A quest system that builds one doable action from interests, time, and place, then remembers what you actually did so the next one is not a repeat.$sq$,
   $sq$One quest, sized to the time you have.$sq$,
   $sq$What if an assistant did not tell you what to watch next, but gave you something worth doing?$sq$,
   array[
     'Quest fields are structured - time, place, difficulty, medium - and the model fills them. It does not write an essay.',
     'Personalization reads interests, context, and previous quests, so the next action is neither a repeat nor a leap you cannot make.',
     'Memory stores experiences: what you tried, what you avoided. It does not store a chat transcript.',
     'The loop is discover, do, complete, remember. The screen asks one question: what should I do now?'
   ],
   array['React Native', 'Expo', 'TypeScript', 'React Native Web', 'Supabase', 'PostgreSQL', 'AI', 'Reanimated'],
   'rose', true, false, 0, 'https://sidequest.chiradeep.me', 'https://github.com/ChiradeepFinn/sidequest'),
  ('synesthesia', 'Synesthesia', 'AI / Generative art', '-', 'Study', '-',
   $sy$A creative system that reads atmosphere, rhythm, and structure in one medium and constructs another, then lets a second person challenge that reading.$sy$,
   $sy$Photo to music to language to image.$sy$,
   $sy$A photograph becomes music. Music becomes language. Language becomes an image.$sy$,
   array[
     'Image, audio, and text share one semantic layer. The output is an interpretation, not a file conversion.',
     'Chains keep history: photo to music to text to image, each step the input for the next.',
     'Interpretation battles give two people the same source and two competing readings.',
     'Generation runs after feature extraction, so meaning is structured before a new medium is made.'
   ],
   array['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'AI', 'Generative media', 'Supabase'],
   'blue', true, false, 1, 'https://synesthesia.chiradeep.me', 'https://github.com/ChiradeepFinn/synesthesia'),
  ('framework', 'Framework', 'AI / Photography', '-', 'Study', '-',
   $fw$A photography workspace that clusters a shoot, ranks what remains against composition and your own keeps, then sequences the frames that belong together.$fw$,
   $fw$Which five frames belong.$fw$,
   $fw$The hardest part of photography is not taking five hundred photographs. It is knowing which five matter.$fw$,
   array[
     'A shoot comes in as a set. Near-duplicates cluster. What remains is ranked for selection.',
     'Sharpness, subject, composition, and personal taste stay separate signals. Nothing collapses into one score.',
     'Sequence is a second pass, after the edit, so a gallery reads as a story.',
     'Every keep is a preference signal. The model learns your eye, not a generic photography grade.'
   ],
   array['Next.js', 'React', 'TypeScript', 'AI', 'Computer vision', 'Supabase'],
   'teal', true, false, 2, 'https://framework.chiradeep.me', 'https://github.com/ChiradeepFinn/framework'),
  ('path', 'Path', 'AI / Education', '-', 'Study', '-',
   $pt$A learning system that turns a broad goal into a prerequisite graph, maps resources onto the nodes, and answers one question: what now?$pt$,
   $pt$One next action, always named.$pt$,
   $pt$The internet has infinite learning resources. The problem is knowing what to learn next.$pt$,
   array[
     'A goal becomes a graph of concepts and dependencies, not a syllabus and not a list of search results.',
     'A node stays closed until its prerequisites are done, so the path cannot skip the foundation.',
     'Courses, docs, books, and exercises attach to a node. They do not replace the path.',
     'What now reads the goal, the completed nodes, and the current project, and returns one next action.'
   ],
   array['Next.js', 'React', 'TypeScript', 'AI', 'Graph data', 'Supabase'],
   'blue', true, false, 3, 'https://path.chiradeep.me', 'https://github.com/ChiradeepFinn/path'),
  ('stem', 'STEM', 'Music technology', '-', 'Study', '-',
   $st$A workspace for the passes of a song - demos, vocals, mixes - with the reason each one changed kept on the version where it happened.$st$,
   $st$Every version, and why it changed.$st$,
   $st$Songs are not created in one file. They are created through hundreds of decisions.$st$,
   array[
     'Versions stay in order, from the first demo to the current mix. Nothing is overwritten to save a filename.',
     'Vocals, instrumentals, mixes, references, and notes live on the song, not in a folder.',
     'A creative decision stays attached to the version where it was made.',
     'Analysis can compare takes and flag repeated patterns. It does not produce the track.'
   ],
   array['Next.js', 'React', 'TypeScript', 'Web Audio', 'Supabase', 'AI'],
   'rose', true, false, 4, 'https://stem.chiradeep.me', 'https://github.com/ChiradeepFinn/stem');

insert into public.tracks (slug, title, mood, duration, year, note, featured, position)
values
  ('track-slot-01', 'Featured track', '-', '-:-', '-',
   'The homepage listening slot. One track, one atmosphere, one door into the music page.', true, 0),
  ('track-slot-02', 'Second track', '-', '-:-', '-', 'Reserved for a release.', false, 1),
  ('track-slot-03', 'Third track', '-', '-:-', '-', 'Reserved for a release.', false, 2);

insert into public.books (slug, index_label, title, subtitle, synopsis, excerpt, is_placeholder, position)
values
  ('book-one', '01', 'The Inward Silhouette', '',
   'A published book. The cover, a synopsis from the text, and the edition details are not in the site record, so none of them are invented here.',
   '', false, 0),
  ('book-two', '02', 'Second published book', 'Title to be added',
   'A second published book is part of the record. Its title, cover, and edition details are not, so they stay blank.',
   '', true, 1);

insert into public.artworks (slug, title, medium, year, size, featured, position)
values
  ('artwork-01', 'Untitled', '-', '-', 'tall',   true,  0),
  ('artwork-02', 'Untitled', '-', '-', 'square', true,  1),
  ('artwork-03', 'Untitled', '-', '-', 'wide',   true,  2),
  ('artwork-04', 'Untitled', '-', '-', 'square', false, 3),
  ('artwork-05', 'Untitled', '-', '-', 'tall',   false, 4),
  ('artwork-06', 'Untitled', '-', '-', 'wide',   false, 5),
  ('artwork-07', 'Untitled', '-', '-', 'square', false, 6),
  ('artwork-08', 'Untitled', '-', '-', 'tall',   false, 7);

insert into public.photographs (slug, title, place, captured, size, featured, position)
values
  ('photo-01', 'Untitled frame', '-', '-', 'wide',   true,  0),
  ('photo-02', 'Untitled frame', '-', '-', 'tall',   true,  1),
  ('photo-03', 'Untitled frame', '-', '-', 'square', true,  2),
  ('photo-04', 'Untitled frame', '-', '-', 'tall',   true,  3),
  ('photo-05', 'Untitled frame', '-', '-', 'wide',   false, 4),
  ('photo-06', 'Untitled frame', '-', '-', 'square', false, 5);

insert into public.research_papers (slug, question, title, abstract, field, status, featured, is_placeholder, position)
values
  ('music-emotion-recognition',
   'How does music emotion recognition differ between instrumental audio and music that includes vocals?',
   'Beyond Genre Classification: Evaluating Machine Learning Models for Music Emotion Recognition Across Instrumental and Vocal Audio',
   'A study in progress on whether music emotion recognition treats instrumental audio and vocal audio differently. The DEAM files are downloaded. They are not validated for training, and no models have been run.',
   'Music information retrieval', 'In progress', true, false, 0),
  ('ai-assisted-creativity',
   'How does AI-assisted ideation change the originality of human creative work, and the sense of owning it?',
   'Beyond the Prompt: Measuring the Effects of AI-Assisted Ideation on Human Creative Originality and Ownership',
   'A completed comparison of unaided and AI-assisted ideation. Originality, perceived ownership, and perceived agency were measured as separate things. Scored tables are not printed on this page.',
   'Human–AI interaction', 'Done', false, false, 1);

insert into public.writing_entries (slug, title, category, excerpt, featured, position)
values
  ('writing-slot-01', 'Things I cannot stop thinking about', 'Essay',
   'A single thought belongs here - the one worth more than a caption. Held open until there is a real passage to put in it, because a borrowed thought would defeat the point of the section.',
   true, 0);

insert into public.certifications (slug, title, issuer, year, note, position)
values
  ('certification-01', 'Certification', '-', '-',
   'Reserved slot. Certificates go here once the issuer and date are confirmed.', 0),
  ('certification-02', 'Certification', '-', '-', 'Reserved slot.', 1),
  ('certification-03', 'Certification', '-', '-', 'Reserved slot.', 2);

insert into public.timeline_items (slug, year, title, note, is_placeholder, position)
values
  ('before-the-beginning', 'Before the beginning', 'The chapter that changed everything',
   'A family change raised a different question: what I could make of my life.', false, 0),
  ('2020', '2020', 'The first spark',
   'Curiosity, research, and the year coding began.', false, 1),
  ('2023', '2023', 'A new language',
   'Music production opened another way to create.', false, 2),
  ('2024', '2024', 'Words, ideas, and first builds',
   'Writing began, and so did STEM. Neither was finished.', false, 3),
  ('october-2026', 'October 2026', 'The work becomes visible',
   'A second book was published. The portfolio and the research were underway, not finished papers.', false, 4),
  ('now', 'Now', 'Still becoming',
   'Still building, writing, and working toward computer science and AI.', false, 5),
  ('the-future', 'The future', 'The unwritten chapter',
   'Ambitions for technology, products, research, and stories. Not accomplishments.', false, 6);
