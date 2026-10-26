import type { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { Book, Track } from '@/lib/types';
import { cn } from '@/lib/utils';
import type { ResearchStudy } from '@/lib/data/research';
import {
  artworkWorld,
  booksWorld,
  musicWorld,
  philosophyThemes,
  philosophyWorld,
  photographyWorld,
  researchWorld,
} from '@/lib/data/worlds';
import { listPublicImages } from '@/lib/public-images';
import { isBlank } from '@/lib/present';
import { FrameBreak } from '@/components/layout/FrameBreak';
import { Section } from '@/components/layout/Section';
import { ArrowPill } from '@/components/ui/ArrowPill';
import { BookPlate } from '@/components/books/BookPlate';
import { Reveal } from '@/components/ui/Reveal';
import { SlotFrame } from '@/components/ui/SlotFrame';
import { DawMarks } from '@/components/music/DawMarks';
import { WorldHeadline } from '@/components/worlds/WorldMarks';

/** Below-fold BounceCards host — split without changing spring props. */
const PictureBounce = dynamic(() =>
  import('@/components/home/PictureBounce').then((mod) => mod.PictureBounce),
);

interface HomeWorldsProps {
  readonly track: Track | null;
  readonly book: Book | null;
  readonly studies: readonly ResearchStudy[];
}

/**
 * Five doorways after the studies. Each one keeps its own alignment so the
 * run does not read as a repeated card.
 */
/**
 * The same right-hand brow as the closing band: wide tracking, a lighter weight,
 * and a plain ellipsis. It sits on the heading's right, and above it on a narrow screen.
 */
function AsideIndex({
  label,
  className,
}: {
  readonly label: string;
  readonly className?: string;
}) {
  return (
    <p
      className={cn(
        'eyebrow shrink-0 text-right font-normal tracking-[0.32em] whitespace-nowrap text-[0.65rem] sm:pt-2',
        className,
      )}
    >
      {label}
      <span className="tracking-normal">...</span>
    </p>
  );
}

function HeadingRow({
  mark,
  children,
}: {
  readonly mark: ReactNode;
  readonly children: ReactNode;
}) {
  return (
    <div className="flex flex-col-reverse items-end gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-10">
      <div className="min-w-0 w-full sm:flex-1">{children}</div>
      {mark}
    </div>
  );
}

export function HomeWorlds({ track, book, studies }: HomeWorldsProps) {
  return (
    <>
      <MusicPreview track={track} />
      <BooksPreview book={book} />
      <ResearchPreview studies={studies} />
      <FramesPreview />
      <PhilosophyPreview />
    </>
  );
}

function MusicPreview({ track }: { readonly track: Track | null }) {
  const named = track && !track.isPlaceholder;
  const playable = named ? track.listenUrl : null;

  return (
    <Section id="music" compact backdrop={<FrameBreak />} labelledBy="home-music">
      <HeadingRow mark={<AsideIndex label={musicWorld.label} className="text-muted-2" />}>
        <WorldHeadline
          as="h2"
          id="home-music"
          headline={musicWorld.headline}
          className="max-w-xl text-[clamp(2rem,4.2vw,3.15rem)]"
        />
      </HeadingRow>

      <p className="mt-8 max-w-lg font-display text-[clamp(1.35rem,2.2vw,1.7rem)] leading-snug text-foreground italic">
        I record at home, mostly at night.
      </p>

      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)] lg:gap-x-16 xl:gap-x-24">
        <p className="max-w-md text-[clamp(1.05rem,1.35vw,1.2rem)] leading-[1.55] text-muted">
          Soft dream-pop loops when the house is quiet, bedroom takes that never leave the room,
          then something cinematic or ambient if the night runs long enough.
        </p>

        <div className="flex flex-col gap-7 lg:pt-1">
          <div>
            <DawMarks />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
              BandLab on the couch, FL Studio when I sit down properly, GarageBand if the melody
              won&apos;t wait. Whatever is already open usually wins.
            </p>
          </div>

          <div className="border-t border-border pt-5">
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              {named ? (
                <>
                  <span className="text-foreground">{track.title}</span>
                  {!isBlank(track.mood) ? <span> · {track.mood}</span> : null}
                </>
              ) : (
                'A title appears when there is a recording to name.'
              )}
            </p>
            <ArrowPill href={musicWorld.href} className="mt-5">
              {musicWorld.enter}
            </ArrowPill>
            {playable && named ? (
              <audio controls preload="none" className="mt-5 w-full" aria-label={`Play ${track.title}`}>
                <source src={playable} />
              </audio>
            ) : null}
          </div>
        </div>
      </div>
    </Section>
  );
}

