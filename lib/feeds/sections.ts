/**
 * Public pages that exist regardless of content rows.
 *
 * The list mirrors the sitemap and stays short: it is a map for a reader, not a
 * second sitemap. Nothing behind sign-in is here.
 */

export interface SiteSection {
  readonly path: string;
  readonly label: string;
  readonly note: string;
}

export const siteSections: readonly SiteSection[] = [
  { path: '/', label: 'Home', note: 'Introduction, selected work, and the rooms of the site.' },
  { path: '/about', label: 'About', note: 'Biography and portrait.' },
  { path: '/projects', label: 'Projects', note: 'Case studies.' },
  { path: '/music', label: 'Music', note: 'Music and how it is made.' },
  { path: '/archive', label: 'Archive', note: 'Entrance to the archive.' },
  { path: '/archive/photography', label: 'Photography', note: 'Photographs.' },
  { path: '/archive/artwork', label: 'Artwork', note: 'Artwork.' },
  { path: '/archive/books', label: 'Books', note: 'Published books, including The Inward Silhouette.' },
  { path: '/archive/research', label: 'Research', note: 'Research studies.' },
  { path: '/archive/certifications', label: 'Certifications', note: 'Credentials.' },
  { path: '/philosophy', label: 'Philosophy', note: 'Essays.' },
  { path: '/timeline', label: 'Timeline', note: 'A life in progress.' },
  { path: '/now', label: 'Now', note: 'Current work, left blank until it is real.' },
  { path: '/bucket-list', label: 'Bucket list', note: 'Intentions, left blank until they are real.' },
  { path: '/links', label: 'Links', note: 'Profiles elsewhere.' },
  { path: '/journal', label: 'Guest journal', note: 'Public notes left by visitors who signed in.' },
  { path: '/contact', label: 'Contact', note: 'Contact form and direct email.' },
  { path: '/privacy', label: 'Privacy', note: 'What the site collects.' },
  { path: '/terms', label: 'Terms', note: 'How the work may be read and quoted.' },
];
