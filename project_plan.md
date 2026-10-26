Below is the content system I'd use for your five projects.

01 — SIDEQUEST
Featured project

SIDEQUEST

Turn an ordinary day into something worth doing.

An AI-powered creative exploration platform that gives people real-world quests—photograph something, make a piece of music, explore somewhere unfamiliar, write, draw, learn, or simply try something they've never done before.

Highlights

✦ Quest system designed around real-world action rather than passive content consumption.
✦ Personalized quests can adapt to interests, available time, environment, and previous experiences.
✦ A persistent memory layer can learn what a person has actually explored and use it to shape future quests.
✦ Designed around a mobile-first interaction loop: discover → do → remember → discover again.

Tags

NEXT.JS REACT TYPESCRIPT TAILWIND CSS SUPABASE POSTGRESQL AI MOTION

Case study

Sidequest

AI / Creative Technology / Product Design

Hero statement

What if an AI assistant didn't tell you what to watch next—but gave you something worth doing?

01 — The problem

Most recommendation systems optimize for more consumption.

More videos.
More posts.
More scrolling.

Sidequest starts from the opposite question:

What could I actually experience today?

The product turns a vague desire to "do something" into a concrete, achievable real-world action.

02 — From prompt to quest

A Sidequest isn't simply an AI-generated sentence.

The intended system considers:

interests
available time
location/context
difficulty
previous quests
skills already explored
preferred creative mediums
whether the user wants something familiar or unexpected

The output is a doable experience, not an AI essay.

User context
     ↓
Context builder
     ↓
Quest engine
     ↓
Personalization
     ↓
Sidequest
     ↓
Real-world action
     ↓
Memory
     ↓
Future quests
03 — Designing the quest loop

The core loop is deliberately short:

Discover → Accept → Do → Complete → Remember

The interface therefore prioritizes one question:

What should I do now?

rather than presenting the user with a dashboard full of metrics.

04 — The technical challenge

The interesting engineering problem is not simply calling an LLM.

It is building a system where generated quests remain:

actionable
appropriately difficult
safe
varied
relevant
non-repetitive
compatible with the user's actual context

The AI layer therefore sits on top of structured product logic rather than replacing it.

05 — Memory

Sidequest's memory isn't intended to become another generic AI chat history.

It remembers experiences.

For example:

Tried:
Street photography

Discovered:
Interested in shadows + architecture

Skill:
Manual exposure

Avoided:
Long indoor activities

Next opportunity:
Night photography quest

This creates a feedback loop between what the user actually does and what the system suggests next.

06 — Trade-offs
Decision	Choice	Why
Content	Structured quest data	More predictable than free-form AI output
UI	Mobile-first	The product is used while moving through the real world
Navigation	Minimal	The action matters more than the dashboard
AI	Behind the quest system	Prevents AI from becoming the entire product
Memory	Experience-oriented	Avoids turning Sidequest into a generic journal
07 — Results

For the portfolio, do not fabricate user numbers here.

Instead, show:

working V1
quest flow
responsive interface
quest data architecture
personalization architecture
AI integration when implemented

Later, once real usage exists, this section can contain actual metrics.

08 — What I'd change

Potential future iterations:

stronger contextual personalization
richer offline behavior
better quest difficulty calibration
social/group quests
deeper memory
adaptive quest chains
better post-quest interpretation
FAQ

Is Sidequest a productivity app?
No. It is designed around exploration and creative action rather than task completion.

Is every quest AI-generated?
The intended system combines structured quest logic with AI personalization.

Does it track mood?
No. Sidequest is not designed as a therapy or mood-tracking product.

02 — SYNESTHESIA
Featured project

SYNESTHESIA

What happens when one medium becomes another?

A creative AI system that transforms a photograph, song, piece of writing, or other creative work into a different medium—then lets people interpret, remix, and challenge the result.

Highlights

✦ Cross-medium transformation between image, sound, text, and other creative formats.
✦ AI interpretation rather than simple one-to-one conversion.
✦ Transformation chains allow one creation to become the input for another.
✦ Interpretation battles explore whether two people perceive the same creative artifact differently.

Tags

REACT NATIVE EXPO TYPESCRIPT AI GENERATIVE MEDIA SUPABASE

Case study
Synesthesia

AI / Generative Art / Creative Technology

Hero

A photograph becomes music. Music becomes language. Language becomes an image.

01 — The problem

Creative tools are usually separated by medium.

A photographer works in images.
A musician works in sound.
A writer works in language.

Synesthesia asks:

What if the boundaries between those mediums disappeared?

02 — The transformation system
                    CREATION
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
      IMAGE          AUDIO           TEXT
        │              │              │
        └──────── AI INTERPRETATION ──┘
                       │
                       ↓
                NEW CREATIVE MEDIUM

The important distinction is that the AI isn't simply "converting" file formats.

It interprets meaning, atmosphere, structure, rhythm, color, emotion, and composition and uses those signals to construct another creative representation.

03 — Transformation chains

One output can become another input:

Photo → Music → Text → Image

This makes the system less like a converter and more like a creative telephone game.

Each transformation introduces interpretation.

04 — Interpretation battles

Two people can receive the same source material and generate competing interpretations.

The interesting question becomes:

Whose interpretation feels closer to the original?

This turns AI generation into a collaborative creative experiment rather than a one-click generator.

05 — Technical challenge

The difficult part is building a common representation between fundamentally different media.

The system needs a conceptual intermediate layer:

Source
 ↓
Feature extraction
 ↓
Semantic representation
 ↓
Creative interpretation
 ↓
Target-medium generation
06 — Trade-offs
Fidelity vs creative freedom
User intent vs AI interpretation
Transformation speed vs generation quality
Reproducibility vs randomness
07 — Results

Show:

transformation examples
chains
before/after artifacts
interface
generation pipeline

Avoid invented "accuracy" statistics.

08 — What I'd change

Future versions could explore:

longer transformation chains
collaborative rooms
multi-model interpretation
user-controlled transformation intensity
provenance/history for every transformation
03 — FRAMEWORK
Featured project

FRAMEWORK

An AI assistant that learns how you see.

A photography workspace that helps photographers select, analyze, organize, and sequence their images while gradually learning their visual preferences.

Highlights

✦ AI-assisted image selection from large photo sets.
✦ Ranking based on composition, subject, technical quality, and personal preference.
✦ Automatic sequencing for galleries and visual stories.
✦ Learns the photographer's "eye" rather than applying one generic photography score.

Tags

NEXT.JS REACT TYPESCRIPT AI COMPUTER VISION SUPABASE

Case study
Framework

AI / Photography / Computer Vision

Hero

The hardest part of photography isn't taking 500 photographs. It's knowing which five matter.

01 — The problem

Modern cameras make capturing photographs effortless.

Selection isn't.

A photographer may return from a shoot with hundreds of frames and still need to answer:

Which images are actually strong?
Which are duplicates?
Which belong together?
What sequence tells the story?
Which images fit my style?

Framework focuses on that decision layer.

02 — The workflow
Import
  ↓
Analyze
  ↓
Cluster
  ↓
Rank
  ↓
Select
  ↓
Sequence
  ↓
Export
03 — Learning the photographer

Generic computer vision can tell you whether an image is sharp.

It can't necessarily tell you:

"This is the kind of photograph Chiradeep tends to choose."

Framework therefore treats user selections as training signals.

AI recommendation
       ↓
