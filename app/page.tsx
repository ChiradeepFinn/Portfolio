import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { JsonLd } from '@/components/seo/JsonLd';
import { HOME_PAGE_TITLE, homeGraph, siteDescription, withCanonical } from '@/lib/seo';
import { IntroVideo } from '@/components/home/IntroVideo';
import { FeaturedProject } from '@/components/home/FeaturedProject';
import { HomeWorlds } from '@/components/home/HomeWorlds';
import { getBooks, getResearchStudies, getTracks } from '@/lib/content';

export const metadata: Metadata = withCanonical('/', {
  title: { absolute: HOME_PAGE_TITLE },
  description: siteDescription,
  // The twin of `/` is `/index.md`, not `/.md`.
  alternates: { types: { 'text/markdown': [{ url: '/index.md', title: 'Markdown' }] } },
});

/**
 * The homepage is the short version: who, the studies, then the other rooms.
 */
export default async function HomePage() {
  const [tracks, books] = await Promise.all([getTracks(), getBooks()]);

  const track = tracks.find((item) => item.featured && !item.isPlaceholder) ?? tracks.find((item) => !item.isPlaceholder) ?? null;
  const book = books.find((item) => !item.isPlaceholder) ?? null;
  const studies = getResearchStudies();

  return (
    <>
      <JsonLd data={homeGraph()} />
      <Hero />
      <IntroVideo />
      <FeaturedProject />
      <HomeWorlds track={track} book={book} studies={studies} />
    </>
  );
}
