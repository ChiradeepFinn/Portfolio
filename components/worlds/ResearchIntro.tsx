import type { ResearchStudy } from '@/lib/data/research';
import { researchWorld } from '@/lib/data/worlds';
import { ArrowPill } from '@/components/ui/ArrowPill';
import { Schematic } from '@/components/research/Schematic';
import { IntroFrame, WorldHeadline, WorldIndex, WorldTags } from './WorldMarks';

/**
 * A precise opening: the question-led headline, the status of the shelf,
 * and one diagram. The investigations themselves start below.
 */
export function ResearchIntro({ studies }: { readonly studies: readonly ResearchStudy[] }) {
  const featured = studies.find((study) => study.featured) ?? studies[0];
  const tally = studies.map((study) => `${study.index} ${study.status}`).join('  ·  ');

  return (
    <IntroFrame atmosphere="atmos-blueprint">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.2fr)_16rem] lg:gap-14">
        <div>
          <WorldIndex index={researchWorld.index} label={researchWorld.label} className="text-accent-blue" />
          <WorldHeadline
            headline={researchWorld.headline}
            className="mt-5 max-w-3xl text-[clamp(2.2rem,5vw,3.9rem)]"
          />
          <p className="body-copy mt-6 max-w-2xl">{researchWorld.lead}</p>
          <p className="meta mt-6">{tally}</p>
          <WorldTags tags={researchWorld.tags} className="mt-6" />
          <ArrowPill href={researchWorld.anchor} className="mt-8">
            {researchWorld.enter}
          </ArrowPill>
        </div>
        {featured ? <Schematic kind={featured.figure} className="lg:mt-8" /> : null}
      </div>
    </IntroFrame>
  );
}