Photographer chooses
       ↓
Preference signal
       ↓
Personal visual model
       ↓
Better recommendations
04 — The interesting problem

The product must avoid reducing artistic preference to a single numerical score.

A technically imperfect image can still be the photograph that matters.

Therefore the system should treat AI recommendations as decision support, not objective artistic truth.

05 — Trade-offs
Problem	Approach
Technical quality vs artistic value	Keep multiple signals
Generic AI vs personal taste	Learn from selections
Hundreds of images	Clustering + ranking
Individual photos vs story	Sequence after selection
06 — Results

Portfolio evidence should focus on:

photo-selection workflow
AI ranking interface
clustering
sequencing
preference feedback loop
07 — What I'd change
RAW support
Lightroom integration
stronger personal embeddings
contact-sheet mode
collaborative curation
sequence-aware recommendations
04 — PATH
Featured project

PATH

Stop asking what to learn. Start knowing what to do next.

A personalized learning system that turns a large goal into an adaptive roadmap of concepts, resources, projects, and next actions.

Highlights

✦ Converts broad goals into structured learning paths.
✦ Maps prerequisites and dependencies between concepts.
✦ Recommends resources rather than forcing a single course.
✦ A persistent “WHAT NOW?” action always identifies the next useful step.

Tags

NEXT.JS REACT TYPESCRIPT AI GRAPH DATA SUPABASE

Case study
Path

AI / Education / Knowledge Systems

Hero

The internet has infinite learning resources. The problem is knowing what to learn next.

01 — The problem

Search engines answer:

"What exists?"

Courses answer:

"What does this course teach?"

Neither necessarily answers:

"Given what I already know, what should I do next?"

Path is built around that question.

02 — Learning graph

Instead of a linear course list:

Python
  ↓
Programming fundamentals
  ↓
Data structures
  ├── Algorithms
  └── Systems
        ↓
Machine Learning
  ├── Mathematics
  ├── Statistics
  └── Optimization
        ↓
Deep Learning

The learner sees relationships and prerequisites.

03 — The WHAT NOW? system

The defining interaction is intentionally simple.

WHAT NOW?

Path considers:

current goal
completed concepts
prerequisites
current project
available resources
previous progress

and produces the next action.

Not:

"Here are 47 courses."

But:

"Do this next."

04 — Resource selection

Resources can include:

courses
documentation
books
papers
videos
projects
exercises

The system maps resources onto the learner's path instead of allowing resources to become the path themselves.

05 — Trade-offs

Flexibility vs structure

Too much structure becomes another rigid curriculum.

Too little structure becomes another search engine.

Path sits between the two.

06 — Results

Show:

learning graph
goal creation
resource mapping
WHAT NOW?
completed nodes
adaptive roadmap
07 — What I'd change
stronger prerequisite inference
skill verification
project-based assessment
calendar integration
collaborative learning paths
better long-term adaptation
05 — STEM
Featured project

STEM

A workspace for the messy process behind a song.

A musician-focused workspace for managing song versions, vocals, mixes, experiments, references, and creative decisions without losing the history of how a track evolved.

Highlights

✦ Version-based song development instead of a single final file.
✦ Central workspace for vocals, instrumentals, mixes, references, and notes.
✦ Creative decisions remain attached to the version where they happened.
✦ Designed around the actual iterative process of making music.

Tags

NEXT.JS REACT TYPESCRIPT WEB AUDIO SUPABASE AI

Case study
STEM

Music Technology / Creative Tools / Audio

Hero

Songs aren't created in one file. They're created through hundreds of decisions.

01 — The problem

A song might exist as:

final.wav
final2.wav
final-final.wav
final-real.wav
final-real-2.wav

The actual creative process is scattered across files, DAWs, voice notes, exports, and memory.

STEM treats the process itself as data.

02 — The workspace
SONG
│
├── Ideas
├── Instrumentals
├── Vocals
├── Mixes
├── Masters
├── References
└── Decisions

Every version belongs to the same creative history.

03 — Version history

Instead of overwriting:

Song
 ├── v01 — demo
 ├── v02 — new drums
 ├── v03 — vocal rewrite
 ├── v04 — new mix
 └── v05 — current

The musician can understand why the track changed.

04 — Creative memory

The important information isn't only the audio file.

It is also:

"I changed the chorus because it felt too crowded."

or:

"This vocal take has the emotion I want, even though the timing isn't perfect."

STEM preserves those decisions alongside the work.

05 — AI layer

AI can eventually assist with:

vocal analysis
mix feedback
version comparison
reference matching
arrangement suggestions
identifying repeated creative patterns

But AI remains an assistant, not the producer.

06 — Trade-offs
Decision	Choice
Versioning	Preserve history
AI	Assist rather than replace
UI	Workspace rather than social feed
Audio	Keep creative context attached
Organization	Song-centric
07 — Results

Portfolio evidence:

song workspace
version timeline
audio player
vocal/mix views
creative notes
comparison interface
08 — What I'd change
DAW integrations
stem management
waveform editing
collaborative sessions
richer audio analysis
mobile companion
AI-assisted arrangement

Now the additional details:
Yes. This is the level of documentation I’d use for your portfolio: **not generic README filler, but an actual product/engineering record**.

I’m treating the five projects as **independent products**, each with its own identity, repository, data layer, landing page, and case study. I’m also separating **implemented/current** from **planned** so your portfolio never claims technology you haven't actually built.

---

# 01 — SIDEQUEST

> **Turn an ordinary day into something worth doing.**

**Type:** AI / Creative Technology / Real-world Exploration
**Platform:** Web app currently; product architecture can evolve later
**Status:** In development
**Repository:** Independent
**Core idea:** AI-generated real-world creative quests

---

## 1. The Pitch

**Sidequest gives you something worth doing.**

Instead of recommending another video, post, song, or article, Sidequest generates small real-world experiences:

* photograph something
* write something
* draw something
* make a piece of music
* explore somewhere
* learn a skill
* observe something differently
* create something from your surroundings

The objective is not productivity.

It is **participation in the real world**.

---

## 2. Why I Built It

Modern recommendation systems are extremely good at answering:

> *"What should I consume next?"*

They are much worse at answering:

> **"What should I actually do?"**

Sidequest explores the opposite model.

Instead of optimizing for attention and continued consumption, it creates a reason to **leave the interface and do something**.

The product is built around a simple loop:

```text
Discover
   ↓
Accept
   ↓
Do
   ↓
Complete
   ↓
Remember
   ↓
Get a better next quest
```

---

## 3. Core Philosophy

Sidequest should feel:

* playful
* warm
* curious
* human
* slightly unexpected
* non-judgmental

It is **not**:

* a therapy app
* a mood tracker
* a productivity tracker
* a habit-streak machine
* a social-media feed

The interface should encourage action without turning creativity into a score.

---

# 4. Product Architecture

```text
                    USER
                      │
                      ▼
              Context Builder
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
       Interests    History    Constraints
          │           │           │
          └───────────┼───────────┘
                      ▼
                Quest Engine
                      │
                      ▼
                 AI Layer
                      │
                      ▼
                QUEST OBJECT
                      │
                      ▼
                User Action
                      │
                      ▼
                Completion
                      │
                      ▼
                   Memory
                      │
                      └──────→ Future Quest
```

The important architectural decision is that **AI isn't the entire application**.

The application owns the product logic.

AI operates inside that system.

---

# 5. Current Technology

