/**
 * Content model for the portfolio.
 *
 * Every entity carries `isPlaceholder`. Nothing here is invented: where the
 * real title, cover, date or credit was not available, the row is marked and
 * the UI renders a labelled empty slot instead of pretending to have content.
 */

export interface ContentBase {
  readonly slug: string;
  readonly isPlaceholder: boolean;
}

export type ProjectTone = 'blue' | 'rose' | 'teal';

export interface Project extends ContentBase {
  readonly title: string;
  readonly category: string;
  readonly year: string;
  readonly status: string;
  readonly role: string;
  readonly summary: string;
  /** Line set on the colored study card, beside the product frame. */
  readonly hook: string;
  readonly description: string;
  readonly highlights: readonly string[];
  readonly stack: readonly string[];
  readonly tone: ProjectTone;
  readonly liveUrl: string | null;
  readonly repoUrl: string | null;
  readonly featured: boolean;
}

export interface Track extends ContentBase {
  readonly title: string;
  readonly mood: string;
  readonly duration: string;
  readonly year: string;
  readonly note: string;
  readonly listenUrl: string | null;
  readonly featured: boolean;
}

export interface Book extends ContentBase {
  readonly index: string;
  readonly title: string;
  readonly subtitle: string;
  readonly synopsis: string;
  readonly excerpt: string;
  readonly year: string | null;
  readonly publisher: string | null;
}

export type ArtworkSize = 'tall' | 'wide' | 'square';

export interface Artwork extends ContentBase {
  readonly title: string;
  readonly medium: string;
  readonly year: string;
  readonly size: ArtworkSize;
  readonly featured: boolean;
}

export interface Photograph extends ContentBase {
  readonly title: string;
  readonly place: string;
  readonly captured: string;
  readonly camera: string | null;
  readonly size: ArtworkSize;
  readonly featured: boolean;
}

export interface ResearchPaper extends ContentBase {
  readonly question: string;
  readonly title: string;
  readonly abstract: string;
  readonly field: string;
  readonly status: string;
  readonly year: string | null;
  readonly pdfUrl: string | null;
  readonly featured: boolean;
}

export interface WritingEntry extends ContentBase {
  readonly title: string;
  readonly category: string;
  readonly excerpt: string;
  readonly published: string | null;
  readonly featured: boolean;
}

export interface Certification extends ContentBase {
  readonly title: string;
  readonly issuer: string;
  readonly year: string;
  readonly note: string;
  readonly verifyUrl: string | null;
}

export interface TimelineItem extends ContentBase {
  readonly year: string;
  readonly title: string;
  readonly note: string;
}

export interface ContactSubmission {
  readonly name: string;
  readonly email: string;
  readonly subject: string;
  readonly message: string;
}
