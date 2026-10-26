import type { Metadata } from 'next';
import { withCanonical } from '@/lib/seo';
import { getCertifications } from '@/lib/content';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';

export const metadata: Metadata = withCanonical('/archive/certifications', {
  title: 'Certifications',
  description: 'Courses and credentials.',
});

export default async function CertificationsPage() {
  const certifications = await getCertifications();

  return (
    <>
      <PageHeader
        eyebrow="Certifications"
        title="The proof shelf."
        description="Kept short on purpose. Credentials are context for the work, not the argument for it."
        atmosphere="atmos-spotlight"
      />

      <Section className="pt-0" width="narrow">
        {/* A ledger rather than a card grid: certificates are records, and
            records belong in rows. */}
        <ul className="grid gap-px overflow-hidden rounded-card border border-border bg-border">
          {certifications.map((certification, index) => (
            <li key={certification.slug} className="bg-surface">
              <Reveal
                delay={index * 0.04}
                className="flex flex-wrap items-baseline gap-x-6 gap-y-2 px-6 py-6"
              >
                <span className="meta w-8 shrink-0">{String(index + 1).padStart(2, '0')}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-foreground">{certification.title}</span>
                  <span className="mt-1 block text-xs text-muted-2">{certification.note}</span>
                </span>
                <span className="meta shrink-0">
                  {certification.issuer} · {certification.year}
                </span>
                {certification.verifyUrl && (
                  <a
                    href={certification.verifyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="link-underline shrink-0 text-xs text-muted"
                  >
                    Verify
                  </a>
                )}
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
