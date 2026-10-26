import { getArtworks } from '@/lib/content';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SlotFrame } from '@/components/ui/SlotFrame';
import { Reveal } from '@/components/ui/Reveal';

/**
 * Gallery hang, not a grid: one dominant piece with two smaller works beside
 * it, and enough empty wall around them that the eye settles on the big one
 * first.
 */
export async function FeaturedArtwork() {
  const artworks = (await getArtworks()).filter((artwork) => artwork.featured).slice(0, 3);
  if (artworks.length === 0) return null;

  const [dominant, ...supporting] = artworks;

  return (
    <Section border="top" atmosphere="atmos-gallery">
      <SectionHeading
        eyebrow="Featured artwork"
        title={
          <>
            Another side of <span className="warm-italic">the same mind.</span>
          </>
        }
        cta={{ label: 'Enter gallery', href: '/archive/artwork' }}
        accentClassName="text-accent-rose"
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-7">
          <figure>
            <SlotFrame label="Artwork" ratio="4 / 5" tone="rose" />
            <figcaption className="mt-4 flex items-baseline justify-between gap-4">
              <span className="text-sm text-foreground">{dominant.title}</span>
              <span className="meta">
                {dominant.medium} · {dominant.year}
              </span>
            </figcaption>
          </figure>
        </Reveal>

        <div className="flex flex-col justify-end gap-6 lg:col-span-4 lg:col-start-9">
          {supporting.map((artwork, index) => (
            <Reveal key={artwork.slug} delay={0.08 + index * 0.06}>
              <figure>
                <SlotFrame label="Artwork" ratio="1 / 1" tone="neutral" />
                <figcaption className="mt-3 flex items-baseline justify-between gap-4">
                  <span className="text-[0.82rem] text-muted">{artwork.title}</span>
                  <span className="meta">{artwork.year}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
