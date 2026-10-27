'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowUpRight,
  BookOpen,
  Camera,
  Clock,
  Link2,
  Mail,
  Palette,
  Radio,
  NotebookPen,
  ScrollText,
  User,
  type LucideIcon,
} from 'lucide-react';

interface TrayLink {
  readonly label: string;
  readonly copy: string;
  readonly cta: string;
  readonly href: string;
  readonly icon: LucideIcon;
}

/** The two worlds that deserve a picture, not a list item. */
const featureLinks: readonly (TrayLink & {
  readonly wash: string;
  readonly image?: string;
})[] = [
  {
    label: 'Photography',
    copy: 'Visual stories & moments',
    cta: 'Explore Photos',
    href: '/archive/photography',
    icon: Camera,
    wash: 'from-[var(--explore-photo-from)] via-[var(--explore-photo-via)] to-[var(--explore-photo-to)]',
    image: '/images/photography_pic.png',
  },
  {
    label: 'About',
    copy: 'Who I am and what I build',
    cta: 'About',
    href: '/about',
    icon: User,
    wash: 'from-[var(--explore-about-from)] via-[var(--explore-about-via)] to-[var(--explore-about-to)]',
    image: '/images/about_pic.webp',
  },
];

const compactLinks: readonly TrayLink[] = [
  { label: 'Books', copy: 'The Inward Silhouette', cta: 'Read Books', href: '/archive/books', icon: BookOpen },
  { label: 'Philosophy', copy: 'Essays and questions', cta: 'Open Shelf', href: '/philosophy', icon: ScrollText },
  { label: 'Art Gallery', copy: 'Canvas & colour', cta: 'View Gallery', href: '/archive/artwork', icon: Palette },
  { label: 'Timeline', copy: 'A life in progress', cta: 'See Journey', href: '/timeline', icon: Clock },
  { label: 'Now', copy: 'What I am doing', cta: "What's New", href: '/now', icon: Radio },
  { label: 'Guest journal', copy: 'One note in the margin', cta: 'Leave a note', href: '/journal', icon: NotebookPen },
  { label: 'Contact', copy: 'Freelance, collab, or roles', cta: 'Contact', href: '/contact', icon: Mail },
  { label: 'Links', copy: 'Socials and profiles', cta: 'Links', href: '/links', icon: Link2 },
];

interface ExploreTrayProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

/**
 * A tray that hangs off the nav rather than a full-screen menu - the page stays
 * visible behind it, so Explore reads as a drawer of the site rather than a
 * detour away from it.
 *
 * Only opacity, translateY, and a very small scale are animated. Animating
 * width, height, or border-radius is what makes a panel of this shape collapse
 * into an oval on exit.
 */
export function ExploreTray({ isOpen, onClose }: ExploreTrayProps) {
  const reduce = useReducedMotion();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute left-1/2 top-[calc(100%+10px)] z-40 w-[min(94vw,64rem)] -translate-x-1/2 lg:w-[min(66vw,72rem)]">
          <motion.div
            id="explore-tray"
            initial={reduce ? { opacity: 0, scale: 0.85 } : { opacity: 0, y: -10, scale: 0.83725 }}
            animate={{ opacity: 1, y: 0, scale: 0.85 }}
            exit={reduce ? { opacity: 0, scale: 0.85 } : { opacity: 0, y: -8, scale: 0.8415 }}
            transition={reduce ? { duration: 0 } : { duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'top center' }}
            className="glass-surface glass-surface-scrolled max-h-[min(70vh,34rem)] overflow-y-auto rounded-card p-3 shadow-[var(--elev-shadow-lg)] backdrop-blur-[48px] sm:p-4"
          >
            <div className="grid gap-3 lg:grid-cols-[1.08fr_1fr]">
              <div className="grid gap-3 sm:grid-cols-2">
                {featureLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={onClose}
                    data-theme-scope={item.image ? 'dark' : undefined}
                    className={`group relative flex min-h-[9.5rem] flex-col justify-end overflow-hidden rounded-2xl border border-border p-4 transition-colors duration-300 hover:border-border-strong ${item.image ? 'bg-black' : `bg-gradient-to-br ${item.wash}`}`}
                  >
                    {item.image ? (
                      <>
                        <Image
                          src={item.image}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 18rem, 46vw"
                          className="origin-center scale-[1.08] object-cover object-center blur-[4px] transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.16]"
                        />
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10"
                        />
                      </>
                    ) : null}
                    <item.icon
                      size={18}
                      aria-hidden="true"
                      className="absolute left-4 top-4 z-10 text-muted transition-colors duration-300 group-hover:text-foreground"
                    />
                    <div className="relative z-10">
                      <p className="font-display text-lg text-foreground">{item.label}</p>
                      <p className="mt-0.5 text-[0.78rem] text-muted">{item.copy}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-[0.72rem] font-medium text-muted transition-colors duration-300 group-hover:text-foreground">
                        {item.cta}
                        <ArrowUpRight
                          size={12}
                          aria-hidden="true"
                          className="transition-transform duration-500 ease-cinematic group-hover:translate-x-1 group-hover:-translate-y-1"
                        />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {compactLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={onClose}
                    className={`group flex items-start gap-3 rounded-xl border border-transparent px-3 py-3 transition-colors duration-200 hover:border-border hover:bg-wash${item.href === '/archive/artwork' ? ' scale-[0.97]' : ''}`}
                  >
                    <item.icon
                      size={15}
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-muted-2 transition-colors duration-200 group-hover:text-accent-blue"
                    />
                    <span className="min-w-0">
                      <span className="block text-[0.82rem] font-medium text-foreground">{item.label}</span>
                      <span className="block truncate text-[0.72rem] text-muted-2">{item.copy}</span>
                      <span className="mt-1 inline-flex items-center gap-1 text-[0.68rem] text-muted transition-colors duration-200 group-hover:text-foreground">
                        {item.cta}
                        <ArrowUpRight
                          size={10}
                          aria-hidden="true"
                          className="transition-transform duration-500 ease-cinematic group-hover:translate-x-1 group-hover:-translate-y-1"
                        />
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
