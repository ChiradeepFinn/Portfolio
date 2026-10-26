import type { ResearchPaper } from '@/lib/types';

/**
 * Authored research catalog.
 *
 * The archive and the two study pages read from here. Short rows for the
 * homepage seed are derived at the bottom so the title, status, and question
 * cannot drift.
 *
 * Nothing in this file is a publication. There are no venues, DOIs,
 * affiliations, collaborators, or scored results: those were not in the
 * project record, so they are not invented here.
 */

export type ResearchStatus = 'In progress' | 'Done';
export type ResearchFigure = 'valence' | 'ideation';

export type ResearchBlock =
  | { readonly type: 'prose'; readonly paragraphs: readonly string[] }
  | { readonly type: 'callout'; readonly kicker: string; readonly text: string }
  | { readonly type: 'list'; readonly items: readonly string[] }
  | {
      readonly type: 'questions';
      readonly provisional: boolean;
      readonly note: string | null;
      readonly items: readonly { readonly id: string; readonly text: string }[];
    }
  | { readonly type: 'ordered'; readonly items: readonly { readonly title: string; readonly detail: string }[] }
  | { readonly type: 'definitions'; readonly items: readonly { readonly term: string; readonly detail: string }[] }
  | {
      readonly type: 'table';
      readonly caption: string;
      readonly columns: readonly string[];
      readonly rows: readonly (readonly string[])[];
    }
  | {
      readonly type: 'cards';
      readonly items: readonly { readonly kicker: string; readonly title: string; readonly body: string }[];
    }
  | {
      readonly type: 'records';
      readonly items: readonly { readonly label: string; readonly value: string; readonly href?: string }[];
    }
  | {
      readonly type: 'columns';
      readonly file: string;
      readonly rowsLabel: string;
      readonly names: readonly string[];
      readonly note: string;
    }
  | { readonly type: 'pending'; readonly kicker: string; readonly text: string };

export interface ResearchSection {
  readonly id: string;
  readonly label: string;
  readonly blocks: readonly ResearchBlock[];
}

export interface ResearchFact {
  readonly label: string;
  readonly value: string;
}

export interface ResearchStudy {
  readonly slug: string;
  readonly index: string;
  /** Shorter title for cards. Detail pages keep `title` verbatim. */
  readonly displayTitle: string;
  readonly title: string;
  readonly status: ResearchStatus;
  readonly featured: boolean;
  readonly domains: readonly string[];
  readonly question: string;
  readonly progress: string;
  readonly summary: string;
  readonly overviewLabel: string;
  readonly overview: string;
  readonly overviewNote: string | null;
  readonly figure: ResearchFigure;
  /** Compact facts for previews. Detail pages carry the full sections. */
  readonly previewFacts: readonly ResearchFact[];
  readonly sections: readonly ResearchSection[];
}

const musicEmotionTitle =
  'Beyond Genre Classification: Evaluating Machine Learning Models for Music Emotion Recognition Across Instrumental and Vocal Audio';

const assistedIdeationTitle =
  'Beyond the Prompt: Measuring the Effects of AI-Assisted Ideation on Human Creative Originality and Ownership';

