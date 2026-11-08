import type { Metadata } from 'next';
import { withCanonical } from '@/lib/seo';
import { getTracks } from '@/lib/content';
import { musicInspirations } from '@/lib/data/music-inspirations';
import { musicWorld } from '@/lib/data/worlds';
import { Section } from '@/components/layout/Section';
import { ArtistProfileCard } from '@/components/music/ArtistProfileCard';
import { Reveal } from '@/components/ui/Reveal';
import { MusicIntro } from '@/components/worlds/MusicIntro';

export const metadata: Metadata = withCanonical('/music', {
  title: 'Music',
  description: musicWorld.lead,
});

export default async function MusicPage() {
  const tracks = await getTracks();
  const released = tracks.filter((track) => !track.isPlaceholder);
  const featured = released.find((track) => track.featured) ?? released[0] ?? null;

  return (
    <>
      <MusicIntro track={featured} />

      <Section id="working-order" border="top" className="scroll-mt-28">
        <Reveal>
          <p className="eyebrow text-muted-2">Artists I keep returning to</p>
          <ul className="mt-8 grid grid-cols-3 gap-x-5 gap-y-8 sm:gap-x-8 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-10 lg:gap-y-10">
            {musicInspirations.map((artist) => (
              <li key={artist.name}>
                <ArtistProfileCard
                  name={artist.name}
                  role={artist.role}
                  image={artist.image}
                  alt={artist.alt}
                />
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>
    </>
  );
}