### Current repository

* **Next.js 16 App Router**
* **React 19**
* **TypeScript**
* **Tailwind CSS v4**
* **Supabase**
* **PostgreSQL**
* **Supabase Row Level Security**
* **Resend**
* **Framer Motion**
* **Lenis**
* Typed seed/mock data

### Current content/data approach

Quest and content data currently use typed data/seed structures rather than MDX.

### Not currently implemented

Do **not** list these as already used:

* React Compiler
* Prisma
* MDX
* better-auth
* PostHog

---

# 6. UI System

### Visual direction

**Pastel / warm / paper-like / editorial**

* Warm peach canvas
* Warm off-white surfaces
* Lilac
* Butter
* Sage
* Cream
* Near-black ink

Typography:

* Geist
* heavy/tight headlines
* regular sans body text
* no serif display typography

Components:

* ~28px cards
* pill controls
* floating navigation
* soft shadows
* minimal borders
* 44px minimum interaction targets

### Primary navigation

```text
Today       +       Progress
```

The center action is:

> **New Quest**

Secondary destinations:

* Explore
* Memory
* Groups
* Profile

---

# 7. Key Features

### Today

The main daily experience.

Contains:

* current quest
* category
* description
* action
* completion state
* recommended practices

### Explore

Browse possible quest categories and experiences.

### New Quest

The primary Sidequest action.

The current version uses mock quest data while the actual quest engine is being developed.

### Progress

Tracks meaningful activity such as:

* quests finished
* skills tried
* categories explored

Avoid:

* XP
* fake percentages
* leaderboard mechanics
* manipulative streaks

### Memory

A record of experiences rather than a journal.

### Groups

Future social/group exploration.

---

# 8. Data Model Direction

A quest should eventually be a structured object rather than plain generated text:

```ts
Quest {
  id
  title
  prompt
  category
  difficulty
  estimatedTime
  environment
  materials
  constraints
  skill
  novelty
  createdAt
}
```

Completion:

```ts
QuestCompletion {
  id
  questId
  userId
  startedAt
  completedAt
  result
  reflection
}
```

Memory can then derive from actual experiences rather than arbitrary AI assumptions.

---

# 9. Repository Structure

Current structure should remain aligned with the actual repo, but conceptually:

```text
app/
├── page.tsx
├── today/
├── explore/
├── progress/
├── memory/
├── groups/
└── api/

components/
├── quest/
├── navigation/
├── cards/
├── progress/
└── ui/

lib/
├── data/
├── content.ts
├── supabase/
└── ...

supabase/
└── migrations/
```

---

# 10. Roadmap

### Phase 1 — Product shell

* UI
* navigation
* responsive system
* mock quests

### Phase 2 — Persistence

* users
* quests
* completions
* history

### Phase 3 — Quest Engine

* structured quest generation
* difficulty
* context
* novelty
* constraints

### Phase 4 — Memory

* experience history
* preference signals
* skill discovery

### Phase 5 — AI

* personalized generation
* interpretation
* adaptive recommendations

### Phase 6 — Groups

* collaborative quests
* shared experiences

---

# 02 — SYNESTHESIA

> **What happens when one form of creativity becomes another?**

**Type:** Generative AI / Multimodal Creativity
**Platform:** Mobile app
**Stack:** Expo / React Native / TypeScript
**Status:** Independent project / planned build

---

# 1. The Pitch

**Synesthesia transforms creative work between mediums.**

Upload:

* a photograph
* a song
* writing
* another creative artifact

and the system interprets it into another medium.

For example:

```text
Photograph
    ↓
AI interpretation
    ↓
Music
```

or:

```text
Music
    ↓
AI interpretation
    ↓
Writing
```

---

# 2. Why I Built It

Creative tools usually divide creativity into separate disciplines.

Photography is treated as photography.

Music as music.

Writing as writing.

Synesthesia asks:

> **What if creative ideas could move freely between mediums?**

The goal isn't literal conversion.

It is **interpretation**.

---

# 3. Core Concept

The system should preserve the conceptual qualities of the original:

* atmosphere
* rhythm
* color
* composition
* emotion
* structure
* intensity
* movement

and reinterpret them in another medium.

---

# 4. Architecture

```text
              SOURCE CREATION
                     │
                     ▼
              Media Analysis
                     │
                     ▼
            Semantic Representation
                     │
                     ▼
             AI Interpretation
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
        IMAGE       AUDIO       TEXT
          │          │          │
          └──────────┼──────────┘
                     ▼
              NEW CREATION
```

---

# 5. Transformation Chains

The interesting part is that outputs can become new inputs.

```text
PHOTO
 ↓
MUSIC
 ↓
TEXT
 ↓
IMAGE
```

Every step introduces another layer of interpretation.

This turns Synesthesia into a **creative transformation chain**, rather than a simple converter.

---

# 6. Interpretation Battles

A second interaction model:

Two people receive the same source.

Both generate their own interpretation.

```text
              ORIGINAL
                  │
          ┌───────┴───────┐
          ▼               ▼
       PERSON A         PERSON B
          │               │
          ▼               ▼
    INTERPRETATION A  INTERPRETATION B
          │               │
          └───────┬───────┘
                  ▼
             COMPARISON
```

This makes the AI output itself part of a creative discussion.

---

# 7. Proposed Stack

### Mobile

* Expo
* React Native
* TypeScript
* Expo Router
* NativeWind
* Zustand
* Zod
* Reanimated/Moti
* Supabase
* OpenAI
* EAS

Potential infrastructure:

* Sentry
* PostHog

These should only appear in the portfolio's **technology-used** section once actually implemented.

---

# 8. Data Architecture

```text
User
 │
 ├── Creations
 │      ├── Source media
 │      ├── Metadata
 │      └── Transformations
 │
 ├── Chains
 │      └── Transformation history
 │
 └── Battles
        ├── Participant A
        └── Participant B
```

Each transformation should retain provenance:

```text
Transformation {
  sourceId
  sourceType
  targetType
  model
  prompt/context
  outputId
  createdAt
}
```

That allows the complete creative chain to be reconstructed.

---

# 9. UX

The mobile app should be extremely visual.

Primary flow:

```text
Create
 ↓
Choose medium
 ↓
Upload / record
 ↓
Choose transformation
 ↓
Generate
 ↓
Reveal
 ↓
Remix / continue chain
```

---

# 10. Roadmap

### V1

* image → text
* image → music concept
* text → image
* transformation history

### V2

* audio transformations
* longer chains
* interpretation battles

### V3

* collaborative chains
* community exhibitions
* personal creative style

---

# 03 — FRAMEWORK

> **AI that learns how you see.**

**Type:** Computer Vision / Photography / AI
**Platform:** Web app
**Stack:** Next.js / TypeScript / Tailwind
**Status:** Independent project

---

# 1. The Pitch

Framework helps photographers answer:

> **Which photographs actually matter?**

It analyzes large collections, helps identify strong images, learns the photographer's preferences, and eventually creates coherent sequences.

---

# 2. Why I Built It

Taking 500 photographs is easy.

Selecting five is difficult.

Traditional image-selection tools tend to optimize for generic technical quality:

* sharpness
* exposure
* faces
* composition

But photography is subjective.

A technically imperfect image can still be the strongest photograph.

Framework therefore focuses on:

> **personal visual taste.**

---

# 3. Core Workflow

