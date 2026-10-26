import { getFeaturedTrack } from '@/lib/content';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SlotFrame } from '@/components/ui/SlotFrame';
import { Reveal } from '@/components/ui/Reveal';
import { Waveform } from '@/components/music/Waveform';

/**
 * The listening room, compressed into one band. Cover, title, and a waveform
 * running the full width - the horizontal emphasis is what separates this
 * section from the project door above it.
 */
export async function FeaturedMusic() {
  const track = await getFeaturedTrack();
  if (!track) return null;

  return (
    <Section border="top" atmosphere="atmos-room">
      <SectionHeading
        eyebrow="Featured music"
        title={
          <>
            What I make when <span className="warm-italic">the screen is off.</span>
          </>
        }
        lede="Dream pop and bedroom recordings - the same ideas as the code, in a language that does not need explaining."
        cta={{ label: 'Explore music', href: '/music' }}
        accentClassName="text-accent-purple"
      />

      <Reveal className="mt-12">
        <div className="grid gap-8 rounded-card border border-border bg-surface/60 p-5 sm:p-7 lg:grid-cols-[13rem_1fr] lg:items-center lg:gap-10">
          <SlotFrame label="Cover art" ratio="1 / 1" tone="rose" />

          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <h3 className="display text-[clamp(1.5rem,3vw,2.2rem)] text-foreground">{track.title}</h3>
              <p className="meta">
                {track.mood} · {track.duration} · {track.year}
              </p>
            </div>

            <p className="body-copy mt-4 max-w-xl text-[0.95rem]">{track.note}</p>

            <Waveform className="mt-7" />

            <p className="meta mt-4">
              {track.listenUrl ? 'Listen on BandLab' : 'No release attached to this slot yet'}
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
