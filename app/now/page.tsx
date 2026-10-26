import type { Metadata } from 'next';
import { withCanonical } from '@/lib/seo';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { GradientWord } from '@/components/ui/GradientWord';

export const metadata: Metadata = withCanonical('/now', {
  title: 'Now',
  description: 'What I am working on at the moment.',
});

/**
 * A /now page is only worth having if it is current, so the entries stay
 * explicitly empty rather than filled with plausible-sounding activity.
 */
const focuses = [
  { area: 'Building', note: 'Reserved - the current build goes here.' },
  { area: 'Recording', note: 'Reserved - whatever is in the session right now.' },
  { area: 'Reading', note: 'Reserved - the book on the desk.' },
  { area: 'Thinking about', note: 'Reserved - the question that will not leave.' },
] as const;

export default function NowPage() {
  return (
    <>
      <PageHeader
        eyebrow="Now"
        title={
          <>
            What I&apos;m doing <GradientWord>at the moment.</GradientWord>
          </>
        }
        description="A snapshot rather than a résumé. It changes when the work changes."
        width="narrow"
      />

      <Section className="pt-0" width="narrow">
        <dl className="grid gap-px overflow-hidden rounded-card border border-border bg-border">
          {focuses.map((item, index) => (
            <Reveal key={item.area} delay={index * 0.05}>
              <div className="bg-surface px-6 py-6">
                <dt className="text-[0.62rem] tracking-[0.14em] text-muted-2 uppercase">{item.area}</dt>
                <dd className="mt-2 text-sm text-muted">{item.note}</dd>
              </div>
            </Reveal>
          ))}
        </dl>
        <p className="meta mt-8">Last updated - pending</p>
      </Section>
    </>
  );
}