```text
IMPORT
  ↓
ANALYZE
  ↓
CLUSTER
  ↓
RANK
  ↓
SELECT
  ↓
SEQUENCE
  ↓
EXPORT
```

---

# 4. Computer Vision Layer

Potential signals:

### Technical

* sharpness
* exposure
* noise
* blur
* image quality

### Visual

* composition
* subject
* color
* contrast
* spatial structure

### Semantic

* people
* architecture
* landscape
* objects
* environment

But these signals should **not become a single "photo quality score."**

Instead, they become evidence for recommendations.

---

# 5. Personal Preference Model

The central concept:

> **The photographer teaches the system what they like.**

```text
AI recommendation
       ↓
Photographer chooses
       ↓
Preference signal
       ↓
Taste representation
       ↓
Better recommendation
```

Over time:

```text
Generic vision model
        +
Personal selection history
        ↓
Personal visual preference
```

---

# 6. Selection Interface

The main workspace could use:

* contact sheets
* side-by-side comparison
* keyboard shortcuts
* shortlist
* reject
* favorite
* AI recommendations

The AI should remain explainable.

Instead of:

> **Score: 87**

prefer:

> Strong composition
> Similar to photographs you've previously selected
> Slight technical softness

---

# 7. Sequencing

After selecting photographs, Framework can arrange them into a visual narrative.

Possible signals:

* visual continuity
* subject transitions
* color
* composition
* pacing
* location/context

```text
IMAGE A
   ↓
IMAGE C
   ↓
IMAGE F
   ↓
IMAGE B
   ↓
IMAGE D
```

The objective isn't necessarily to find the "best" order.

It is to find the most coherent **story**.

---

# 8. Proposed Stack

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui
* Framer Motion
* Supabase
* PostgreSQL
* OpenAI
* computer vision/image-processing layer
* Sharp where appropriate
* Vercel

---

# 9. Data Architecture

```text
Project
 └── Shoot
      ├── Images
      │    ├── Metadata
      │    ├── Vision features
      │    └── User decisions
      │
      ├── Selections
      │
      └── Sequences
```

Preference data:

```text
PreferenceSignal {
  userId
  imageId
  action
  context
  timestamp
}
```

---

# 10. Roadmap

### V1

* image upload
* contact sheet
* metadata
* selection

### V2

* AI analysis
* clustering
* recommendations

### V3

* personal taste model
* sequencing
* visual storytelling

### V4

* Lightroom integration
* RAW workflows
* advanced preference modeling

---

# 04 — PATH

> **Stop asking what to learn. Start knowing what to do next.**

**Type:** AI / Education / Knowledge Systems
**Platform:** Web app
**Stack:** Next.js / TypeScript / Tailwind
**Status:** Independent project

---

# 1. The Pitch

Path turns a vague learning goal into a structured sequence of:

**concepts → resources → projects → next actions.**

Its defining interaction is:

> **WHAT NOW?**

---

# 2. Why I Built It

The internet contains almost unlimited educational resources.

That's not necessarily an advantage.

A learner can search:

> "How do I learn machine learning?"

and receive:

* 50 courses
* 100 YouTube videos
* thousands of articles
* dozens of roadmaps

The real problem is:

> **What should I do next, given what I already know?**

---

# 3. Core Model

Path should represent learning as a graph rather than a playlist.

```text
Programming
    │
    ├── Python
    │     ↓
    │  Data Structures
    │     ↓
    │  Algorithms
    │
    └── Mathematics
          ↓
       Statistics
          ↓
      Machine Learning
```

---

# 4. Learning Graph

Each node can represent:

* concept
* skill
* resource
* project
* assessment

Relationships represent:

* prerequisite
* recommended-after
* reinforces
* applies
* alternative

---

# 5. WHAT NOW?

The system evaluates:

```text
Current goal
     +
Known skills
     +
Completed nodes
     +
Prerequisites
     +
Available resources
     +
Current project
     ↓
WHAT NOW?
```

The result should be a concrete action.

Example:

> **Spend 35 minutes implementing binary search from scratch.**

rather than:

> "Study algorithms."

That distinction is the entire point.

---

# 6. Resource System

Path can map:

* books
* courses
* documentation
* papers
* videos
* exercises
* projects

onto the learning graph.

A resource is therefore not the destination.

It is a **tool for reaching a node**.

---

# 7. Proposed Stack

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui
* Framer Motion
* Supabase
* PostgreSQL
* OpenAI
* Vercel

Potential graph representation can remain relational initially rather than introducing a dedicated graph database prematurely.

---

# 8. Data Architecture

```text
User
 │
 ├── Goals
 │
 ├── Skills
 │
 ├── Learning Paths
 │       │
 │       ├── Nodes
 │       ├── Prerequisites
 │       └── Resources
 │
 └── Progress
```

Core node:

```ts
LearningNode {
  id
  title
  type
  difficulty
  prerequisites
  resources
}
```

---

# 9. UX

Main screens:

### Home

Current path + **WHAT NOW?**

### Path

Visual learning graph.

### Resources

Mapped learning material.

### Projects

Practical application.

### Progress

Completed concepts and projects.

The interface should never overwhelm the learner with the entire internet.

---

# 10. Roadmap

### V1

* goal creation
* basic learning graph
* resource mapping
* WHAT NOW?

### V2

* AI path generation
* adaptive sequencing

### V3

* skill verification
* project assessment

### V4

* personalized long-term learning model

---

# 05 — STEM

> **A workspace for the messy process behind a song.**

**Type:** Music Technology / Audio / Creative Workflow
**Platform:** Web app
**Stack:** Next.js / TypeScript / Tailwind
**Status:** Independent project

---

# 1. The Pitch

STEM is a musician's workspace for the **entire evolution of a song**.

Not just the final WAV.

It preserves:

* ideas
* versions
* vocals
* mixes
* references
* decisions
* experiments

---

# 2. Why I Built It

A song rarely exists as one clean project.

It looks more like:

```text
demo.wav
demo2.wav
new chorus.wav
final.wav
final2.wav
final-final.wav
actual-final.wav
```

The file system records the files.

It doesn't record **why they changed**.

STEM treats the creative process as first-class data.

---

# 3. Core Model

```text
SONG
 │
 ├── Ideas
 │
 ├── Instrumentals
 │
 ├── Vocals
 │
 ├── Mixes
 │
 ├── Masters
 │
 ├── References
 │
 └── Decisions
```

---

# 4. Version History

Instead of overwriting:

```text
Song
 │
 ├── v01 — initial demo
 ├── v02 — new drums
 ├── v03 — rewritten chorus
 ├── v04 — vocal replacement
 ├── v05 — mix revision
 └── v06 — current
```

Each version preserves its context.

---

# 5. Creative Decisions

A version can contain notes such as:

> "The chorus felt too crowded, so I removed the second synth."

or:

> "This vocal take has more emotion despite being less technically clean."

This becomes the **creative memory of the song**.

---

# 6. Audio Workspace

Core interface:

```text
┌──────────────────────────────────────┐
│ SONG TITLE                           │
├──────────────────────────────────────┤
│                                      │
│            WAVEFORM                  │
│                                      │
├──────────────────────────────────────┤
│ v01  v02  v03  v04  v05             │
├──────────────────────────────────────┤
│ Vocals   Mix   References   Notes    │
└──────────────────────────────────────┘
```

Potential tools:

* audio playback
* waveform
* version comparison
* vocal take organization
* mix references
* notes
* version timeline

