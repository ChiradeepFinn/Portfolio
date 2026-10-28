import { Android } from '@/components/ui/android';
import { Safari } from '@/components/ui/safari';
import type { StudyScreenSet } from '@/lib/data/study-screens';
import { cn } from '@/lib/utils';

/**
 * Product frames for the study card.
 *
 * Mobile/tablet: always the open (hovered) layout.
 * Desktop (lg+): rest → open on card hover.
 * Stage + card both clip - nothing leaves the rounded plate.
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
        'relative flex w-full items-center justify-center overflow-hidden',
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
   * Geometry in globals.css via data-safari-frame.
   * Desk is sized to the windows and flex-centered in the plate stage.
   * Below lg the open split is the default; lg+ uses rest → hover.
   */
  return (
    <div className="relative w-[88%]" style={{ aspectRatio: '2.35 / 1' }}>
      <div
        data-safari-frame="back"
        {...(!lift ? { 'data-safari-open': '' } : {})}
        className={cn(
          ease,
          'absolute bottom-0 left-1/2 z-[1] origin-bottom',
          '[filter:drop-shadow(0_18px_30px_rgba(0,0,0,0.4))]',
          lift && 'lg:[filter:drop-shadow(0_12px_22px_rgba(0,0,0,0.3))] lg:group-hover:[filter:drop-shadow(0_18px_30px_rgba(0,0,0,0.4))]',
        )}
        style={{ width: '62%' }}
      >
        <Safari
          uid={`${slug}-safari-0`}
          mode="simple"
          url={back?.url}
          imageSrc={back?.src}
          className="w-full"
        />
      </div>
      <div
        data-safari-frame="front"
        {...(!lift ? { 'data-safari-open': '' } : {})}
        className={cn(
          ease,
          'absolute bottom-0 left-1/2 z-10 origin-bottom',
          '[filter:drop-shadow(0_22px_34px_rgba(0,0,0,0.44))]',
          lift && 'lg:[filter:drop-shadow(0_16px_26px_rgba(0,0,0,0.36))] lg:group-hover:[filter:drop-shadow(0_22px_34px_rgba(0,0,0,0.44))]',
        )}
        style={{ width: '62%' }}
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
   * Below lg: always the open fan (hovered look).
   * lg+: sunk rest → lift + wider fan on group-hover.
   */
  return (
    <div className="absolute" style={{ top: '2%', right: '4%', bottom: 0, left: '4%' }}>
      {/* Left */}
      <div
        className={cn(
          ease,
          'absolute bottom-0 left-1/2 z-[1] w-[30%] origin-bottom',
          '[filter:drop-shadow(0_18px_28px_rgba(0,0,0,0.4))]',
          lift
            ? cn(
                '-translate-x-[148%] translate-y-[4%] scale-100',
                'lg:-translate-x-[108%] lg:translate-y-[25%] lg:scale-[0.96] lg:[filter:drop-shadow(0_12px_20px_rgba(0,0,0,0.3))]',
                'lg:group-hover:-translate-x-[148%] lg:group-hover:translate-y-[4%] lg:group-hover:scale-100',
                'lg:group-hover:[filter:drop-shadow(0_18px_28px_rgba(0,0,0,0.4))]',
              )
            : '-translate-x-[148%] translate-y-[4%]',
        )}
      >
        <Android uid={`${slug}-android-0`} src={left?.src} className="h-auto w-full" />
      </div>

      {/* Center */}
      <div
        className={cn(
          ease,
          'absolute bottom-0 left-1/2 z-20 w-[34%] origin-bottom',
          '[filter:drop-shadow(0_22px_34px_rgba(0,0,0,0.46))]',
          lift
            ? cn(
                '-translate-x-1/2 translate-y-[2%] scale-[1.02]',
                'lg:translate-y-[25%] lg:scale-100 lg:[filter:drop-shadow(0_16px_26px_rgba(0,0,0,0.38))]',
                'lg:group-hover:translate-y-[2%] lg:group-hover:scale-[1.02]',
                'lg:group-hover:[filter:drop-shadow(0_22px_34px_rgba(0,0,0,0.46))]',
              )
            : '-translate-x-1/2 translate-y-[2%] scale-[1.02]',
        )}
      >
        <Android uid={`${slug}-android-1`} src={center?.src} className="h-auto w-full" />
      </div>

      {/* Right */}
      <div
        className={cn(
          ease,
          'absolute bottom-0 left-1/2 z-[2] w-[30%] origin-bottom',
          '[filter:drop-shadow(0_18px_28px_rgba(0,0,0,0.4))]',
          lift
            ? cn(
                'translate-x-[48%] translate-y-[4%] scale-100',
                'lg:translate-x-[8%] lg:translate-y-[25%] lg:scale-[0.96] lg:[filter:drop-shadow(0_12px_20px_rgba(0,0,0,0.3))]',
                'lg:group-hover:translate-x-[48%] lg:group-hover:translate-y-[4%] lg:group-hover:scale-100',
                'lg:group-hover:[filter:drop-shadow(0_18px_28px_rgba(0,0,0,0.4))]',
              )
            : 'translate-x-[48%] translate-y-[4%]',
        )}
      >
        <Android uid={`${slug}-android-2`} src={right?.src} className="h-auto w-full" />
      </div>
    </div>
  );
}
