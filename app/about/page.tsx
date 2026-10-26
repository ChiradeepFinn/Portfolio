import type { Metadata } from 'next';
import { withCanonical } from '@/lib/seo';
import Link from 'next/link';
import {
  Gamepad2,
  Ghost,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Music2,
  type LucideIcon,
} from 'lucide-react';
import { getFeaturedWriting } from '@/lib/content';
import { identity, socialProfiles } from '@/lib/site';
import { aboutWorld } from '@/lib/data/worlds';
import { timelineChapters } from '@/lib/data/timeline';
import { AboutPortraits } from '@/components/about/AboutPortraits';
import { AboutTimeline } from '@/components/about/AboutTimeline';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { ArrowPill } from '@/components/ui/ArrowPill';
import { GradientWord } from '@/components/ui/GradientWord';

export const metadata: Metadata = withCanonical('/about', {
  title: 'About',
  description: 'Who I am and what drives me.',
});

const socialIcons: Record<string, LucideIcon> = {
  Github,
  Linkedin,
  Instagram,
  Ghost,
  Gamepad2,
  Music2,
  Mail,
};

const places = [
  { href: '/projects', label: 'Projects' },
  { href: '/music', label: 'Music' },
  { href: '/archive/books', label: 'Books' },
  { href: '/archive/research', label: 'Research' },
  { href: '/archive/photography', label: 'Photography' },
  { href: '/archive/artwork', label: 'Artwork' },
  { href: '/philosophy', label: 'Philosophy' },
] as const;

export default async function AboutPage() {
  const writing = await getFeaturedWriting();
  const showWriting = Boolean(writing && !writing.isPlaceholder);

  return (
    <>
      <header className="relative">
        <Container className="grid items-center gap-10 pt-32 pb-8 sm:pt-36 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,50rem)] lg:gap-8 lg:pt-40 lg:pb-12">
          <div>
            <h1 className="display max-w-3xl text-[clamp(2.35rem,5vw,4.15rem)] leading-[1.05] text-foreground">
              I&apos;m {identity.firstName}, a{' '}
              <GradientWord>{identity.role.toLowerCase()}.</GradientWord>
            </h1>
            <div className="mt-6 max-w-xl">
              <p className="body-copy">
                Based in {identity.location}. Most of what I make sits at the edges between disciplines -
                where an interface decision is really a psychology decision, where a chord progression is
                really an engineering constraint, where a photograph and a line of code are both attempts to
                notice something clearly.
              </p>
              <p className="body-copy mt-4">
                I don&apos;t keep AI, web, music, writing, photography, and research as separate careers.
                They&apos;re one practice. This site is where that practice stays in one place.
              </p>
            </div>
            <ul className="mt-8 flex flex-wrap gap-2">
              {socialProfiles.map((profile) => {
                const Icon = socialIcons[profile.icon] ?? Mail;
                const className =
                  'grid h-9 w-9 place-items-center rounded-full border border-border text-muted transition-colors duration-200 hover:border-border-strong hover:text-foreground';
                if (!profile.href) {
                  return (
                    <li key={profile.label}>
                      <span className={`${className} opacity-40`} aria-label={`${profile.label}, not linked yet`}>
                        <Icon size={15} aria-hidden="true" />
                      </span>
                    </li>
                  );
                }
                const external = profile.href.startsWith('http');
                return (
                  <li key={profile.label}>
                    <a
                      href={profile.href}
                      aria-label={profile.label}
                      className={className}
                      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                    >
                      <Icon size={15} aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <AboutPortraits />
        </Container>
      </header>

      <Section id="practice" labelledBy="practice-heading" className="pt-8 sm:pt-12">
        <h2
          id="practice-heading"
          className="display max-w-xl text-balance text-[clamp(1.9rem,4vw,3rem)] text-foreground"
        >
          {aboutWorld.headline.before} <GradientWord>{aboutWorld.headline.emphasis}</GradientWord>
        </h2>

        <AboutTimeline chapters={timelineChapters} />

        <ArrowPill href="/timeline" className="mt-4">
          The full story
        </ArrowPill>
      </Section>

      {showWriting && writing ? (
        <Section id="writing" border="top" width="narrow" labelledBy="writing-heading">
          <h2 id="writing-heading" className="eyebrow text-warm-2">
            Writing
          </h2>
          <Reveal>
            <blockquote className="mt-8 border-l border-border pl-6">
              <p className="font-display text-[clamp(1.2rem,2.4vw,1.55rem)] leading-snug text-foreground italic">
                {writing.excerpt}
              </p>
            </blockquote>
            <p className="meta mt-5">
              {writing.title}
              {writing.category ? ` · ${writing.category}` : ''}
            </p>
          </Reveal>
        </Section>
      ) : null}

      <Section border="top" labelledBy="places-heading">
        <h2
          id="places-heading"
          className="display max-w-xl text-balance text-[clamp(1.7rem,3.4vw,2.5rem)] text-foreground"
        >
          The work, filed in <GradientWord>different rooms.</GradientWord>
        </h2>
        <ul className="mt-8 flex flex-wrap gap-2">
          {places.map((place) => (
            <li key={place.href}>
              <Link
                href={place.href}
                className="inline-flex rounded-pill border border-border px-3.5 py-1.5 text-sm text-muted transition-colors duration-200 hover:border-border-strong hover:text-foreground"
              >
                {place.label}
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
