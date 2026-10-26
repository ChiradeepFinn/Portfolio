import { philosophyThemes, philosophyWorld } from '@/lib/data/worlds';
import { ArrowPill } from '@/components/ui/ArrowPill';
import { IntroFrame, WorldHeadline, WorldIndex } from './WorldMarks';

/**
 * A title page, not a hero. One question, then the shelf.
 */
export function PhilosophyIntro() {
  return (
    <IntroFrame width="narrow" className="pb-8 sm:pb-10">
      <WorldIndex index={philosophyWorld.index} label={philosophyWorld.label} className="text-muted" />
      <WorldHeadline
        headline={philosophyWorld.headline}
        className="mt-6 text-[clamp(2.2rem,5vw,3.7rem)]"
      />
      <p className="body-copy mt-7">{philosophyWorld.lead}</p>
      <p className="meta mt-6">{philosophyThemes.length.toString().padStart(2, '0')} subjects · essays when written</p>
      <ArrowPill href={philosophyWorld.anchor} className="mt-8">
        {philosophyWorld.enter}
      </ArrowPill>
    </IntroFrame>
  );
}
