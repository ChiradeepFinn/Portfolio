import type { Metadata } from 'next';
import { withCanonical } from '@/lib/seo';
import { PageHeader } from '@/components/layout/PageHeader';

export const metadata: Metadata = withCanonical('/bucket-list', {
  title: 'Bucket List',
  description: 'Things still ahead.',
});

export default function BucketListPage() {
  return (
    <PageHeader
      eyebrow="Bucket list"
      title="Still ahead."
      description="The list is held open. Nothing goes here until it is a real intention."
      width="narrow"
    />
  );
}
