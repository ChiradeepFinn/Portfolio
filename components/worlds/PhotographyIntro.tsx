import { photographyWorld } from '@/lib/data/worlds';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { IntroFrame, WorldHeadline, WorldIndex, WorldTags } from './WorldMarks';

/**
 * Type leads, then the wall. The gallery underneath is the photographs.
 */
export function PhotographyIntro() {
  return (
    <IntroFrame atmosphere="atmos-darkroom" className="pb-6 sm:pb-8">
      <Breadcrumbs
        crumbs={[
          { name: 'Archive', path: '/archive' },
          { name: 'Photography' },
        ]}
      />
      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <WorldIndex index={photographyWorld.index} label="Photography" className="text-muted-2" />
          <WorldHeadline
            headline={photographyWorld.headline}
            className="mt-4 text-[clamp(2.1rem,4.6vw,3.5rem)]"
          />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">{photographyWorld.lead}</p>
        </div>
        <div className="lg:pb-2">
          <WorldTags tags={photographyWorld.tags} />
        </div>
      </div>
    </IntroFrame>
  );
}
