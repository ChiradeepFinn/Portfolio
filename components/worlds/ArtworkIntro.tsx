import { artworkWorld } from '@/lib/data/worlds';
import { ArrowPill } from '@/components/ui/ArrowPill';
import { IntroFrame, WorldHeadline, WorldIndex, WorldTags } from './WorldMarks';

/**
 * Type leads, then the wall. The gallery underneath is the colour.
 */
export function ArtworkIntro() {
  return (
    <IntroFrame atmosphere="atmos-gallery" className="pb-6 sm:pb-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <WorldIndex index={artworkWorld.index} label={artworkWorld.label} className="text-accent-rose" />
          <WorldHeadline
            headline={artworkWorld.headline}
            className="mt-4 text-[clamp(2.3rem,5.2vw,4rem)]"
          />
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted">{artworkWorld.lead}</p>
        </div>
        <div className="lg:pb-2">
          <WorldTags tags={artworkWorld.tags} />
          <ArrowPill href={artworkWorld.anchor} className="mt-6">
            {artworkWorld.enter}
          </ArrowPill>
        </div>
      </div>
    </IntroFrame>
  );
}
