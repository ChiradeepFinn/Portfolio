/**
 * Static identity and navigation config.
 *
 * Only the facts confirmed during reconstruction live here as real values.
 * Unconfirmed profile URLs stay `null` so the UI can render them as "not
 * linked yet" instead of shipping a dead `#` href.
 */

export const identity = {
  name: 'Chiradeep',
  firstName: 'Chiradeep',
  brand: 'CF°',
  role: 'Creative Technologist',
  location: 'Karur, Tamil Nadu, India',
  email: 'softwarechiradeep@gmail.com',
} as const;

export interface SocialProfile {
  readonly label: string;
  readonly href: string | null;
  readonly icon: string;
}

export const socialProfiles: readonly SocialProfile[] = [
  { label: 'Instagram', href: 'https://instagram.com/chiradeepfinn', icon: 'Instagram' },
  { label: 'GitHub', href: 'https://github.com/chiradeepfinn', icon: 'Github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/chiradeep-finn-471265229/', icon: 'Linkedin' },
  { label: 'Snapchat', href: 'https://www.snapchat.com/add/roseblushh.love', icon: 'Ghost' },
  { label: 'Discord', href: 'https://discord.com/users/1224950290084794395', icon: 'Gamepad2' },
  { label: 'BandLab', href: 'https://www.bandlab.com/roseblushh.love', icon: 'Music2' },
  { label: 'Email', href: `mailto:${identity.email}`, icon: 'Mail' },
];

export const heroBadge = {
  tag: 'NEW',
  label: 'Sidequest',
  href: '/projects/sidequest',
} as const;

export interface NavItem {
  readonly label: string;
  readonly href: string;
} 

export const navItems: readonly NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const footerBio =
  "I'm Chiradeep - a creative technologist working across AI, web, music, and visual storytelling. Thanks for checking out my site!";

export interface FooterLink {
  readonly label: string;
  readonly href: string | null;
  readonly icon: string;
}

export interface FooterColumn {
  readonly title: string;
  readonly links: readonly FooterLink[];
}

function socialHref(label: string): string | null {
  return socialProfiles.find((profile) => profile.label === label)?.href ?? null;
}

export const footerColumns: readonly FooterColumn[] = [
  {
    title: 'General',
    links: [
      { label: 'Home', href: '/', icon: 'House' },
      { label: 'About', href: '/about', icon: 'User' },
      { label: 'Projects', href: '/projects', icon: 'FolderOpen' },
      { label: 'Contact', href: '/contact', icon: 'Mail' },
      { label: 'Music', href: '/music', icon: 'Music' },
      { label: 'Archive', href: '/archive', icon: 'BookOpen' },
      { label: 'Writing', href: '/philosophy', icon: 'PenLine' },
      { label: 'Guest journal', href: '/journal', icon: 'NotebookPen' },
      { label: 'Links', href: '/links', icon: 'Link2' },
    ],
  },
  {
    title: 'My worlds',
    links: [
      { label: 'Artwork', href: '/archive/artwork', icon: 'Palette' },
      { label: 'Photography', href: '/archive/photography', icon: 'Camera' },
      { label: 'Books', href: '/archive/books', icon: 'BookOpen' },
      { label: 'Research', href: '/archive/research', icon: 'FlaskConical' },
      { label: 'Philosophy', href: '/philosophy', icon: 'ScrollText' },
      { label: 'Bucket List', href: '/bucket-list', icon: 'ListTodo' },
      { label: 'Timeline', href: '/timeline', icon: 'Route' },
    ],
  },
  {
    title: "Let's meet here",
    links: [
      { label: 'GitHub', href: socialHref('GitHub'), icon: 'Github' },
      { label: 'LinkedIn', href: socialHref('LinkedIn'), icon: 'Linkedin' },
      { label: 'Instagram', href: socialHref('Instagram'), icon: 'Instagram' },
      { label: 'Snapchat', href: socialHref('Snapchat'), icon: 'Ghost' },
      { label: 'Discord', href: socialHref('Discord'), icon: 'Gamepad2' },
      { label: 'Email', href: socialHref('Email'), icon: 'Mail' },
    ],
  },
];

export const footerLegal: readonly FooterLink[] = [
  { label: 'Privacy Policy', href: '/privacy', icon: 'Shield' },
  { label: 'Terms of Use', href: '/terms', icon: 'FileText' },
  { label: 'Sitemap', href: '/sitemap.xml', icon: 'Network' },
  { label: 'RSS', href: '/rss.xml', icon: 'Rss' },
  { label: 'llms.txt', href: '/llms.txt', icon: 'Bot' },
];

/**
 * Generated files, not pages. A client navigation would ask Next for a page
 * payload, so the footer links to them with a plain anchor.
 */
export const documentHrefs: readonly string[] = ['/sitemap.xml', '/rss.xml', '/llms.txt', '/llms-full.txt'];