function BooksPreview({ book }: { readonly book: Book | null }) {
  const description =
    book?.title === 'The Inward Silhouette'
      ? 'You recognize a person by their outline. But outlines don’t show what’s breaking, building, or quietly unraveling inside. This book lives in that gap between the self the world sees and the one that never surfaces. A mirror you didn’t know you were holding.'
      : booksWorld.homeLead;

  return (
    <Section id="books" compact backdrop={<FrameBreak />} labelledBy="home-books">
      <HeadingRow
        mark={
          <AsideIndex label={booksWorld.label} className="text-muted-2" />
        }
      >
        <WorldHeadline
          as="h2"
          id="home-books"
          headline={booksWorld.headline}
          className="max-w-xl text-[clamp(2.15rem,4.6vw,3.6rem)]"
        />
      </HeadingRow>
      <div className="mx-auto mt-8 grid w-full max-w-[58rem] items-center gap-8 sm:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)] sm:gap-x-12 lg:gap-x-14">
        <div className={book ? 'book-home' : undefined}>
          {book ? (
            <BookPlate title={book.title} />
          ) : (
            <SlotFrame label="Cover" ratio="2 / 3" tone="neutral" className="max-w-[14rem]" />
          )}
        </div>
        <div className="w-full min-w-0">
          {book?.title === 'The Inward Silhouette' ? (
            <p className="mb-3 font-display text-[clamp(1.15rem,1.4vw,1.35rem)] leading-snug text-foreground italic">
              A treasure born from my imagination..
            </p>
          ) : null}
          <p className="text-[clamp(1.05rem,1.25vw,1.3rem)] leading-[1.55] text-muted">{description}</p>
          <ArrowPill href={book ? booksWorld.anchor : booksWorld.href} className="mt-4">
            {booksWorld.enter}
          </ArrowPill>
        </div>
      </div>
    </Section>
  );
}

function ResearchPreview({ studies }: { readonly studies: readonly ResearchStudy[] }) {
  return (
    <Section id="research" compact backdrop={<FrameBreak />} labelledBy="home-research">
      <HeadingRow
        mark={
          <AsideIndex label={researchWorld.label} className="text-muted-2" />
        }
      >
        <WorldHeadline
          as="h2"
          id="home-research"
          headline={researchWorld.headline}
          className="max-w-2xl text-[clamp(2rem,4.2vw,3.15rem)]"
        />
      </HeadingRow>
      <div className="mt-8 border-t border-border pt-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-md font-display text-[clamp(1.2rem,2vw,1.5rem)] leading-snug text-foreground italic">
            {researchWorld.homeLead}
          </p>
          <ArrowPill href={researchWorld.href} className="shrink-0">
            {researchWorld.enter}
          </ArrowPill>
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-x-16">
        {studies.map((study) => (
          <article key={study.slug} className="border-t border-border pt-6">
            <div className="flex items-baseline justify-between gap-4">
              <p className="meta">{study.index}</p>
              <p className="inline-flex items-center gap-2 text-[0.78rem] font-medium text-foreground">
                {study.status === 'In progress' ? (
                  <span className="status-pulse" aria-hidden="true" />
                ) : null}
                {study.status}
              </p>
            </div>
            <h3 className="mt-4 text-balance text-[1.05rem] leading-snug text-foreground">
              <Link
                href={`/archive/research/${study.slug}`}
                className="transition-colors duration-200 hover:text-warm-2"
              >
                {study.displayTitle}
              </Link>
            </h3>
            <p className="mt-3 font-display text-[1.02rem] leading-snug text-foreground italic">{study.question}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{study.summary}</p>
            <dl className="mt-5 grid gap-3">
              {study.previewFacts.map((fact) => (
                <div key={fact.label} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3">
                  <dt className="text-[0.62rem] tracking-[0.14em] text-muted-2 uppercase">{fact.label}</dt>
                  <dd className="text-[0.78rem] leading-relaxed text-muted">{fact.value}</dd>
                </div>
              ))}
            </dl>
            <ArrowPill
              href={`/archive/research/${study.slug}`}
              ariaLabel={
                study.status === 'Done'
                  ? `Open the study: ${study.title}`
                  : `See the progress: ${study.title}`
              }
              className="mt-6"
            >
              {study.status === 'Done' ? 'Open the study' : 'See the progress'}
            </ArrowPill>
          </article>
        ))}
      </div>
    </Section>
  );
}

