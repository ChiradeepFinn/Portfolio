import type { Metadata } from 'next';
import { withCanonical } from '@/lib/seo';
import { bucketChapters } from '@/lib/data/bucket-list';
import { PageHeader } from '@/components/layout/PageHeader';
import { BucketListJourney } from '@/components/bucket-list/BucketListJourney';

export const metadata: Metadata = withCanonical('/bucket-list', {
  title: 'Bucket List',
  description:
    'A quiet personal list of places to stand in, songs to hear live, things still to make, and nights that keep coming back.',
});

export default function BucketListPage() {
  return (
    <>
      <PageHeader
        eyebrow="Bucket list"
        title="Still ahead."
        description="A personal list — places I want to stand in, things I want to make, nights I hope to have. Nothing formal. Just the ones that keep coming back."
        width="narrow"
      />
      <BucketListJourney chapters={bucketChapters} />
    </>
  );
}
