import { siteStudy } from '@/lib/data/site-stack';
import { getStudyScreensBySlug } from '@/lib/data/study-screens';
import { StackIcon } from '@/components/projects/ProjectDetail';
import { StudyDevices } from '@/components/projects/StudyDevices';
import { studyPlateFrameClass, studyPlateInnerClass } from '@/components/projects/study-plate';
import { Reveal } from '@/components/ui/Reveal';

const blueprintField =
  'radial-gradient(70% 60% at 12% 8%, rgba(148,180,210,0.12), transparent 52%), radial-gradient(80% 70% at 92% 96%, rgba(4,10,20,0.92), transparent 58%), linear-gradient(132deg, #081018 0%, #1a3048 28%, #2f4d68 52%, #122030 78%, #04080e 100%)';

/**
 * Spine entry 01: this site as a study card.
 * Same shell as the other studies - hook + device frame - no case-study link.
 * Centered on the timeline spine (no alternating two-column layout).
 */
export function PortfolioStudy() {
  const set = getStudyScreensBySlug(siteStudy.id);

  return (
    <article className="mx-auto w-full max-w-[min(100%,36rem)] lg:max-w-[42rem]">
      <div className={studyPlateFrameClass}>
        <div className={studyPlateInnerClass} style={{ backgroundImage: blueprintField }}>
          <p className="pointer-events-none absolute inset-x-5 top-5 z-10 max-w-[34rem] font-display text-[clamp(1.45rem,2.1vw,1.95rem)] leading-[1.18] font-normal tracking-[-0.02em] text-white sm:inset-x-7 sm:top-7">
            {siteStudy.hook}
          </p>
          <div className="relative overflow-hidden">
            <StudyDevices slug={siteStudy.id} set={set} />
          </div>
        </div>
      </div>

      <Reveal delay={0.08}>
        <ul className="mt-5 flex max-w-[36rem] flex-wrap gap-2">
          {siteStudy.stack.map((item) => (
            <li key={item}>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border-strong bg-chrome px-2.5 py-[0.4rem] text-[0.68rem] font-medium tracking-[0.11em] text-foreground uppercase">
                <StackIcon label={item} />
                {item}
              </span>
            </li>
          ))}
        </ul>
      </Reveal>
    </article>
  );
}
