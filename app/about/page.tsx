import type { Metadata } from 'next';
import Image from 'next/image';
import { profilePageGraph, withCanonical } from '@/lib/seo';
import Link from 'next/link';
import { JsonLd } from '@/components/seo/JsonLd';
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
  description:
    "I'm Chiradeep Finn — Finn for short — a creative technologist from Karur. Who I am, what I build, and what drives the work across AI, web, music, and the arts.",
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
  { href: '/projects', label: 'Projects', image: '/images/rooms/project.jpg' },
  { href: '/music', label: 'Music', image: '/images/rooms/music production.jpg' },
  { href: '/archive/books', label: 'Books', image: '/images/rooms/books.jpg' },
  { href: '/archive/research', label: 'Research', image: '/images/rooms/research.jpg' },
  { href: '/archive/photography', label: 'Photography', image: '/images/rooms/photography.jpg' },
  { href: '/archive/artwork', label: 'Artwork', image: '/images/rooms/art.jpg' },
  { href: '/philosophy', label: 'Philosophy', image: '/images/rooms/philosophy.jpg' },
] as const;

export default async function AboutPage() {
  const writing = await getFeaturedWriting();
  const showWriting = Boolean(writing && !writing.isPlaceholder);

  return (
    <>
      <JsonLd data={profilePageGraph()} />
      <header className="relative">
        <Container className="grid items-center gap-10 pt-32 pb-8 sm:pt-36 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,50rem)] lg:gap-8 lg:pt-40 lg:pb-12">
          <div>
            <h1 className="display max-w-3xl text-[clamp(2.35rem,5vw,4.15rem)] leading-[1.05] text-foreground">
              I&apos;m {identity.firstName}, a{' '}
              <GradientWord>{identity.role.toLowerCase()}.</GradientWord>
            </h1>
            <div className="mt-6 max-w-xl">
              <p className="body-copy">
                Full name {identity.name}. Most people call me {identity.preferredName};{' '}
                {identity.shortName} is the other name you&apos;ll see. Same person.
              </p>
              <p className="body-copy mt-4">
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
        <ul className="mt-8 mx-auto grid w-[30%] min-w-[11.5rem] grid-cols-2 gap-1.5 sm:min-w-[16rem] sm:grid-cols-3 sm:gap-2 lg:min-w-[20rem] lg:grid-cols-4 lg:gap-2">
          {places.map((place) => (
            <li key={place.href}>
              <Link
                href={place.href}
                className="group relative block aspect-square overflow-hidden rounded-lg border border-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
              >
                <Image
                  src={place.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 14vw, (max-width: 1024px) 9vw, 3.6rem"
                  className="object-cover transition-[transform,filter] duration-500 ease-cinematic group-hover:scale-[1.03] group-hover:brightness-110"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-1.5 pt-4 pb-1.5 text-[0.55rem] font-medium leading-tight text-white sm:text-[0.62rem]">
                  {place.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
