'use client';

import { useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { media } from '@/lib/media';
import dynamic from 'next/dynamic';
import type { FilmPlayerHandle } from './FilmPlayer';

const FilmPlayer = dynamic(() => import('./FilmPlayer').then((mod) => mod.FilmPlayer));

/**
 * The introduction. A short text column beside the film, with the label
 * sitting above the frame rather than beside the title.
 */
export function IntroVideo() {
  const playerRef = useRef<FilmPlayerHandle>(null);
  const [playing, setPlaying] = useState(false);

  return (
    <Section border="top" className="seam-before seam-after" containerClassName="relative">
      <Reveal>
        <p className="mb-7 text-right text-[0.62rem] font-medium tracking-[0.2em] text-muted-2 uppercase sm:mb-9">
          A quick hello&hellip;
        </p>
      </Reveal>

      <div className="grid items-center gap-10 sm:grid-cols-[minmax(0,0.82fr)_minmax(0,1.4fr)] sm:gap-12 lg:gap-16">
        <Reveal>
          <h2 className="display text-[clamp(1.85rem,3.2vw,2.55rem)] text-foreground">
            Yea..It&apos;s Me <span aria-hidden="true">😊</span>
          </h2>
          <p className="mt-2 font-display text-[1.05rem] italic text-muted">Come hang for a minute.</p>
          <button
            type="button"
            onClick={() => playerRef.current?.toggle({ reveal: true })}
            aria-pressed={playing}
            className="mt-4 inline-flex items-center gap-2.5 text-sm text-[#e07a3c]"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e07a3c] text-black">
              {playing ? (
                <Pause size={10} aria-hidden="true" strokeWidth={2.5} />
              ) : (
                <Play size={10} aria-hidden="true" className="ml-px fill-current" />
              )}
            </span>
            {playing ? 'Pause' : 'Play'}
          </button>
          <p className="mt-4 max-w-[26rem] text-[0.84rem] leading-relaxed text-muted">
            This is me, beyond the portfolio. A visual introduction to the ideas I explore, the things I
            create, and the questions that keep me curious. Technology, music, photography, writing, and
            everything in between - brought together in one frame.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <FilmPlayer
            ref={playerRef}
            youtubeId={media.videos.introductionYouTubeId}
            onPlaybackChange={setPlaying}
          />
        </Reveal>
      </div>
    </Section>
  );
}