function FramesPreview() {
  const photographs = listPublicImages('photography');
  const artworks = listPublicImages('artwork');

  return (
    <Section id="pictures" compact backdrop={<FrameBreak />} labelledBy="home-pictures">
      <HeadingRow
        mark={<AsideIndex label={photographyWorld.label} className="text-muted-2" />}
      >
        <WorldHeadline
          as="h2"
          id="home-pictures"
          headline={photographyWorld.headline}
          className="max-w-xl text-[clamp(1.9rem,3.8vw,2.8rem)]"
        />
      </HeadingRow>
      <div className="mt-5 flex flex-wrap gap-2 sm:justify-end">
        <ArrowPill href="/archive/photography">Photography</ArrowPill>
      </div>

      {photographs.length > 0 ? (
        <div className="mt-8">
          <PictureBounce images={photographs} label="Photograph" span="page" limit={photographs.length} />
        </div>
      ) : (
        <p className="meta mt-8">No photographs filed.</p>
      )}
      <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted">{photographyWorld.homeLead}</p>

      <div className="mt-12 border-t border-border pt-8">
        <HeadingRow mark={<AsideIndex label={artworkWorld.label} className="text-muted-2" />}>
          <WorldHeadline
            as="h3"
            id="home-artwork"
            headline={artworkWorld.headline}
            className="max-w-xl text-[clamp(1.6rem,3vw,2.2rem)]"
          />
        </HeadingRow>
        <div className="mt-5 flex flex-wrap gap-2 sm:justify-end">
          <ArrowPill href="/archive/artwork">Artwork</ArrowPill>
        </div>
        {artworks.length > 0 ? (
          <div className="mt-10 grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,26rem)] lg:gap-x-14">
            <PictureBounce images={artworks.slice(0, 6)} />
            <div className="max-w-md lg:max-w-none lg:justify-self-end">
              <p className="text-sm leading-relaxed text-muted">
                These drawings got tired of living in a folder.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Six of them talked their way onto the homepage. They are not a series. They just showed up
                and would not leave. The rest are on the artwork page, acting innocent.
              </p>
            </div>
          </div>
        ) : (
          <p className="meta mt-6">No artwork filed.</p>
        )}
      </div>
    </Section>
  );
}

/**
 * Measure variation so each subject reads as a margin note, not a stacked card.
 * Offsets stay light — hierarchy comes from type, not decoration.
 */
const PHILOSOPHY_MEASURE = [
  'max-w-[22rem] lg:ml-0',
  'max-w-[24rem] lg:ml-10',
  'max-w-[20rem] lg:ml-4',
  'max-w-[23rem] lg:ml-14',
  'max-w-[21rem] lg:ml-6',
] as const;

function PhilosophyPreview() {
  return (
    <Section
      id="philosophy"
      compact
      backdrop={<FrameBreak />}
      labelledBy="home-philosophy"
    >
      <HeadingRow
        mark={
          <AsideIndex
            label={`${philosophyWorld.index}/${philosophyWorld.label}`}
            className="max-w-[14rem] whitespace-normal text-muted-2 sm:max-w-none sm:whitespace-nowrap"
          />
        }
      >
        <WorldHeadline
          as="h2"
          id="home-philosophy"
          headline={philosophyWorld.headline}
          className="max-w-[13ch] text-[clamp(2.45rem,5.6vw,4rem)] leading-[0.94]"
        />
      </HeadingRow>

      <div className="mt-10 grid items-start gap-12 lg:mt-12 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-x-16 xl:gap-x-24">
        <div className="max-w-sm">
          <p className="max-w-[34ch] text-[0.8rem] leading-relaxed text-muted-2">
            {philosophyWorld.homeLead}
          </p>
          <ArrowPill href={philosophyWorld.href} className="mt-8">
            {philosophyWorld.enter}
          </ArrowPill>
        </div>

        <ul className="flex flex-col border-t border-border" aria-label="Philosophy subjects">
          {philosophyThemes.map((theme, index) => (
            <li
              key={theme.title}
              className={cn(
                'group border-b border-border py-7 first:pt-6 last:border-b-0 last:pb-0',
                PHILOSOPHY_MEASURE[index] ?? 'max-w-[22rem]',
              )}
            >
              <Reveal delay={0.04 + index * 0.06}>
                <p className="font-display text-[clamp(1.08rem,1.65vw,1.32rem)] leading-[1.35] text-muted italic transition-colors duration-300 ease-cinematic group-hover:text-foreground">
                  {theme.line}
                </p>
                <p className="meta mt-3 text-[0.62rem] tracking-[0.12em] text-muted-2">
                  <span className="tabular-nums text-muted-2/70">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="mx-1.5 opacity-40" aria-hidden="true">
                    ·
                  </span>
                  {theme.title}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
