import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getFeaturedResearch, getResearchStudy } from '@/lib/content';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { SlotFrame } from '@/components/ui/SlotFrame';
import { Schematic } from '@/components/research/Schematic';

/**
 * Research led by the question rather than the title. The question is set at
 * display size and the paper's metadata is filed beneath it like a header
 * block on a preprint.
 */
export async function FeaturedResearch() {
  const paper = await getFeaturedResearch();
  if (!paper) return null;
  const study = getResearchStudy(paper.slug);
  const href = study ? `/archive/research/${study.slug}` : '/archive/research';

  return (
    <Section border="top" atmosphere="atmos-blueprint">
      <p className="eyebrow text-accent-blue">Featured research</p>

      <div className="mt-6 grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        <Reveal>
          <h2 className="display text-balance text-[clamp(1.9rem,4.4vw,3rem)] text-foreground">
            {paper.question}
          </h2>

          <p className="body-copy mt-7 max-w-xl">{paper.abstract}</p>

          <dl className="mt-9 grid max-w-xl gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
            <div className="bg-surface px-4 py-3.5 sm:col-span-2">
              <dt className="text-[0.62rem] tracking-[0.14em] text-muted-2 uppercase">Paper</dt>
              <dd className="mt-1.5 text-[0.8rem] leading-relaxed text-muted">{paper.title}</dd>
            </div>
            {[
              { term: 'Field', value: paper.field },
              { term: 'Status', value: paper.status },
            ].map((row) => (
              <div key={row.term} className="bg-surface px-4 py-3.5">
                <dt className="text-[0.62rem] tracking-[0.14em] text-muted-2 uppercase">{row.term}</dt>
                <dd className="mt-1.5 text-[0.8rem] text-muted">{row.value}</dd>
              </div>
            ))}
          </dl>

          <Link
            href={href}
            className="link-underline mt-9 inline-flex text-sm text-muted transition-colors duration-200 hover:text-foreground"
          >
            {study ? 'Read the investigation' : 'Read research'}
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </Reveal>

        <Reveal delay={0.08} className="lg:max-w-sm lg:justify-self-end lg:pt-4">
          {study ? <Schematic kind={study.figure} /> : <SlotFrame label="Paper preview" ratio="3 / 4" tone="blue" />}
        </Reveal>
      </div>
    </Section>
  );
}
