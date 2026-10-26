import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { identity } from '@/lib/site';
import { Section } from '@/components/layout/Section';
import { SlotFrame } from '@/components/ui/SlotFrame';
import { Reveal } from '@/components/ui/Reveal';

/**
 * The person, arriving late on purpose. By this point the visitor has seen the
 * work; this section answers who was behind all of it, briefly, and hands off
 * to the full story.
 */
export function FeaturedAbout() {
  return (
    <Section border="top" atmosphere="atmos-spotlight">
      <div className="grid gap-10 lg:grid-cols-[18rem_1fr] lg:gap-16">
        <Reveal>
          <SlotFrame label="Portrait" ratio="4 / 5" tone="neutral" />
        </Reveal>

        <Reveal delay={0.08} className="flex flex-col justify-center">
          <p className="eyebrow text-accent-blue">The person behind it</p>
          <h2 className="display mt-4 text-[clamp(1.9rem,4.4vw,3rem)] text-foreground">{identity.name}</h2>
          <p className="mt-2 text-sm text-muted-2">{identity.role}</p>

          <p className="body-copy mt-7 max-w-xl">
            Most of what I make sits at the edges between disciplines - where an interface decision is really a
            psychology decision, where a chord progression is really an engineering constraint, where a
            photograph and a line of code are both attempts to notice something clearly.
          </p>

          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
            <div>
              <dt className="text-[0.62rem] tracking-[0.14em] text-muted-2 uppercase">Based in</dt>
              <dd className="mt-1.5 text-sm text-muted">{identity.location}</dd>
            </div>
            <div>
              <dt className="text-[0.62rem] tracking-[0.14em] text-muted-2 uppercase">Working across</dt>
              <dd className="mt-1.5 text-sm text-muted">AI, web, music, words, images</dd>
            </div>
          </dl>

          <Link
            href="/about"
            className="link-underline mt-9 inline-flex text-sm text-muted transition-colors duration-200 hover:text-foreground"
          >
            Meet Me
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </Section>
  );
}