export const researchStudies: readonly ResearchStudy[] = [
  {
    slug: 'music-emotion-recognition',
    index: '02',
    displayTitle: 'Emotion across instrumental and vocal audio',
    title: musicEmotionTitle,
    status: 'In progress',
    featured: true,
    domains: [
      'Music information retrieval',
      'Machine learning',
      'Music emotion recognition',
      'Comparative model evaluation',
    ],
    question:
      'How does music emotion recognition differ between instrumental audio and music that includes vocals?',
    progress:
      'Planning and literature review. The DEAM audio, annotations, and features are downloaded. They are not validated, cleaned, or ready for training.',
    summary:
      'A study in progress on whether music emotion recognition treats instrumental audio and vocal audio differently. The DEAM files are downloaded. They are not validated for training, and no models have been run.',
    overviewLabel: 'Research overview',
    overview:
      'I want to know whether music emotion recognition changes when the audio is instrumental and when it contains vocals. DEAM is the candidate dataset. I have the audio archive, the annotations archive, and the features archive. I have not validated them against each other, and I have not trained a model. This overview is the shape of the investigation, not an abstract of a finished experiment.',
    overviewNote: 'Research overview. Not a completed empirical abstract.',
    figure: 'valence',
    previewFacts: [
      { label: 'Stage', value: 'In progress' },
      { label: 'Dataset', value: 'DEAM, downloaded. Not validated for training.' },
      { label: 'Method', value: 'Proposed. No models have been run.' },
    ],
    sections: [
      {
        id: 'motivation',
        label: 'Motivation',
        blocks: [
          {
            type: 'prose',
            paragraphs: [
              'Music emotion recognition tries to estimate affective character from audio. The comparison I care about is instrumental music against music that includes vocals. I am not starting from the idea that vocals help a model, or that they hurt it. Vocal presence is the thing to test.',
              'Genre labels and emotion labels are different jobs. A model that sorts music by genre is not, by that fact, a model of emotion. This investigation stays with emotion.',
            ],
          },
          {
            type: 'callout',
            kicker: 'Background, not a result',
            text: 'The points below are reasons to run the comparison. They are not discoveries from my own experiments. Those experiments have not been run.',
          },
          {
            type: 'list',
            items: [
              'Instrumental and vocal music may carry feeling through different acoustic and musical cues.',
              'A model can learn different representations from the data and the features it is trained on.',
              'What is in a dataset, and how the evaluation is set up, can change the number a paper reports.',
              'Genre classification and emotion recognition must not be treated as the same prediction task.',
            ],
          },
        ],
      },
      {
        id: 'questions',
        label: 'Questions',
        blocks: [
          {
            type: 'questions',
            provisional: true,
            note: 'Provisional, until the literature review and the research design are fixed.',
            items: [
              {
                id: 'RQ1',
                text: 'How does music emotion recognition performance differ between instrumental and vocal audio under a consistent evaluation protocol?',
              },
              {
                id: 'RQ2',
                text: 'Do different machine-learning model families show different performance patterns across instrumental and vocal subsets?',
              },
              {
                id: 'RQ3',
                text: 'To what extent do the findings depend on audio representations, dataset composition, and the chosen emotion-evaluation metrics?',
              },
            ],
          },
        ],
      },
      {
        id: 'dataset',
        label: 'Dataset',
        blocks: [
          {
            type: 'prose',
            paragraphs: [
              'DEAM is the candidate dataset I have acquired. Three archives are downloaded: audio, annotations, and features. Downloaded is not the same as checked. I have not shown that every annotation has a usable audio file, or that the feature files match the songs I would actually train on.',
            ],
          },
          {
            type: 'columns',
            file: 'annotations/annotations averaged per song/song_level/static_annotations_averaged_songs_1_2000.csv',
            rowsLabel: 'The inspected file has 1,744 rows and five columns.',
            names: ['song_id', ' valence_mean', ' valence_std', ' arousal_mean', ' arousal_std'],
            note: 'Shown in quotes so a leading space stays visible. The quote marks are not part of the header. Four headers in the file begin with a space. This page does not rename them. If a later script strips or renames those columns, that transformation has to be written down beside the original names.',
          },
          {
            type: 'prose',
            paragraphs: [
              'The song-level annotations are valence and arousal: a mean and a standard deviation on each. They are not categorical emotion labels. I will not treat them as categories unless a specific mapping is justified and documented.',
              'The version, the source URL, and the acquisition date are not recorded on this page. Neither is a citation. I still need to confirm the dataset terms, what the citation requires, and what I am allowed to redistribute before any audio or derived file is published.',
            ],
          },
          {
            type: 'callout',
            kicker: 'Checks still open',
            text: 'None of the following is done. Listing a check here is not a claim that it passed.',
          },
          {
            type: 'definitions',
            items: [
              {
                term: 'Audio and annotation ids',
                detail:
                  'Match song ids to files. Do not assume every annotation has a usable audio file, or that every feature file belongs in every condition.',
              },
              {
                term: 'File integrity',
                detail:
                  'Look for duplicates, missing values, duration, sample rate, and files that do not open.',
              },
              {
                term: 'Vocal or instrumental',
                detail:
                  'A song is not vocal or instrumental until a rule for that label has been stated and checked. The filename is not that rule.',
              },
              {
                term: 'Precomputed features',
                detail:
                  'Find out whether the features archive is precomputed, and whether the extraction procedure is documented.',
              },
            ],
          },
          {
            type: 'records',
            items: [
              { label: 'Dataset', value: 'DEAM, candidate, acquired' },
              { label: 'Audio archive', value: 'Downloaded' },
              { label: 'Annotations archive', value: 'Downloaded' },
              { label: 'Features archive', value: 'Downloaded' },
              { label: 'Version', value: 'Not recorded' },
              { label: 'Source', value: 'Not recorded' },
              { label: 'Acquisition date', value: 'Not recorded' },
              { label: 'Citation', value: 'Not yet available' },
            ],
          },
        ],
      },
      {
        id: 'method',
        label: 'Proposed method',
        blocks: [
          {
            type: 'callout',
            kicker: 'Proposed, not completed',
            text: 'This is the order of work. Model families and the experimental design stay unset until the literature review and a feasibility check. No stage below has been finished.',
          },
          {
            type: 'ordered',
            items: [
              {
                title: 'Literature review and research-gap refinement',
                detail:
                  'Read far enough to say what this comparison still has to make precise, including how other work has treated vocal presence.',
              },
              {
                title: 'Dataset inspection and provenance documentation',
                detail:
                  'Record the DEAM version, source, acquisition date, and what each archive actually contains.',
              },
              {
                title: 'Audio and annotation integrity validation',
                detail:
                  'Match ids, then check duplicates, missing values, duration, sample rate, and whether the files open.',
              },
              {
                title: 'Instrumental-versus-vocal classification protocol',
                detail:
                  'Write the rule that calls a track instrumental or vocal, then test the rule. Do not assume the split already exists.',
              },
              {
                title: 'Song-level or segment-level analysis units',
                detail:
                  'Choose the unit. The annotations I have inspected are song-level. A segment-level design would need its own justification.',
              },
              {
                title: 'Reproducible baselines',
                detail:
                  'Choose model families after the review, not before. They get named in the experiment config once they are chosen.',
              },
              {
                title: 'Train, validation, and test partitions',
                detail:
                  'Keep related audio from the same song on one side of the split. Write down the procedure and the random seeds.',
              },
              {
                title: 'Training or evaluation under one protocol',
                detail:
                  'Use the same representations, the same splits, and the same metrics on the instrumental subset, the vocal subset, and the full set.',
              },
              {
                title: 'Overall performance and subgroup differences',
                detail:
                  'Compare subsets only after the protocol is fixed. A difference is something to measure, not a premise.',
              },
              {
                title: 'Robustness checks and error analysis',
                detail:
                  'Ask what changes under the documented alternatives: features, metrics, and the vocal or instrumental rule.',
              },
              {
                title: 'Limitations and reproducibility artifacts',
                detail:
                  'Write what the data cannot support, and keep the environment, configs, seeds, and logs with the code.',
              },
            ],
          },
        ],
      },
      {
        id: 'evaluation',
        label: 'Evaluation plan',
        blocks: [
          {
            type: 'prose',
            paragraphs: [
              'The target representation and the metric are not the same choice. DEAM’s song-level file gives continuous valence and arousal. A regression metric answers a different question than a classification metric, and classification would first need a documented map onto categories.',
              'Related excerpts from the same song should not fall on both sides of a split. I would rather separate by song. The split procedure and the random seeds have to be recorded. Preprocessing, feature selection, and any learned transform stay inside the training data. None of this has been run.',
            ],
          },
          {
            type: 'callout',
            kicker: 'Not a finalized protocol',
            text: 'These are candidate approaches. Choosing one, and rejecting the others, waits on the literature review and on what the files will support.',
          },
          {
            type: 'definitions',
            items: [
              {
                term: 'Regression on valence and arousal',
                detail:
                  'Fits the annotations as they are: continuous means, with a standard deviation beside each mean.',
              },
              {
                term: 'Classification',
                detail:
                  'Only if a mapping from valence and arousal onto categories is justified and written down. The inspected file does not contain those categories.',
              },
              {
                term: 'MAE and RMSE',
                detail: 'Candidate regression metrics. Not yet selected as the protocol.',
              },
              {
                term: 'Correlation',
                detail:
                  'A candidate where the question is about agreement rather than absolute error. Not yet selected.',
              },
              {
                term: 'Uncertainty',
                detail:
                  'Confidence intervals, or another estimate that matches the final design. Nothing has been computed.',
              },
              {
                term: 'Subgroup comparison',
                detail:
                  'Vocal against instrumental, under the same protocol, after the split rule itself has been checked.',
              },
            ],
          },
        ],
      },
      {
        id: 'results',
        label: 'Results',
        blocks: [
          {
            type: 'pending',
            kicker: 'No results yet',
            text: 'Model training, statistical analysis, and the final experiments have not been done. There is no best model to name, and this page does not carry a sample score or a placeholder chart. When real plots, tables, and findings exist, they replace this note. The section stays where it is.',
          },
        ],
      },
      {
        id: 'limitations',
        label: 'Limitations',
        blocks: [
          {
            type: 'prose',
            paragraphs: [
              'These are limits I already have to plan around. They are not lessons from a finished run.',
            ],
          },
          {
            type: 'definitions',
            items: [
              {
                term: 'Coverage and label noise',
                detail:
                  'A song-level mean can hide disagreement. The standard deviation columns are a clue to that, not a cleaned label.',
              },
              {
                term: 'Vocal or instrumental labels',
                detail:
                  'Until the classification rule is tested, a subset result would rest on a split I do not yet trust.',
              },
              {
                term: 'Generalization',
                detail:
                  'A result on DEAM would describe DEAM. It would not, by itself, describe another catalog or a live performance.',
              },
              {
                term: 'Confounds',
                detail:
                  'Genre, language, production, duration, and instrumentation can move together with vocal presence. They have to be looked at, not assumed away.',
              },
              {
                term: 'Song-level valence and arousal',
                detail:
                  'One pair of values for a whole song cannot describe a change of feeling inside the song.',
              },
              {
                term: 'Model and compute limits',
                detail:
                  'What I train will be limited by what I can run and still document. That constraint is part of the design, not a footnote to add later.',
              },
              {
                term: 'Licensing',
                detail:
                  'Terms, citation requirements, and redistribution limits have to be checked before any data or derived file is published.',
              },
            ],
          },
        ],
      },
      {
        id: 'record',
        label: 'Reproducibility',
        blocks: [
          {
            type: 'prose',
            paragraphs: [
              'A link appears here only when the destination exists. Until then the item stays labelled, with nowhere to click.',
            ],
          },
          {
            type: 'records',
            items: [
              { label: 'GitHub repository', value: 'Not yet available' },
              { label: 'Environment and dependencies', value: 'Not yet available' },
              { label: 'Configuration files and random seeds', value: 'Not yet available' },
              { label: 'Dataset provenance and citation', value: 'Not yet available' },
              { label: 'Experiment logs', value: 'Not yet available' },
              { label: 'Manuscript PDF', value: 'Not yet available' },
              { label: 'References', value: 'Not yet available' },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'ai-assisted-creativity',
    index: '01',
    displayTitle: 'AI-assisted ideation, originality, and ownership',
    title: assistedIdeationTitle,
    status: 'Done',
    featured: false,
    domains: [
      'Human–AI interaction',
      'Computational creativity',
      'Generative AI',
      'Creative cognition and perceived ownership',
    ],
    question:
      'How does AI-assisted ideation change the originality of human creative work, and the sense of owning it?',
    progress:
      'Empirical study and evaluation framework completed. Originality, self-reported ownership, and perceived agency were measured across unaided and AI-assisted conditions.',
    summary:
      'A completed comparison of unaided and AI-assisted ideation. Originality, perceived ownership, and perceived agency were measured as separate things. Scored tables are not printed on this page.',
    overviewLabel: 'Study overview',
    overview:
      'This study is finished. I compared work made by unaided ideation with work made when a generative model could offer ideas. The tasks shared their instructions, their time limits, and their output requirements. Originality of the artifact, the participant’s sense of ownership, and their sense of agency were measured apart from each other, and the amount of model use was logged rather than assumed. What follows is the design, the measures, and the structure of the findings.',
    overviewNote:
      'Completed investigation. Done means the study was carried out. It does not name a venue, a DOI, or an affiliation.',
    figure: 'ideation',
    previewFacts: [
      { label: 'Stage', value: 'Done' },
      { label: 'Measures', value: 'Originality, ownership, and agency, kept apart.' },
      {
        label: 'Record',
        value: 'Completed study. No venue, DOI, or affiliation is on file.',
      },
    ],
    sections: [
      {
        id: 'motivation',
        label: 'Motivation',
        blocks: [
          {
            type: 'prose',
            paragraphs: [
              'A generative model can offer ideas during creative work. I compared unaided ideation with AI-assisted ideation, and kept five things apart: the originality of the artifact, the originality of a person’s contribution, perceived ownership, perceived agency, and the amount and kind of assistance.',
            ],
          },
        ],
      },
      {
        id: 'questions',
        label: 'Questions',
        blocks: [
          {
            type: 'questions',
            provisional: false,
            note: null,
            items: [
              {
                id: 'RQ1',
                text: 'How does access to AI-assisted ideation affect the measured originality of human creative outputs compared with unaided ideation?',
              },
              {
                id: 'RQ2',
                text: 'How does AI assistance relate to participants’ perceived ownership of, and agency over, their creative work?',
              },
              {
                id: 'RQ3',
                text: 'How do the degree of AI involvement and the nature of the creative task relate to originality and perceived ownership?',
              },
            ],
          },
        ],
      },
      {
        id: 'design',
        label: 'Study design',
        blocks: [
          {
            type: 'prose',
            paragraphs: [
              'Participants completed the same creative tasks under unaided ideation, with no model, or AI-assisted ideation, where a generative model could contribute ideas. Instructions, time limits, and output requirements were shared. The assisted condition logged prompt count, prompting depth, idea adoption, and edit distance. After the task, participants reported ownership, agency, and creative control. Originality was scored independently and double-blind. Semantic and structural similarity were recorded beside that score, not in place of it.',
            ],
          },
        ],
      },
      {
        id: 'measurement',
        label: 'Measurement',
        blocks: [
          {
            type: 'prose',
            paragraphs: [
              'Each construct had its own instrument. A similarity number is not an originality rating, and a self-report of ownership is not either of those. The sources below are the instruments written for this study. No external scale is cited here, because none is named in the study record.',
            ],
          },
          {
            type: 'definitions',
            items: [
              {
                term: 'Human-rated originality',
                detail:
                  'The study rubric, applied independently and double-blind, on novelty, complexity, and structural coherence. Source: the evaluation rubric.',
              },
              {
                term: 'Similarity distance',
                detail:
                  'Semantic and structural distance, kept as a supplementary indicator. It does not replace the human rating. Source: the same scoring pass as the rubric.',
              },
              {
                term: 'Ownership, agency, and control',
                detail:
                  'Post-task self-report of perceived ownership, creative agency, and personal locus of control. Creative satisfaction was collected with that set and was not folded into the originality score. Source: the study questionnaires.',
              },
              {
                term: 'Interaction log',
                detail:
                  'Prompt count, idea-adoption rate, edit distance, and prompting depth. These describe the assistance. They are not a quality score. Source: the session log.',
              },
            ],
          },
        ],
      },
      {
        id: 'findings',
        label: 'Findings',
        blocks: [
          {
            type: 'prose',
            paragraphs: [
              'The study was carried out. Artifacts from both conditions were scored on the same double-blind rubric, and ownership, agency, control, and satisfaction were reported against how heavily the model was used. Assistance was split by prompt count, prompting depth, idea adoption, and edit distance, not treated as on or off.',
              'The scored results are not in the portfolio record. This page does not state a sample size, a mean, a direction, or an interval.',
            ],
          },
        ],
      },
      {
        id: 'ethics',
        label: 'Ethics and limits',
        blocks: [
          {
            type: 'prose',
            paragraphs: [
              'Participants gave consent. Identifying records were anonymized before analysis, and only the data the study needed was kept. The result belongs to these tasks and these participants. It does not travel, on its own, to every artistic field.',
            ],
          },
        ],
      },
      {
        id: 'materials',
        label: 'Repository and materials',
        blocks: [
          {
            type: 'prose',
            paragraphs: [
              'The repository, evaluation rubric, questionnaires, and analysis scripts are not published. This page does not link a file that is not there.',
            ],
          },
        ],
      },
    ],
  },
];

export const researchPaperSeed: readonly ResearchPaper[] = researchStudies.map((study) => ({
  slug: study.slug,
  isPlaceholder: false,
  question: study.question,
  title: study.title,
  abstract: study.summary,
  field: study.domains[0] ?? '-',
  status: study.status,
  year: null,
  pdfUrl: null,
  featured: study.featured,
}));
