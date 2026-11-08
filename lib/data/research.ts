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
    displayTitle: 'Writer–evaluator alignment under AI-assisted ideation',
    title: assistedIdeationTitle,
    status: 'Done',
    featured: false,
    domains: [
      'Secondary-data analysis',
      'Computational creativity',
      'Generative AI',
      'Creative metacognition',
    ],
    question:
      "A secondary-data analysis of how writers' self-assessments align with independent evaluations of story novelty and usefulness, with and without access to generative AI ideas.",
    progress:
      'Exploratory secondary-data analysis completed; independent implementation validation remains outstanding.',
    summary:
      "This project examines whether writers' judgments of their own stories align with independent evaluators' ratings, and whether that relationship differs across human-only and AI-assisted ideation conditions. Using a public experimental dataset, I analyzed story-level ratings, compared correlations across conditions, and examined calibration and exploratory ownership measures. The analysis identifies a condition-dependent pattern for novelty alignment, but not usefulness. It is exploratory, was not preregistered, and requires independent statistical validation.",
    overviewLabel: 'Summary',
    overview:
      "This project examines whether writers' judgments of their own stories align with independent evaluators' ratings, and whether that relationship differs across human-only and AI-assisted ideation conditions. Using a public experimental dataset, I analyzed story-level ratings, compared correlations across conditions, and examined calibration and exploratory ownership measures. The analysis identifies a condition-dependent pattern for novelty alignment, but not usefulness. It is exploratory, was not preregistered, and requires independent statistical validation.",
    overviewNote:
      '“Completed” refers to the current analysis of the public dataset. It does not mean a published paper, an independently replicated study, or validation against Stata or R.',
    figure: 'ideation',
    previewFacts: [
      { label: 'Stage', value: 'Exploratory analysis completed; validation outstanding.' },
      { label: 'Design', value: 'Secondary analysis of Doshi & Hauser (2024) public data.' },
      {
        label: 'Focus',
        value: 'Writer–evaluator novelty alignment across ideation conditions.',
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
              'Creative output and creative self-assessment are not the same thing. A story can receive a particular external novelty rating while the writer’s own judgment of that story may or may not align with it.',
              'This project asks whether access to generative AI ideas changes that relationship. The question is not simply whether AI makes stories more original. It is whether writer-assessed novelty and independent evaluator ratings move together differently when writers work from human-only ideation versus AI-assisted ideation.',
            ],
          },
          {
            type: 'callout',
            kicker: 'Central question',
            text: "Does access to generative AI ideas change the relationship between writers' self-assessed story novelty and independent evaluators' ratings?",
          },
        ],
      },
      {
        id: 'questions',
        label: 'Research questions',
        blocks: [
          {
            type: 'questions',
            provisional: false,
            note: null,
            items: [
              {
                id: 'RQ1',
                text: "Novelty alignment — How closely do writers' self-assessments of story novelty align with independent evaluators' mean ratings?",
              },
              {
                id: 'RQ2',
                text: 'Condition differences — Does that alignment differ between the human-only condition and conditions offering one or five AI-generated ideas?',
              },
              {
                id: 'RQ3',
                text: 'Usefulness and calibration — Is a similar pattern observed for usefulness, and do differences in average self-minus-evaluator ratings indicate changes in calibration?',
              },
            ],
          },
          {
            type: 'callout',
            kicker: 'Exploratory · RQ4',
            text: "Ownership — How do writers' ownership-related judgments relate to evaluators' post-disclosure assessments? This question is exploratory and distinct from the primary novelty analysis.",
          },
        ],
      },
      {
        id: 'data',
        label: 'Data and study design',
        blocks: [
          {
            type: 'prose',
            paragraphs: [
              'This is a secondary-data analysis of the public dataset accompanying Doshi and Hauser (2024). The original authors conducted the experiment, recruited the participants, and collected the responses. I did not recruit participants, collect original stories, administer questionnaires, run double-blind scoring, or log prompting sessions. My contribution is the question, analytical framing, data processing, statistical analysis, interpretation, and reproducibility work, subject to the code’s current validation limitations.',
              'The analysis uses the original authors’ processed public dataset after applying their documented exclusions. The writers, stories, and evaluations below are observations from that original study, not a new sample recruited for this project.',
            ],
          },
          {
            type: 'definitions',
            items: [
              {
                term: 'Analytic sample',
                detail: '293 writers and stories after the original authors’ documented exclusions.',
              },
              {
                term: 'Human only',
                detail: '95 stories.',
              },
              {
                term: 'One AI idea',
                detail: '100 stories.',
              },
              {
                term: 'Five AI ideas',
                detail: '98 stories.',
              },
              {
                term: 'Evaluations',
                detail:
                  '3,519 evaluations from 600 independent evaluators. Each story received 9–14 evaluations, averaging approximately 12.',
              },
              {
                term: 'AI idea use',
                detail: 'Of 198 writers with AI access, 175 actually used an AI idea.',
              },
            ],
          },
          {
            type: 'prose',
            paragraphs: [
              'The analysis unit is the story. Writer self-ratings were compared with the mean of independent evaluators’ ratings for the same story.',
            ],
          },
          {
            type: 'definitions',
            items: [
              {
                term: 'Novelty index',
                detail:
                  'Mean of novel, original, and rare ratings on the original study’s 1–9 scale.',
              },
              {
                term: 'Usefulness index',
                detail:
                  'Mean of appropriate, feasible, and publishable ratings on the same 1–9 scale.',
              },
            ],
          },
          {
            type: 'prose',
            paragraphs: [
              'In the original procedure, evaluator novelty and usefulness ratings were collected before AI-use disclosure. That timing does not extend to the ownership-related ratings analyzed exploratorily below, which used post-disclosure assessments.',
            ],
          },
        ],
      },
      {
        id: 'method',
        label: 'Analytical method',
        blocks: [
          {
            type: 'prose',
            paragraphs: [
              'The analysis was exploratory and not preregistered. The methods below describe what was implemented; they are not presented as a confirmatory protocol.',
            ],
          },
          {
            type: 'list',
            items: [
              'Pearson correlations between writer self-ratings and evaluator mean ratings.',
              'Spearman correlations as a sensitivity check.',
              'Story-level bootstrap confidence intervals.',
              'Permutation tests comparing correlations between conditions.',
              'Holm adjustment for the four primary contrasts.',
              'Mean self-minus-evaluator gaps as a calibration measure.',
              'An evaluation-level model with crossed random intercepts for story and evaluator.',
              'Sensitivity analyses involving topic means, evaluator subsets, and other documented checks.',
              'Exploratory ownership-related analyses using post-disclosure ratings.',
            ],
          },
          {
            type: 'callout',
            kicker: 'Statistical transparency',
            text: 'The current implementation uses custom NumPy/SciPy code for some regressions and the crossed-effects model because Statsmodels was unavailable in the original environment. The estimates have not yet been independently cross-checked against Stata or R.',
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
              'Primary results are reported below with the values from the current analysis. Ownership results are labeled exploratory.',
            ],
          },
          {
            type: 'table',
            caption:
              'Writer–evaluator novelty alignment by condition. Pearson correlations between writer novelty self-ratings and evaluator mean novelty ratings.',
            columns: ['Condition', 'Stories', 'Pearson correlation'],
            rows: [
              ['Human only', '95', '−0.27'],
              ['One AI idea', '100', '0.08'],
              ['Five AI ideas', '98', '0.32'],
              ['Any AI access', '198', '0.18'],
            ],
          },
          {
            type: 'prose',
            paragraphs: [
              'The human-only correlation was −0.27 (95% bootstrap CI −0.44 to −0.08). With any AI access, it was 0.18 (95% CI 0.03 to 0.33).',
              'The difference in correlations between any AI access and human-only was 0.45 (95% CI 0.21 to 0.68; permutation p = .0011; Holm-adjusted p = .0044).',
              'The exploratory five-AI-ideas versus human-only contrast was 0.59 (95% CI 0.32 to 0.85; Holm-adjusted p = .0012). The one-AI-idea contrast was 0.35 (95% CI 0.06 to 0.63; Holm-adjusted p = .084).',
            ],
          },
          {
            type: 'table',
            caption:
              'Writer–evaluator usefulness alignment by condition. Pearson correlations between writer usefulness self-ratings and evaluator mean usefulness ratings.',
            columns: ['Condition', 'Stories', 'Pearson correlation'],
            rows: [
              ['Human only', '95', '0.02'],
              ['One AI idea', '100', '0.10'],
              ['Five AI ideas', '98', '0.14'],
              ['Any AI access', '198', '0.12'],
            ],
          },
          {
            type: 'prose',
            paragraphs: [
              'The difference between any AI access and human-only for usefulness alignment was 0.10 (95% CI −0.17 to 0.36; Holm-adjusted p = .93). This is not treated as a statistically established condition difference.',
            ],
          },
          {
            type: 'definitions',
            items: [
              {
                term: 'Novelty calibration gaps',
                detail:
                  'Mean self-minus-evaluator novelty gaps were +0.65 in human only (95% CI 0.13 to 1.17), +0.42 with one AI idea (95% CI −0.02 to 0.85), and +0.13 with five AI ideas (95% CI −0.26 to 0.51).',
              },
              {
                term: 'Gap contrast',
                detail:
                  'The difference in the mean novelty gap between any AI access and human-only was −0.37 (95% CI −0.97 to 0.22; Holm-adjusted p = .65). Mean-gap differences were not statistically distinguishable.',
              },
            ],
          },
          {
            type: 'prose',
            paragraphs: [
              'Usefulness alignment and calibration did not show comparable evidence of condition differences.',
            ],
          },
          {
            type: 'callout',
            kicker: 'Exploratory ownership results',
            text: 'These associations do not establish an effect on perceived agency. Agency was not the outcome analyzed in this secondary analysis.',
          },
          {
            type: 'prose',
            paragraphs: [
              'Writers’ ratings of ownership over their own ideas correlated with evaluators’ authorship assessments at r = 0.07 in the human-only condition and r = 0.24 with any AI access. Among AI-used stories, writer and evaluator profit-share judgments correlated at r = 0.20.',
              'Mean ownership-rating gaps were +1.19 for one AI idea used and +1.45 for five AI ideas used, compared with −0.54 in the human-only condition. Evaluators knew about AI use for these post-disclosure measures, so these results are not directly comparable to the pre-disclosure novelty ratings.',
            ],
          },
        ],
      },
      {
        id: 'interpretation',
        label: 'Interpretation',
        blocks: [
          {
            type: 'prose',
            paragraphs: [
              'In this dataset, writer-assessed novelty and evaluator-rated novelty were negatively associated in the human-only condition and positively associated in the five-AI-ideas condition. The difference in novelty alignment between any AI access and human-only passed the specified Holm-adjusted primary comparison. The corresponding usefulness comparison did not show evidence of a condition difference.',
              'The analysis does not establish that AI improves creativity, makes writers more accurate in general, or causes changes in individual metacognition. Correlations describe between-story alignment; they do not show how an individual writer’s judgment changes over time.',
              'Potential explanations, such as AI ideas providing a shared reference point, are hypotheses for future investigation, not established mechanisms.',
            ],
          },
        ],
      },
      {
        id: 'limitations',
        label: 'Limitations and ethics',
        blocks: [
          {
            type: 'list',
            items: [
              'This is a secondary analysis of an existing public dataset.',
              'The analysis was exploratory and not preregistered.',
              'The novelty result is hypothesis-generating and needs replication.',
              'Only the four primary contrasts received the specified Holm correction; other analyses are exploratory.',
              'Writer self-ratings are indices without an independently estimated reliability measure.',
              'Evaluator mean ratings have moderate reliability: approximately 0.69 for novelty and 0.74 for usefulness at about 12 ratings per story.',
              'The analysis is based on short stories, an online general-population sample, and the original study’s model and procedures.',
              'The custom statistical implementation has not been independently validated against Stata or R.',
              'The original authors’ Stata analysis scripts were inspected but not executed for independent replication.',
            ],
          },
          {
            type: 'prose',
            paragraphs: [
              'Ethics, consent, anonymization, and participant handling for the underlying experiment belong to the original study. This project analyzes the released public data and does not claim those procedures as work performed here.',
            ],
          },
        ],
      },
      {
        id: 'original-paper',
        label: 'Relationship to the original paper',
        blocks: [
          {
            type: 'prose',
            paragraphs: [
              'The original paper investigated outcomes such as story creativity, collective diversity, and ownership-related judgments. This project asks a different question: whether writer self-assessments align with independent evaluator ratings, and whether that relationship differs by condition.',
              'The secondary analysis does not replace or contradict the original study’s reported findings. This page does not claim that the analysis is the first published reanalysis; a wider literature search has not been completed.',
            ],
          },
        ],
      },
      {
        id: 'materials',
        label: 'Reproducibility and materials',
        blocks: [
          {
            type: 'prose',
            paragraphs: [
              'The original data belong to the original study. This project analyzes those public data and does not claim ownership of the dataset. A link appears here only when the destination exists.',
            ],
          },
          {
            type: 'records',
            items: [
              {
                label: 'Doshi & Hauser (2024), Science Advances',
                value: 'doi.org/10.1126/sciadv.adn5290',
                href: 'https://doi.org/10.1126/sciadv.adn5290',
              },
              {
                label: 'Original dataset and code, Dryad',
                value: 'doi.org/10.5061/dryad.qfttdz0pm',
                href: 'https://doi.org/10.5061/dryad.qfttdz0pm',
              },
              {
                label: 'Analysis script (analysis.py)',
                value: 'Not published on this site',
              },
              {
                label: 'Generated figures and tables',
                value: 'Not published on this site',
              },
              {
                label: 'Dependencies',
                value: 'NumPy, pandas, SciPy, Matplotlib',
              },
              {
                label: 'Documented run command',
                value: 'python analysis.py <GenAI_creativity_scripts folder> <output folder>',
              },
            ],
          },
          {
            type: 'callout',
            kicker: 'Command note',
            text: 'The run command above is the documented invocation for the analysis workflow. The script is not included in this portfolio repository, so the command has not been re-executed from this site’s source tree.',
          },
        ],
      },
      {
        id: 'next',
        label: 'Next steps',
        blocks: [
          {
            type: 'ordered',
            items: [
              {
                title: 'Independent statistical validation',
                detail:
                  'Validate the key correlations and mixed model in R, preferably with an appropriate crossed-random-effects implementation.',
              },
              {
                title: 'Literature search',
                detail:
                  'Search the wider literature for prior analyses of writer–evaluator alignment in this dataset.',
              },
              {
                title: 'Confirmatory replication design',
                detail:
                  'Design and preregister a confirmatory replication on a new sample before collecting any new data.',
              },
            ],
          },
          {
            type: 'prose',
            paragraphs: ['None of these steps is complete.'],
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
