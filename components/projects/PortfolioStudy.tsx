import { siteStudy } from '@/lib/data/site-stack';
import { getStudyScreensBySlug } from '@/lib/data/study-screens';
import { StudyDevices } from '@/components/projects/StudyDevices';
import { Reveal } from '@/components/ui/Reveal';

const blueprintField =
  'radial-gradient(72% 68% at 0% 0%, rgba(255,255,255,0.28), transparent 44%), radial-gradient(78% 72% at 100% 100%, rgba(8,20,40,0.82), transparent 54%), linear-gradient(128deg, #dbe4f0 0%, #7a9bb8 18%, #3d5a73 46%, #1a2f42 72%, #0c1824 100%)';

/**
 * Spine entry 01: this site as a study card.
 * Same shell as the other studies — hook + device frame — no case-study link.
 * Centered on the timeline spine (no alternating two-column layout).
 */
export function PortfolioStudy() {
  const set = getStudyScreensBySlug(siteStudy.id);

  return (
    <article className="mx-auto w-full max-w-[min(100%,36rem)] lg:max-w-[42rem]">
      <div
        className="flex h-full flex-col overflow-hidden rounded-[1.65rem] border border-black/40 bg-[length:280%_280%] bg-[position:0%_0%] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:p-7"
        style={{ backgroundImage: blueprintField }}
      >
        <p className="max-w-[34rem] font-display text-[clamp(1.45rem,2.1vw,1.95rem)] leading-[1.18] font-normal tracking-[-0.02em] text-white">
          {siteStudy.hook}
        </p>
        <div className="mt-5 sm:mt-6">
          <div className="relative overflow-hidden">
            <StudyDevices slug={siteStudy.id} set={set} />
          </div>
        </div>
      </div>

      <Reveal delay={0.08}>
        <p className="mt-5 max-w-[34rem] text-[0.98rem] leading-[1.65] text-muted">{siteStudy.blurb}</p>
      </Reveal>
    </article>
  );
}
