import type { Metadata } from 'next';
import { withCanonical } from '@/lib/seo';
import { getTracks } from '@/lib/content';
import { musicWorld } from '@/lib/data/worlds';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { MusicIntro } from '@/components/worlds/MusicIntro';
import { isBlank } from '@/lib/present';

export const metadata: Metadata = withCanonical('/music', {
  title: 'Music',
  description: musicWorld.lead,
});

/** Artists and the working order. Not a claim about releases or credits. */
const inspirations = [
  'Conan Gray',
  'Billie Eilish',
  'FINNEAS',
  'JVKE',
  'LANY',
  'Cigarettes After Sex',
] as const;

const workflow = [
  { step: '01', title: 'A phrase first', note: 'A line or a chord that will not leave. Everything grows from it.' },
  { step: '02', title: 'Build the room', note: 'Space, reverb, and noise before arrangement - the mood decides the parts.' },
  { step: '03', title: 'Sing it badly', note: 'A rough vocal early, to find out whether the song is actually there.' },
  { step: '04', title: 'Take things away', note: 'The last pass is subtraction. Most tracks improve by losing something.' },
] as const;

export default async function MusicPage() {
  const tracks = await getTracks();
  const released = tracks.filter((track) => !track.isPlaceholder);
  const featured = released.find((track) => track.featured) ?? released[0] ?? null;

  return (
    <>
      <MusicIntro track={featured} />

      <Section id="releases" border="top" className="scroll-mt-28 pt-0" labelledBy="releases-heading">
        <p className="eyebrow text-accent-purple">Releases</p>
        <h2 id="releases-heading" className="display mt-4 text-[clamp(1.7rem,3.6vw,2.6rem)] text-foreground">
          {released.length > 0 ? 'Named recordings.' : 'Nothing filed yet.'}
        </h2>

        {released.length === 0 ? (
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted">
            Titles will be listed when there is a recording to name. Styles and the way a track gets made are below.
          </p>
        ) : (
          <ul className="mt-10 grid gap-px overflow-hidden rounded-card border border-border bg-border">
            {released.map((track, index) => (
              <li key={track.slug} className="bg-surface transition-colors duration-300 hover:bg-surface-2">
                <Reveal delay={index * 0.05} className="flex flex-wrap items-center gap-x-6 gap-y-2 px-6 py-5">
                  <span className="meta w-8 shrink-0">{String(index + 1).padStart(2, '0')}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-foreground">{track.title}</span>
                    {!isBlank(track.note) ? (
                      <span className="mt-1 block text-xs text-muted-2">{track.note}</span>
                    ) : null}
                  </span>
                  {!isBlank(track.duration) ? <span className="meta shrink-0">{track.duration}</span> : null}
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section border="top">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="eyebrow text-accent-purple">Artists I keep returning to</p>
            <ul className="mt-6 grid gap-2.5">
              {inspirations.map((artist) => (
                <li key={artist} className="border-b border-border pb-2.5 text-sm text-muted">
                  {artist}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="eyebrow text-accent-purple">How a track happens</p>
            <ol className="mt-6 grid gap-6">
              {workflow.map((item) => (
                <li key={item.step} className="flex gap-5 border-t border-border pt-5">
                  <span className="meta shrink-0">{item.step}</span>
                  <span>
                    <span className="block text-sm text-foreground">{item.title}</span>
                    <span className="mt-1.5 block text-sm leading-relaxed text-muted-2">{item.note}</span>
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
