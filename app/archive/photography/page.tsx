import type { Metadata } from 'next';
import { breadcrumbGraph, withCanonical } from '@/lib/seo';
import { getPhotographs } from '@/lib/content';
import { photographyWorld } from '@/lib/data/worlds';
import { listPublicImages } from '@/lib/public-images';
import { isBlank } from '@/lib/present';
import { JsonLd } from '@/components/seo/JsonLd';
import { Section } from '@/components/layout/Section';
import { Masonry } from '@/components/archive/Masonry';
import { ratioForSize, type GalleryItem } from '@/components/archive/gallery-item';
import { PhotographyIntro } from '@/components/worlds/PhotographyIntro';

export const metadata: Metadata = withCanonical('/archive/photography', {
  title: 'Photography',
  description: photographyWorld.lead,
});

export default async function PhotographyPage() {
  const crumbs = breadcrumbGraph([
    { name: 'Archive', path: '/archive' },
    { name: 'Photography' },
  ]);

  const files = listPublicImages('photography');
  const photographs = files.length > 0 ? [] : await getPhotographs();

  const items: GalleryItem[] =
    files.length > 0
      ? files.map((src, index) => ({
          slug: `photograph-file-${index + 1}`,
          title: 'Photograph',
          meta: '',
          ratio: '3 / 4',
          label: 'Photograph',
          src,
        }))
      : photographs.map((photograph) => ({
          slug: photograph.slug,
          title: photograph.isPlaceholder ? 'Reserved' : photograph.title,
          meta: photograph.isPlaceholder
            ? 'Photograph'
            : [photograph.place, photograph.captured].filter((value) => !isBlank(value)).join(' · '),
          ratio: ratioForSize(photograph.size),
          label: 'Photograph',
        }));

  return (
    <>
      {crumbs ? <JsonLd data={crumbs} /> : null}
      <PhotographyIntro />

      <Section id="gallery" className="scroll-mt-28 pt-0" width="wide" labelledBy="gallery-heading">
        <h2 id="gallery-heading" className="sr-only">
          Gallery
        </h2>
        <Masonry items={items} />
      </Section>
    </>
  );
}
