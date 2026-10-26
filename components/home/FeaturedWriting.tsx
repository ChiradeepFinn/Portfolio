import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getFeaturedWriting } from '@/lib/content';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';

/**
 * Quiet by design. No heading block, no card - just an excerpt set on a narrow
 * measure and pushed off-centre, so the page slows down for a moment before
 * the collections start again.
 */
export async function FeaturedWriting() {
  const entry = await getFeaturedWriting();
  if (!entry) return null;

  return (
    <Section border="top" atmosphere="atmos-paper">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <p className="eyebrow text-warm-2">What I think</p>
          <p className="meta mt-4">{entry.category}</p>
          {entry.published && <p className="meta mt-1">{entry.published}</p>}
        </div>

        <Reveal className="lg:col-span-8 lg:col-start-5">
          <h2 className="display text-balance text-[clamp(1.8rem,4vw,2.8rem)] text-foreground">
            {entry.title}
          </h2>

          {/* The rule reads as a margin mark rather than a border, which keeps
              the passage feeling like a page instead of a component. */}
          <blockquote className="mt-8 border-l border-border pl-6 sm:pl-8">
            <p className="font-display text-[clamp(1.05rem,1.8vw,1.35rem)] leading-relaxed text-muted italic">
              {entry.excerpt}
            </p>
          </blockquote>

          <Link
            href="/about#writing"
            className="link-underline mt-8 inline-flex text-sm text-muted transition-colors duration-200 hover:text-foreground"
          >
            Read the thought
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </Section>
  );
}
