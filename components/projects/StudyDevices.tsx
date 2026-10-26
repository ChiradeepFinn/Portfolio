import { Android } from '@/components/ui/android';
import { Safari } from '@/components/ui/safari';
import type { StudyScreenSet } from '@/lib/data/study-screens';
import { cn } from '@/lib/utils';

/**
 * Product frames for the study card.
 *
 * Android: stack at rest → fan on card `group-hover`.
 * Safari: both windows visible at rest (stacked peek); clearer fan on
 * `group-hover`; stage clips to the card — no spill past the shell.
 */

type StudyDevicesProps = {
  readonly slug: string;
  readonly set: StudyScreenSet;
  readonly lift?: boolean;
};

const ease =
  'transition-[translate,scale,rotate,filter,z-index] duration-[750ms] ease-cinematic motion-reduce:transition-none';

export function StudyDevices({ slug, set, lift = false }: StudyDevicesProps) {
  const android = set.device === 'android';

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden',
        android ? 'aspect-[4/3]' : 'aspect-[16/10]',
      )}
    >
      {android ? (
        <AndroidFan slug={slug} screens={set.screens} lift={lift} />
      ) : (
        <SafariPair slug={slug} screens={set.screens} lift={lift} />
      )}
    </div>
  );
}

function SafariPair({
  slug,
  screens,
  lift,
}: {
  readonly slug: string;
  readonly screens: StudyScreenSet['screens'];
  readonly lift: boolean;
}) {
  const [back, front] = [screens[0], screens[1]];

  /**
   * Contained fan: both windows peek at rest; hover separates more.
   * Widths are inline (TW % widths were flaky). Translate/rotate live in
   * globals.css via data-safari-frame — group-hover arbitrary utilities
   * were not emitted. Overflow-hidden on stage + card clips the shell.
   */
  return (
    <div className="absolute inset-0">
      {/* Back — peeks left at rest; fans further left on expand */}
      <div
        data-safari-frame="back"
        {...(!lift ? { 'data-safari-open': '' } : {})}
        className={cn(
          ease,
          'absolute top-[8%] left-1/2 z-[1] origin-center',
          '[filter:drop-shadow(0_10px_18px_rgba(0,0,0,0.28))]',
          lift &&
            cn(
              'group-hover:[filter:drop-shadow(0_14px_22px_rgba(0,0,0,0.34))]',
              'hover:z-30 hover:scale-[1.015]',
              'hover:[filter:drop-shadow(0_18px_26px_rgba(0,0,0,0.4))]',
            ),
        )}
        style={{ width: '56%' }}
      >
        <Safari
          uid={`${slug}-safari-0`}
          mode="simple"
          url={back?.url}
          imageSrc={back?.src}
          className="w-full"
        />
      </div>
      {/* Front — peeks right at rest; fans further right on expand */}
      <div
        data-safari-frame="front"
        {...(!lift ? { 'data-safari-open': '' } : {})}
        className={cn(
          ease,
          'absolute top-[5%] left-1/2 z-10 origin-center',
          '[filter:drop-shadow(0_14px_22px_rgba(0,0,0,0.32))]',
          lift &&
            cn(
              'group-hover:[filter:drop-shadow(0_16px_24px_rgba(0,0,0,0.36))]',
              'hover:z-30 hover:scale-[1.015]',
              'hover:[filter:drop-shadow(0_20px_28px_rgba(0,0,0,0.42))]',
            ),
        )}
        style={{ width: '59%' }}
      >
        <Safari
          uid={`${slug}-safari-1`}
          mode="simple"
          url={front?.url}
          imageSrc={front?.src}
          className="w-full"
        />
      </div>
    </div>
  );
}

function AndroidFan({
  slug,
  screens,
  lift,
}: {
  readonly slug: string;
  readonly screens: StudyScreenSet['screens'];
  readonly lift: boolean;
}) {
  const [left, center, right] = [screens[0], screens[1], screens[2]];

  /**
   * Zoomed-out vs prior pass (~0.82× widths) so the trio fits the
   * media box with breathing room. Centers kept at ref ratios:
   * Rest ~33/50/67, hover ~17.5/50/82.5; ±2.5° / ±5°; lighter crop.
   */
  return (
    <div className="absolute inset-0">
      {/* Left */}
      <div
        className={cn(
          ease,
          'absolute bottom-[-12%] left-1/2 z-[1] w-[28%] origin-bottom',
          '[filter:drop-shadow(0_14px_22px_rgba(0,0,0,0.32))]',
          lift
            ? cn(
                // Rest: ~33% of stage
                '-translate-x-[111%] -rotate-[2.5deg] translate-y-[2%]',
                // Fan: ~17.5% of stage
                'group-hover:-translate-x-[166%] group-hover:translate-y-[4%] group-hover:-rotate-[5deg]',
                'group-hover:[filter:drop-shadow(0_16px_26px_rgba(0,0,0,0.38))]',
                'hover:z-30 hover:scale-[1.02]',
                'hover:[filter:drop-shadow(0_20px_30px_rgba(0,0,0,0.44))]',
              )
            : '-translate-x-[166%] translate-y-[4%] -rotate-[5deg]',
        )}
      >
        <Android uid={`${slug}-android-0`} src={left?.src} className="h-auto w-full" />
      </div>

      {/* Center — dominant */}
      <div
        className={cn(
          ease,
          'absolute bottom-[-10%] left-1/2 z-20 w-[33%] origin-bottom',
          '[filter:drop-shadow(0_18px_28px_rgba(0,0,0,0.4))]',
          lift
            ? cn(
                '-translate-x-1/2 translate-y-[1%]',
                'group-hover:-translate-x-1/2 group-hover:-translate-y-[2%]',
                'group-hover:[filter:drop-shadow(0_22px_32px_rgba(0,0,0,0.46))]',
                'hover:z-30 hover:scale-[1.02]',
                'hover:[filter:drop-shadow(0_26px_36px_rgba(0,0,0,0.5))]',
              )
            : '-translate-x-1/2 -translate-y-[2%]',
        )}
      >
        <Android uid={`${slug}-android-1`} src={center?.src} className="h-auto w-full" />
      </div>

      {/* Right */}
      <div
        className={cn(
          ease,
          'absolute bottom-[-12%] left-1/2 z-[2] w-[28%] origin-bottom',
          '[filter:drop-shadow(0_14px_22px_rgba(0,0,0,0.32))]',
          lift
            ? cn(
                // Rest: ~67% of stage
                'translate-x-[11%] rotate-[2.5deg] translate-y-[2%]',
                // Fan: ~82.5% of stage
                'group-hover:translate-x-[66%] group-hover:translate-y-[4%] group-hover:rotate-[5deg]',
                'group-hover:[filter:drop-shadow(0_16px_26px_rgba(0,0,0,0.38))]',
                'hover:z-30 hover:scale-[1.02]',
                'hover:[filter:drop-shadow(0_20px_30px_rgba(0,0,0,0.44))]',
              )
            : 'translate-x-[66%] translate-y-[4%] rotate-[5deg]',
        )}
      >
        <Android uid={`${slug}-android-2`} src={right?.src} className="h-auto w-full" />
      </div>
    </div>
  );
}