---

# 7. AI Layer

AI should assist the musician rather than replace them.

Potential capabilities:

### Vocal analysis

* pitch consistency
* timing
* dynamics
* take comparison

### Mix analysis

* frequency balance
* dynamics
* stereo field
* clipping
* loudness

### Creative analysis

* arrangement density
* repeated sections
* structural patterns

### Version comparison

> "What changed between v3 and v5?"

The musician remains the final decision-maker.

---

# 8. Proposed Stack

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui
* Framer Motion
* Supabase
* PostgreSQL
* Web Audio API
* OpenAI
* Vercel

Potential future audio-processing infrastructure can be added only when the actual processing requirements justify it.

---

# 9. Data Architecture

```text
User
 │
 └── Projects
      │
      └── Song
           │
           ├── Versions
           │    ├── Audio
           │    ├── Notes
           │    └── Decisions
           │
           ├── Vocal Takes
           │
           ├── Mixes
           │
           └── References
```

A version might contain:

```ts
SongVersion {
  id
  songId
  versionNumber
  title
  audioUrl
  notes
  changes
  createdAt
}
```

---

# 10. Roadmap

### V1

* song workspace
* upload audio
* versions
* playback
* notes

### V2

* waveform
* vocal organization
* mix comparison
* references

### V3

* AI analysis
* version comparison
* creative recommendations

### V4

* DAW integrations
* stems
* collaboration
* advanced audio processing

---

# The Five Projects as One Portfolio System

This is the part I'd make **very prominent** on your portfolio.

These aren't five random apps.

They demonstrate five different questions:

| Project         | Question                                                         |
| --------------- | ---------------------------------------------------------------- |
| **SIDEQUEST**   | What if AI encouraged people to **experience** more?             |
| **SYNESTHESIA** | What if AI could **translate creativity** between mediums?       |
| **FRAMEWORK**   | What if AI could learn someone's **personal visual taste**?      |
| **PATH**        | What if AI could determine **what to learn next**?               |
| **STEM**        | What if software could preserve the **creative process itself**? |

And the disciplines are deliberately different:

```text
                 YOUR CREATIVE TECHNOLOGY PORTFOLIO

                           AI
                            │
       ┌────────────────────┼────────────────────┐
       │                    │                    │
   EXPERIENCE          CREATIVITY            LEARNING
       │                    │                    │
   SIDEQUEST          SYNESTHESIA              PATH
       │
       │
   PHOTOGRAPHY                              MUSIC
       │                                      │
   FRAMEWORK                                  STEM
```

That gives the portfolio a coherent thesis:

> **I build technology around how humans create, learn, explore, and perceive—not just software for software's sake.**

That's a much stronger story for your admissions portfolio than five cards saying *"AI-powered app built with Next.js."*

---

# What Every Project's Portfolio Page Should Ultimately Contain

I'd standardize **all five** to this exact structure:

```text
01  HERO
    Project name
    One-line thesis
    Hero visual
    Status
    Stack

02  THE WHY
    Problem
    Motivation
    Original observation

03  THE IDEA
    Core concept
    Product philosophy

04  HOW IT WORKS
    System diagram
    User flow
    Architecture

05  DESIGN
    UI system
    Interaction decisions
    Important constraints

06  ENGINEERING
    Stack
    Architecture decisions
    Data model
    Code structure

07  THE HARD PART
    Most interesting technical/product problem

08  TRADE-OFFS
    What you considered
    What you chose
    Why

09  RESULTS
    Actual shipped capabilities
    Experiments
    Real metrics if available

10  WHAT I'D CHANGE
    Honest limitations
    Future iterations

11  ROADMAP
    V1 → V2 → V3

12  FAQ
    Short technical/product questions

13  LINKS
    Live project
    GitHub
    Demo
```

### And one rule I'd enforce across the entire portfolio:

**Never confuse "planned" with "built."**

For example, on Sidequest today:

> **Built:** Next.js, React 19, TypeScript, Tailwind v4, Supabase/Postgres/RLS, Resend, current UI/mock-data system.

> **In development:** Quest Engine, AI personalization, Memory.

> **Future:** deeper adaptive intelligence, Groups, etc.

That actually makes the case studies **more credible**. You're documenting the evolution of a real body of work rather than writing fictional postmortems for software that doesn't exist yet.

and additional informations:
Exactly. If we're treating the five projects as **fully completed portfolio pieces**, then we can write the case studies as finished products—not roadmaps—and give each one a clean project URL under `chiradeep.me` plus a GitHub placeholder.

I’d structure your portfolio like this:

| Project         | Type       | Live URL                   | GitHub                                 |
| --------------- | ---------- | -------------------------- | -------------------------------------- |
| **SIDEQUEST**   | Web app    | `sidequest.chiradeep.me`   | `github.com/ChiradeepFinn/sidequest`   |
| **SYNESTHESIA** | Mobile app | `synesthesia.chiradeep.me` | `github.com/ChiradeepFinn/synesthesia` |
| **FRAMEWORK**   | Web app    | `framework.chiradeep.me`   | `github.com/ChiradeepFinn/framework`   |
| **PATH**        | Web app    | `path.chiradeep.me`        | `github.com/ChiradeepFinn/path`        |
| **STEM**        | Music app  | `stem.chiradeep.me`        | `github.com/ChiradeepFinn/stem`        |

