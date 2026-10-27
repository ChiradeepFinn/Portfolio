import Link from 'next/link';
import { ChevronRight, Mail } from 'lucide-react';
import { heroBadge, identity } from '@/lib/site';
import { BlurText } from '@/components/ui/BlurText';
import { HorizonGlow } from './HorizonGlow';
import { ArrowPill } from '@/components/ui/ArrowPill';
import { ProfileHi } from './ProfileHi';

/**
 * Locked composition. The hero was settled before the files were lost and is
 * reproduced here as established: badge, editorial headline with an italic
 * emphasis line, identity line with the avatar beside the name, two calls to
 * action, and the horizon closing the section.
 */
export function Hero() {
  return (
    <section className="seam-before relative flex flex-col items-center overflow-hidden pt-28 sm:pt-32 lg:pt-36">
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-5 text-center sm:px-6">
        <Link
          href={heroBadge.href}
          className="group inline-flex max-w-full items-center gap-2 self-end rounded-pill border border-border bg-wash py-1 pr-2.5 pl-1 text-[0.7rem] backdrop-blur-md transition-colors duration-200 hover:border-border-strong sm:text-xs"
        >
          <span className="badge-glow rounded-pill bg-[#236ff3] px-2 py-[0.15rem] text-[0.6rem] font-semibold tracking-[0.08em] text-white uppercase sm:text-[0.65rem]">
            {heroBadge.tag}
          </span>
          <span className="truncate text-muted transition-colors duration-200 group-hover:text-foreground">
            {heroBadge.label}
          </span>
          <ChevronRight
            size={13}
            aria-hidden="true"
            className="shrink-0 text-muted-2 transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>

        <h1 className="display mt-6 text-balance text-[clamp(1.85rem,4.5vw,3.85rem)] leading-[1.05] text-foreground sm:mt-7">
          <BlurText text="Technology that" />{' '}
          <BlurText text="feels" className="italic" startDelay={110} />{' '}
          <BlurText text="human." startDelay={165} />
          <br />
          <span className="italic">
            <BlurText text="Creativity that actually ships." startDelay={230} />
          </span>
        </h1>

        <p className="mt-7 flex flex-wrap items-center justify-center gap-x-2 gap-y-2.5 text-[0.8rem] text-muted sm:mt-8 sm:gap-x-2.5 sm:text-sm">
          <span>Hello, I&apos;m</span>
          <span className="font-semibold text-foreground">{identity.firstName}</span>
          <ProfileHi />
          <span>, a {identity.role}</span>
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5 sm:mt-8 sm:gap-3">
          <ArrowPill href="/projects">Projects</ArrowPill>
          <ArrowPill href="/about">About</ArrowPill>
          <a
            href="/contact"
            className="flex items-center gap-2 rounded-pill px-3 py-2 text-[0.8rem] text-muted transition-colors duration-200 hover:text-foreground sm:text-sm"
          >
            <Mail size={14} aria-hidden="true" className="shrink-0" />
            <span>Contact</span>
          </a>
        </div>
      </div>

      <HorizonGlow className="mt-1 sm:mt-2" />
    </section>
  );
}
