import type { Metadata } from 'next';
import Image from 'next/image';
import { profilePageGraph, withCanonical } from '@/lib/seo';
import Link from 'next/link';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  Facebook,
  Gamepad2,
  Ghost,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Music2,
  Youtube,
  type LucideIcon,
} from 'lucide-react';
import { getFeaturedWriting } from '@/lib/content';
import { identity, socialProfiles } from '@/lib/site';
import { aboutWorld } from '@/lib/data/worlds';
import { timelineChapters } from '@/lib/data/timeline';
import { media } from '@/lib/media';
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
    "I'm Chiradeep Finn, Finn for short: a creative technologist from Karur. Who I am, what I build, and what drives the work across AI, web, music, and the arts.",
});

const socialIcons: Record<string, LucideIcon> = {
  Github,
  Linkedin,
  Instagram,
  Ghost,
  Gamepad2,
  Music2,
  Mail,
  Youtube,
  Facebook,
};

const places = [
  { href: '/projects', label: 'Projects', image: media.images.rooms.projects },
  { href: '/music', label: 'Music', image: media.images.rooms.music },
  { href: '/archive/books', label: 'Books', image: media.images.rooms.books },
  { href: '/archive/research', label: 'Research', image: media.images.rooms.research },
  { href: '/archive/photography', label: 'Photography', image: media.images.rooms.photography },
  { href: '/archive/artwork', label: 'Artwork', image: media.images.rooms.artwork },
  { href: '/philosophy', label: 'Philosophy', image: media.images.rooms.philosophy },
] as const;

export default async function AboutPage() {
  const writing = await getFeaturedWriting();
  const showWriting = Boolean(writing && !writing.isPlaceholder);

  return (
    <>
      <JsonLd data={profilePageGraph()} />
      <header className="relative">
        <Container className="grid items-start gap-8 pt-28 pb-12 sm:gap-10 sm:pt-32 sm:pb-14 md:grid-cols-[minmax(0,1fr)_minmax(12rem,20rem)] md:gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(12rem,17.5rem)] lg:gap-14 lg:pt-36 lg:pb-16">
          <div className="min-w-0 md:order-1">
            <h1 className="display max-w-2xl text-[clamp(2.2rem,4.6vw,3.75rem)] leading-[1.06] text-foreground">
              I&apos;m {identity.firstName}, a{' '}
              <GradientWord>{identity.role.toLowerCase()}.</GradientWord>
            </h1>
            <div className="mt-5 max-w-xl sm:mt-6">
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
            <ul className="mt-7 flex flex-wrap gap-2 sm:mt-8">
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

          <div className="pt-1 pb-2 md:order-2 md:pt-3 md:pb-1 lg:pt-6">
            <AboutPortraits />
          </div>
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
          <h2 id="writing-heading" className="eyebrow text-muted-2">
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

      <Section border="top" labelledBy="places-heading" className="py-14 sm:py-16 lg:py-20">
        <h2
          id="places-heading"
          className="display max-w-xl text-balance text-[clamp(1.7rem,3.4vw,2.5rem)] text-foreground"
        >
          The work, filed in <GradientWord>different rooms.</GradientWord>
        </h2>
        <ul className="mt-12 grid w-full max-w-xs grid-cols-2 gap-2 sm:mt-14 sm:max-w-md sm:grid-cols-3 sm:gap-2.5 lg:max-w-lg lg:grid-cols-4 lg:gap-3">
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
                  sizes="(max-width: 640px) 42vw, (max-width: 1024px) 22vw, 7.5rem"
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