These are **placeholders** for the portfolio structure; replace them with the actual repository names/URLs when you publish. Your main portfolio remains [chiradeep.me](https://chiradeep.me?utm_source=chatgpt.com).

---

# 01 — SIDEQUEST

## Featured Project

### **SIDEQUEST**

> **Turn an ordinary day into something worth doing.**

An AI-powered exploration platform that transforms vague intentions into personalized real-world quests—from photography and writing to music, exploration, learning, and spontaneous creative challenges.

**Live:** `sidequest.chiradeep.me`
**GitHub:** `github.com/ChiradeepFinn/sidequest`

### Featured-card bullets

✦ Personalized real-world quests generated around interests, time, environment, and previous experiences.

✦ A structured quest engine combines deterministic constraints with AI generation to keep quests actionable, varied, and appropriate.

✦ An experience-memory system learns from completed quests rather than treating interaction as another endless content feed.

✦ Designed around a simple loop: **Discover → Do → Remember → Discover again.**

### Stack

`NEXT.JS` `REACT` `TYPESCRIPT` `TAILWIND CSS` `SUPABASE` `POSTGRESQL` `OPENAI` `MOTION` `RESEND`

---

# SIDEQUEST — CASE STUDY

### AI / Creative Technology / Human-Computer Interaction

## The Pitch

> **What if an AI assistant didn't tell you what to consume next—but gave you something worth doing?**

---

## 01 — The Problem

The modern recommendation system is exceptionally good at extending consumption.

Another video.

Another song.

Another post.

Another article.

Sidequest explores a different question:

> **What should I actually do next?**

The product converts an abstract desire for novelty or creativity into a concrete action that can happen outside the screen.

The interface is therefore deliberately lightweight. The product isn't supposed to become another destination where users spend hours.

---

## 02 — The Core Concept

Every Sidequest is a structured experience rather than simply an AI-generated paragraph.

A quest contains:

* activity
* category
* difficulty
* estimated time
* required materials
* environmental constraints
* creative objective
* optional variation
* completion state

The system can therefore reason about quests instead of treating them as unstructured text.

---

## 03 — Quest Architecture

```text
USER CONTEXT
     │
     ├── Interests
     ├── Available time
     ├── Environment
     ├── Previous quests
     ├── Skills
     └── Preferences
            │
            ▼
     CONTEXT BUILDER
            │
            ▼
      QUEST ENGINE
            │
      ┌─────┴─────┐
      │           │
Rules / Constraints
      │           │
      └─────┬─────┘
            ▼
        AI LAYER
            │
            ▼
     PERSONALIZED QUEST
            │
            ▼
       REAL-WORLD ACTION
            │
            ▼
        COMPLETION
            │
            ▼
          MEMORY
```

The important design decision is that **AI does not control the entire product**.

The quest engine establishes what is valid.

The AI provides variation and personalization.

---

## 04 — The Quest Loop

### Discover

The user receives an appropriate quest.

### Accept

The quest can be started immediately.

### Do

The user leaves the interface and performs the activity.

### Complete

The experience is recorded.

### Remember

The system extracts useful information from the experience.

### Return

Future quests become more relevant.

---

## 05 — Memory

Sidequest's memory isn't a traditional journal.

It records **experiences**.

```text
PHOTOGRAPHY
Street photography
→ Tried night photography
→ Preferred architecture
→ Experimented with reflections

MUSIC
→ Created first ambient loop
→ Interested in field recordings

SKILLS
→ Manual exposure
→ Sound design
→ Creative writing
```

This allows personalization to be based on what the user actually did.

---

## 06 — Product Design

The interface uses a warm pastel visual system:

* peach canvas
* off-white surfaces
* lilac
* butter
* sage
* cream
* near-black typography

Navigation:

```text
              TODAY    ✦    PROGRESS
```

The central action is **New Quest**.

Secondary areas:

* Explore
* Memory
* Groups
* Profile

The primary navigation intentionally stays minimal.

---

## 07 — Key Features

### Today

The primary experience.

Displays:

* current quest
* prompt
* category
* estimated time
* CTA
* supporting practices
* recent progress

### Explore

Browse quest categories and discover experiences outside the user's normal preferences.

### New Quest

Generate or select a personalized Sidequest.

### Progress

Tracks meaningful activity:

* quests completed
* skills attempted
* categories explored

### Memory

Stores experiences and discoveries.

### Groups

Supports collaborative Sidequests.

### Profile

Personal identity, settings, history, Memory, and Groups.

---

## 08 — Technical Stack

### Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS v4
* Motion
* Lenis

### Backend

* Supabase
* PostgreSQL
* Row Level Security
* Supabase Storage

### AI

* OpenAI API
* structured generation
* contextual prompting
* quest validation

### Communication

* Resend

### Deployment

* Vercel
* Supabase
* automated production deployments

---

## 09 — Architecture Decisions

### Why Next.js?

The product needs a fast web application, server-side functionality, API routes, and a strong component architecture.

### Why Supabase?

PostgreSQL provides relational storage while Supabase provides authentication, storage, APIs, and RLS without requiring a separate backend service.

### Why structured quests?

Because an AI response alone isn't a product architecture.

Structured quest objects make filtering, validation, personalization, analytics, and future recommendations possible.

---

## 10 — Code Structure

```text
app/
├── today/
├── explore/
├── progress/
├── memory/
├── groups/
├── profile/
└── api/

components/
├── quest/
├── navigation/
├── cards/
├── progress/
└── ui/

lib/
├── quest-engine/
├── ai/
├── memory/
├── data/
└── supabase/

supabase/
└── migrations/
```

---

## 11 — Hardest Problem

The hardest problem wasn't generating a quest.

It was determining whether the generated quest was **actually worth doing**.

The system therefore separates:

**generation → validation → personalization → presentation**

instead of blindly displaying an LLM response.

---

## 12 — Trade-offs

| Decision       | Chosen approach                             |
| -------------- | ------------------------------------------- |
| AI generation  | Structured around deterministic rules       |
| Navigation     | Minimal three-item primary nav              |
| Progress       | Meaningful activity instead of gamification |
| Memory         | Experience-oriented                         |
| UI             | Mobile-first                                |
| Data           | PostgreSQL                                  |
| Authentication | Supabase                                    |
| AI             | API-based generation                        |

---

## 13 — Results

The completed product demonstrates:

* personalized quest generation
* persistent user experience history
* structured quest architecture
* AI-assisted personalization
* responsive web application
* mobile-first interaction design
* collaborative quest infrastructure
* production database with RLS

---

## 14 — What I'd Change

If rebuilding Sidequest:

* stronger contextual intelligence
* richer offline support
* better quest-difficulty calibration
* deeper preference modeling
* more sophisticated group quests
* adaptive multi-step quest chains

---

# 02 — SYNESTHESIA

## Featured Project

### **SYNESTHESIA**

> **Turn one form of creativity into another.**

A multimodal creative platform that interprets photographs, music, writing, and other creative artifacts across mediums.

**Live:** `synesthesia.chiradeep.me`
**GitHub:** `github.com/ChiradeepFinn/synesthesia`

### Featured-card bullets

✦ Transforms creative work between image, sound, text, and other media through multimodal AI interpretation.

✦ Transformation chains allow one creative artifact to become the source for another.

✦ Interpretation Battles let multiple people create competing interpretations of the same source.

✦ Preserves the complete transformation history so every generated artifact has a creative lineage.

### Stack

`EXPO` `REACT NATIVE` `TYPESCRIPT` `SUPABASE` `OPENAI` `EXPO AV` `REANIMATED`

---

# SYNESTHESIA — CASE STUDY

## The Pitch

> **What if a photograph could become a song, and that song could become a story?**

---

## 01 — The Problem

Creative software traditionally separates disciplines.

Photographers use image tools.

Musicians use audio tools.

Writers use writing tools.

Synesthesia treats those boundaries as an opportunity.

The project explores whether AI can act as a **creative translator** between mediums.

---

## 02 — The Transformation Model

```text
SOURCE
  ↓
MEDIA ANALYSIS
  ↓
SEMANTIC REPRESENTATION
  ↓
AI INTERPRETATION
  ↓
TARGET MEDIUM
```

The system doesn't perform a literal conversion.

It interprets:

* atmosphere
* rhythm
* color
* composition
* emotion
* intensity
* structure

and reconstructs those qualities in another medium.

---

## 03 — Transformation Chains

```text
PHOTO
 ↓
MUSIC
 ↓
TEXT
 ↓
IMAGE
 ↓
MUSIC
```

Every transformation introduces a new interpretation.

This creates an evolving creative artifact.

---

## 04 — Interpretation Battles

Two people receive the same source.

Each creates an interpretation.

```text
             ORIGINAL
             /      \
            /        \
       PERSON A    PERSON B
          ↓            ↓
   INTERPRETATION A  INTERPRETATION B
          \            /
           \          /
            COMPARISON
```

The resulting comparison becomes part of the artwork.

---

## 05 — Mobile UX

Primary flow:

```text
Create
  ↓
Select medium
  ↓
Upload / Record
  ↓
Choose transformation
  ↓
Generate
  ↓
Reveal
  ↓
Remix
```

The UI is deliberately visual and gesture-friendly.

---

## 06 — Technical Architecture

```text
React Native
     ↓
Media Upload
     ↓
Supabase Storage
     ↓
Media Analysis
     ↓
AI Interpretation
     ↓
Generation Pipeline
     ↓
Output Storage
     ↓
Transformation Graph
```

---

## 07 — Data Model

```text
Creation
├── source
├── medium
├── metadata
└── transformations

Transformation
├── sourceId
├── targetMedium
├── model
├── parameters
├── outputId
└── createdAt

Chain
└── ordered transformations
```

---

## 08 — Stack

* Expo
* React Native
* TypeScript
* Expo Router
* Supabase
* PostgreSQL
* Supabase Storage
* OpenAI
* Expo Audio
* React Native Reanimated

---

## 09 — Hardest Problem

The core challenge was finding a useful **intermediate representation** between fundamentally different creative mediums.

The system therefore separates:

**media → semantic interpretation → target generation**

instead of trying to directly convert one file format into another.

---

## 10 — Trade-offs

**Fidelity vs creativity**

A perfect translation may be boring.

**Control vs surprise**

Too much control removes the interesting part of generative interpretation.

**Consistency vs randomness**

Creative transformation benefits from some unpredictability.

---

## 11 — Results

The completed application supports:

* multimodal input
* cross-medium transformation
* transformation chains
* creative history
* interpretation battles
* remixing
* persistent artifacts

---

## 12 — What I'd Change

* longer transformation chains
* collaborative rooms
* richer audio generation
* model comparison
* user-controlled interpretation intensity
* public exhibitions

---

# 03 — FRAMEWORK

## Featured Project

### **FRAMEWORK**

> **AI that learns how you see.**

An AI-assisted photography workspace that helps photographers select, organize, sequence, and understand large image collections.

**Live:** `framework.chiradeep.me`
**GitHub:** `github.com/ChiradeepFinn/framework`

### Featured-card bullets

✦ Computer vision analyzes large image collections for technical and semantic signals.

✦ The selection system learns from the photographer's choices rather than applying a universal definition of a "good" photograph.

✦ Automatic clustering reduces hundreds of photographs into meaningful visual groups.

✦ Sequencing tools transform selected photographs into coherent visual stories.

### Stack

`NEXT.JS` `REACT` `TYPESCRIPT` `TAILWIND CSS` `SUPABASE` `POSTGRESQL` `OPENAI` `COMPUTER VISION`

---

# FRAMEWORK — CASE STUDY

## The Pitch

> **The difficult part of photography isn't taking 500 photographs. It's knowing which five matter.**

---

## 01 — Problem

Digital photography makes capture cheap.

Selection remains expensive.

A photographer may return with hundreds of images containing:

* duplicates
* technically weak frames
* alternate compositions
* similar moments
* completely different visual directions

Framework focuses on the **selection problem**.

---

## 02 — Workflow

```text
IMPORT
  ↓
ANALYZE
  ↓
CLUSTER
  ↓
RANK
  ↓
SELECT
  ↓
SEQUENCE
  ↓
EXPORT
```

---

## 03 — Computer Vision

The system evaluates multiple dimensions.

### Technical

* sharpness
* exposure
* noise
* blur
* image quality

### Visual

* composition
* color
* contrast
* structure

### Semantic

* people
* architecture
* objects
* environments

The system intentionally avoids reducing these dimensions to one arbitrary "quality score."

---

## 04 — Learning Personal Taste

This is Framework's defining feature.

A generic model might say:

> "Image A has better technical quality."

The photographer might choose Image B.

That choice is valuable information.

```text
AI recommendation
       ↓
Photographer decision
       ↓
Preference signal
       ↓
Personal taste model
       ↓
Improved recommendation
```

---

## 05 — Selection Interface

The workspace provides:

* contact sheets
* shortlist
* reject
* favorite
* comparison
* keyboard navigation
* AI recommendations

AI explanations provide context instead of pretending artistic decisions are objective.

---

## 06 — Sequencing

After selection, Framework can arrange photographs based on:

* visual continuity
* color
* subject
* composition
* pacing
* narrative transition

The result is a visual story rather than simply a ranking.

---

## 07 — Architecture

```text
Upload
 ↓
Image Processing
 ↓
Vision Analysis
 ↓
Feature Store
 ↓
Clustering
 ↓
Recommendation
 ↓
User Feedback
 ↓
Preference Model
```

---

## 08 — Stack

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS
* Supabase
* PostgreSQL
* Supabase Storage
* OpenAI
* computer vision pipeline
* Sharp
* Vercel

---

## 09 — Data Model

```text
Shoot
├── Images
│   ├── Metadata
│   ├── Vision features
│   └── Preference signals
│
├── Selections
└── Sequences
```

---

## 10 — Hardest Problem

The hardest question was:

> **Can software learn artistic preference without pretending that artistic preference is objective?**

Framework therefore treats recommendations as **decision support**, not truth.

---

## 11 — Results

The completed system supports:

* large photo imports
* image analysis
* visual clustering
* personalized selection
* comparison
* sequencing
* preference learning
* visual-story creation

---

## 12 — What I'd Change

* RAW-native workflow
* Lightroom integration
* more sophisticated personal embeddings
* contact-sheet automation
* collaborative curation
* gallery publishing

---

# 04 — PATH

## Featured Project

### **PATH**

> **Stop asking what to learn. Start knowing what to do next.**

A personalized learning system that turns broad goals into adaptive learning paths, mapped resources, practical projects, and concrete next actions.

**Live:** `path.chiradeep.me`
**GitHub:** `github.com/ChiradeepFinn/path`

### Featured-card bullets

✦ Represents learning as a dependency graph instead of a linear course playlist.

✦ Connects concepts to books, courses, papers, documentation, exercises, and projects.

✦ A personalized **WHAT NOW?** engine determines the learner's next useful action.

✦ Adapts paths based on completed concepts, demonstrated skills, goals, and project progress.

### Stack

`NEXT.JS` `REACT` `TYPESCRIPT` `TAILWIND CSS` `SUPABASE` `POSTGRESQL` `OPENAI`

---

# PATH — CASE STUDY

## The Pitch

> **The internet doesn't have a shortage of learning resources. It has a shortage of direction.**

---

## 01 — Problem

Search:

> "How do I learn machine learning?"

You get:

* courses
* videos
* books
* tutorials
* roadmaps
* papers
* bootcamps

The problem isn't discovering resources.

It's deciding:

> **What should I do next?**

---

## 02 — Learning Graph

Instead of:

```text
Course 1
 ↓
Lesson 1
 ↓
Lesson 2
 ↓
Lesson 3
```

Path uses:

```text
Concept
 ↓
Prerequisite
 ↓
Skill
 ↓
Project
 ↓
Application
```

Example:

```text
Python
 ├── Programming fundamentals
 │      ↓
 │   Data structures
 │      ↓
 │   Algorithms
 │
 └── Mathematics
        ↓
     Statistics
        ↓
   Machine Learning
```

---

## 03 — WHAT NOW?

The defining feature.

The engine evaluates:

* goal
* current knowledge
* completed concepts
* prerequisites
* resources
* current project
* recent activity

and produces:

> **One useful next action.**

Example:

> Implement binary search from scratch and test it against five edge cases.

rather than:

> "Study algorithms."

---

## 04 — Resource Mapping

Resources become attached to learning nodes.

```text
Machine Learning
├── Course
├── Book
├── Documentation
├── Paper
├── Exercise
└── Project
```

This prevents the resource itself from becoming the learning objective.

---

## 05 — Architecture

```text
USER GOAL
   ↓
GOAL DECOMPOSITION
   ↓
LEARNING GRAPH
   ↓
PREREQUISITY ANALYSIS
   ↓
RESOURCE MAPPING
   ↓
PROGRESS
   ↓
WHAT NOW?
```

---

## 06 — Technical Stack

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS
* Supabase
* PostgreSQL
* OpenAI
* Vercel

---

## 07 — Data Model

```text
User
├── Goals
├── Skills
├── Learning Paths
│   ├── Nodes
│   ├── Relationships
│   └── Resources
└── Progress
```

A learning node:

```ts
LearningNode {
  id
  title
  type
  difficulty
  prerequisites
  resources
}
```

---

## 08 — Design

The interface prioritizes:

* one current objective
* visual learning graph
* contextual resources
* progress
* next action

Rather than presenting the learner with a giant dashboard.

---

## 09 — Hardest Problem

The system needs to balance:

**structure vs freedom.**

Too much structure becomes another rigid curriculum.

Too little structure becomes another search engine.

Path sits between the two.

---

## 10 — Results

The completed product supports:

* personalized goals
* learning graphs
* prerequisite relationships
* resource mapping
* project-based learning
* adaptive recommendations
* WHAT NOW?

---

## 11 — What I'd Change

* skill verification
* project evaluation
* stronger prerequisite inference
* calendar integration
* collaborative learning
* deeper long-term personalization

---

# 05 — STEM

## Featured Project

### **STEM**

> **A workspace for the messy process behind a song.**

A music-production workspace that treats every version, vocal take, mix, reference, experiment, and creative decision as part of the song's history.

**Live:** `stem.chiradeep.me`
**GitHub:** `github.com/ChiradeepFinn/stem`

### Featured-card bullets

✦ Version-based song development preserves the complete evolution of a track.

✦ Vocal takes, mixes, stems, references, and notes stay connected to the song rather than scattered across folders.

✦ Creative decisions remain attached to the versions where they happened.

✦ AI-assisted analysis helps compare takes, mixes, arrangements, and production decisions without replacing the musician.

### Stack

`NEXT.JS` `REACT` `TYPESCRIPT` `TAILWIND CSS` `SUPABASE` `POSTGRESQL` `WEB AUDIO API` `OPENAI`

---

# STEM — CASE STUDY

## The Pitch

> **Songs aren't created in one file. They're created through hundreds of decisions.**

---

## 01 — Problem

A song project can become:

```text
demo.wav
demo2.wav
new chorus.wav
final.wav
final2.wav
final-final.wav
actual-final.wav
```

The file system knows that seven files exist.

It doesn't know **why** they exist.

STEM treats the creative process itself as data.

---

## 02 — Song Architecture

```text
SONG
│
├── IDEAS
├── INSTRUMENTALS
├── VOCALS
├── MIXES
├── MASTERS
├── REFERENCES
└── DECISIONS
```

Everything remains connected to the same project.

---

## 03 — Version History

```text
Song
│
├── v01 — initial demo
├── v02 — new drums
├── v03 — chorus rewrite
├── v04 — vocal replacement
├── v05 — mix revision
└── v06 — current
```

Instead of deleting history, STEM preserves it.

---

## 04 — Creative Decisions

Each version can contain contextual notes.

For example:

> Removed the second synth from the chorus because the arrangement felt too crowded.

or:

> Kept this vocal take because the emotional delivery felt stronger despite the imperfect timing.

Those decisions become part of the song's history.

---

## 05 — Audio Workspace

```text
┌─────────────────────────────────┐
│ SONG TITLE                      │
├─────────────────────────────────┤
│                                 │
│           WAVEFORM              │
│                                 │
├─────────────────────────────────┤
│ v01  v02  v03  v04  v05        │
├─────────────────────────────────┤
│ Vocals | Mix | References | Notes│
└─────────────────────────────────┘
```

---

## 06 — AI Assistance

AI can assist with:

### Vocal analysis

* pitch
* timing
* dynamics
* take comparison

### Mix analysis

* frequency balance
* dynamics
* stereo field
* clipping
* loudness

### Arrangement

* section density
* repetition
* structure

### Version comparison

> What changed between version 3 and version 5?

The musician remains the creative authority.

---

## 07 — Architecture

```text
NEXT.JS
   ↓
SONG WORKSPACE
   ↓
SUPABASE
   ├── Projects
   ├── Versions
   ├── Audio
   ├── Notes
   └── References
          ↓
      WEB AUDIO
          ↓
       AI LAYER
```

---

## 08 — Stack

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS
* Supabase
* PostgreSQL
* Supabase Storage
* Web Audio API
* OpenAI
* Vercel

---

## 09 — Data Model

```text
User
└── Projects
     └── Song
          ├── Versions
          │    ├── Audio
          │    ├── Notes
          │    └── Decisions
          │
          ├── Vocal Takes
          ├── Mixes
          └── References
```

---

## 10 — Hardest Problem

The hardest problem wasn't storing audio.

It was preserving **creative context**.

A waveform tells you what happened.

A decision record tells you **why** it happened.

STEM combines both.

---

## 11 — Results

The completed product supports:

* song workspaces
* audio upload
* version history
* audio playback
* waveform visualization
* vocal organization
* mix comparison
* reference tracks
* creative notes
* AI-assisted analysis

---

## 12 — What I'd Change

* DAW integrations
* stem-level management
* advanced waveform editing
* collaborative sessions
* richer audio intelligence
* mobile companion
* automatic session summaries

---

# Portfolio-Level Project Index

This is how I'd present them on **chiradeep.me**:

### **01 — Sidequest**

**AI that gives you something worth doing.**

`AI · Creative Technology · HCI`

`sidequest.chiradeep.me`

---

### **02 — Synesthesia**

**Turning one form of creativity into another.**

`AI · Generative Media · Mobile`

`synesthesia.chiradeep.me`

---

### **03 — Framework**

**AI that learns how you see.**

`Computer Vision · Photography · AI`

`framework.chiradeep.me`

---

### **04 — Path**

**A learning system that always tells you what to do next.**

`AI · Education · Knowledge Systems`

`path.chiradeep.me`

---

### **05 — STEM**

**A workspace for the process behind a song.**

`Music Technology · Audio · Creative Tools`

`stem.chiradeep.me`

---

# The common case-study footer

I'd also make the end of **every project page** identical:

```text
Want to see how it was built?

[ VIEW LIVE PROJECT ↗ ]
[ VIEW SOURCE ↗ ]

────────────────────────────────

Next project

SYNESTHESIA →
```

Then the final global footer:

> **Built, broken, redesigned, and built again.**

**Chiradeep**
AI · Software · Music · Photography · Writing

[chiradeep.me](https://chiradeep.me?utm_source=chatgpt.com)

---

## One important thing about the "pretend completed" instruction

For the **portfolio copy**, this is exactly the right way to work: write the intended final case studies first so you know what evidence each project needs.

But when you actually publish the portfolio, keep a hard distinction between:

**Built → tested → measured → planned.**

Especially for an admissions portfolio, a case study saying *"I built X, encountered Y, chose Z, measured A"* is vastly more convincing than a giant technology list. Your five projects already give you a strong narrative:

> **Sidequest — how people experience**
> **Synesthesia — how ideas transform**
> **Framework — how people perceive**
> **Path — how people learn**
> **STEM — how people create**

That is the portfolio story I'd build the entire **Projects** section around.
