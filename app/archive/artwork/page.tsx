import type { Metadata } from 'next';
import { withCanonical } from '@/lib/seo';
import { getArtworks } from '@/lib/content';
import { artworkWorld } from '@/lib/data/worlds';
import { listPublicImages } from '@/lib/public-images';
import { isBlank } from '@/lib/present';
import { Section } from '@/components/layout/Section';
import { Masonry } from '@/components/archive/Masonry';
import { ratioForSize, type GalleryItem } from '@/components/archive/gallery-item';
import { ArtworkIntro } from '@/components/worlds/ArtworkIntro';

export const metadata: Metadata = withCanonical('/archive/artwork', {
  title: 'Artwork',
  description: artworkWorld.lead,
});

export default async function ArtworkPage() {
  const files = listPublicImages('artwork');
  const artworks = files.length > 0 ? [] : await getArtworks();

  const items: GalleryItem[] =
    files.length > 0
      ? files.map((src, index) => ({
          slug: `artwork-file-${index + 1}`,
          title: 'Artwork',
          meta: '',
          ratio: '4 / 5',
          label: 'Artwork',
          src,
        }))
      : artworks.map((artwork) => ({
          slug: artwork.slug,
          title: artwork.isPlaceholder ? 'Reserved' : artwork.title,
          meta: artwork.isPlaceholder
            ? 'Artwork'
            : [artwork.medium, artwork.year].filter((value) => !isBlank(value)).join(' · '),
          ratio: ratioForSize(artwork.size),
          label: 'Artwork',
        }));

  return (
    <>
      <ArtworkIntro />

      <Section id="gallery" className="scroll-mt-28 pt-0" width="wide" labelledBy="gallery-heading">
        <h2 id="gallery-heading" className="sr-only">
          Gallery
        </h2>
        <Masonry items={items} />
      </Section>
    </>
  );
}
