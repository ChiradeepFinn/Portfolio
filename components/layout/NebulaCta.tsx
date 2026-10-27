'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { ArrowPill } from '@/components/ui/ArrowPill';
import { Reveal } from '@/components/ui/Reveal';
import { usePauseOffscreen } from '@/lib/use-pause-offscreen';

type Tint = '--star' | '--star-blue' | '--star-rose';

type Kind = 'dust' | 'mid' | 'bright';

type Star = {
  x: number;
  y: number;
  glow: number;
  tint: Tint;
  kind: Kind;
  o: number;
  dip: number;
  dur: number;
  delay: number;
  dx: number;
  dy: number;
  driftDur: number;
  driftDelay: number;
  shoot: boolean;
  angle: number;
  len: number;
  sx: number;
  sy: number;
  shootDur: number;
  shootDelay: number;
};

function mulberry32(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A fixed field so the server and the browser draw the same sky. Stars gather
 * on a tilted disk: warm toward one end, cool toward the other.
 */
function makeStars(seed: number, count: number): Star[] {
  const rand = mulberry32(seed);
  const stars: Star[] = [];

  for (let i = 0; i < count; i += 1) {
    const along = rand();
    const plane = 300 - along * 150;
    const arm = Math.abs(along - 0.3);
    const spread = 26 + arm * 160;
    const halo = rand() < 0.14;
    const y = halo
      ? 24 + rand() * 430
      : Math.min(464, Math.max(16, plane + (rand() + rand() + rand() - 1.5) * spread));
    const roll = rand();
    const hero = roll > 0.96;
    const bright = roll > 0.9;
    const mid = roll > 0.78;
    const tintRoll = rand();
    const tint: Tint =
      along < 0.36 && tintRoll > 0.58
        ? '--star-rose'
        : along > 0.5 && tintRoll > 0.46
          ? '--star-blue'
          : '--star';
    const glow = hero
      ? 16 + rand() * 6
      : bright
        ? 11 + rand() * 4
        : mid
          ? 6.5 + rand() * 2.2
          : 3.8 + rand() * 1.6;

    const kind: Kind = hero || bright ? 'bright' : mid ? 'mid' : 'dust';
    const angle = rand() * Math.PI * 2;
    const reach = 14 + rand() * 16;
    const shoot = kind !== 'dust';
    const slope = 0.28 + rand() * 0.85;
    const shootAngle = rand() < 0.5 ? slope : Math.PI - slope;
    const travel = !shoot ? 0 : kind === 'bright' ? 280 + rand() * 180 : 190 + rand() * 150;

    stars.push({
      x: along * 1600,
      y,
      glow,
      tint,
      kind,
      o: hero ? 1 : bright ? 0.92 : mid ? 0.72 : 0.28 + rand() * 0.28,
      dip: hero ? 0.62 : bright ? 0.5 : mid ? 0.32 : 0.08,
      dur: kind === 'bright' ? 2.4 + rand() * 2.2 : kind === 'mid' ? 1.8 + rand() * 1.8 : 2.6 + rand() * 2.4,
      delay: -rand() * 8,
      dx: Math.cos(angle) * reach,
      dy: Math.sin(angle) * reach * (0.55 + rand() * 0.7),
      driftDur: 4.2 + rand() * 3.2,
      driftDelay: -rand() * 8,
      shoot,
      angle: shootAngle,
      len: !shoot ? 0 : kind === 'bright' ? 54 + rand() * 34 : 32 + rand() * 22,
      sx: Math.cos(shootAngle) * travel,
      sy: Math.sin(shootAngle) * travel,
      shootDur: 8 + rand() * 6,
      shootDelay: -rand() * 14,
    });
  }

  return stars;
}

/** Desktop field. Phones use a thinner set so the GPU is not asked for 300 loops. */
const STARS = makeStars(11, 150);
const STARS_COMPACT = makeStars(11, 64);

function starStyle(star: Star): CSSProperties {
  return {
    color: `var(${star.tint})`,
    '--o': star.o,
    '--dip': star.dip,
    '--dur': `${star.dur}s`,
    '--delay': `${star.delay}s`,
    '--dx': `${star.dx.toFixed(1)}px`,
    '--dy': `${star.dy.toFixed(1)}px`,
    '--drift-dur': `${star.driftDur.toFixed(1)}s`,
    '--drift-delay': `${star.driftDelay.toFixed(1)}s`,
    '--sx': `${star.sx.toFixed(1)}px`,
    '--sy': `${star.sy.toFixed(1)}px`,
    '--shoot-dur': `${star.shootDur.toFixed(1)}s`,
    '--shoot-delay': `${star.shootDelay.toFixed(1)}s`,
  } as CSSProperties;
}

/**
 * SVG attrs as fixed decimal strings so SSR HTML and client hydration
 * compare equal (number props still ULP-diverge across the ClosingBand client boundary).
 */
function svgAttr(n: number): string {
  return n.toFixed(4);
}

function StarMark({ star, id }: { readonly star: Star; readonly id: string }) {
  const box = svgAttr(Math.max(star.glow * 2 + 2, star.len * 2 + 4));
  const cNum = Number(box) / 2;
  const c = svgAttr(cNum);
  const tailX = svgAttr(cNum - Math.cos(star.angle) * star.len);
  const tailY = svgAttr(cNum - Math.sin(star.angle) * star.len);
  const glowR = svgAttr(star.glow);
  const coreR = star.kind === 'bright' ? '1.5000' : '1.0500';
  const strokeW = star.kind === 'bright' ? '1.4500' : '0.9500';

  return (
    <svg
      className={star.shoot ? 'starfield-star is-shoot' : 'starfield-star'}
      width={box}
      height={box}
      viewBox={`0 0 ${box} ${box}`}
      style={{
        ...starStyle(star),
        left: `${((star.x / 1600) * 100).toFixed(4)}%`,
        top: `${((star.y / 480) * 100).toFixed(4)}%`,
      }}
    >
      <defs>
        <radialGradient id={id}>
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="9%" stopColor="currentColor" stopOpacity="0.9" />
          <stop offset="22%" stopColor="currentColor" stopOpacity="0.28" />
          <stop offset="58%" stopColor="currentColor" stopOpacity="0.06" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
        {star.shoot ? (
          <linearGradient id={`${id}-tail`} gradientUnits="userSpaceOnUse" x1={tailX} y1={tailY} x2={c} y2={c}>
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="62%" stopColor="currentColor" stopOpacity="0.28" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
          </linearGradient>
        ) : null}
      </defs>
      <circle className={`star-core star-core-${star.kind}`} cx={c} cy={c} r={glowR} fill={`url(#${id})`} />
      {star.shoot ? (
        <g className="star-shoot">
          <line
            x1={tailX}
            y1={tailY}
            x2={c}
            y2={c}
            stroke={`url(#${id}-tail)`}
            strokeWidth={strokeW}
            strokeLinecap="round"
          />
          <circle cx={c} cy={c} r={coreR} fill="currentColor" />
        </g>
      ) : null}
    </svg>
  );
}

function Starfield({ soft, compact }: { readonly soft?: boolean; readonly compact?: boolean }) {
  /** Defer SVG stars until after mount to avoid SSR/client float attr hydration mismatches. */
  const [ready, setReady] = useState(false);
  const prefix = soft ? 'star-soft' : 'star-sharp';
  const field = compact ? STARS_COMPACT : STARS;

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <div className={soft ? 'starfield starfield-soft' : 'starfield starfield-sharp'}>
      {ready
        ? field.map((star, index) => (
            <StarMark key={index} id={`${prefix}-${index}`} star={star} />
          ))
        : null}
    </div>
  );
}

/**
 * Closing band. The sky is the same drawing in both themes; the ink flips.
 * Behind the type the field is blurred so the words stay readable — except on
 * narrow viewports, where that blur + a second full star copy paints RGB static
 * into neighbouring tiles on Android Chrome. Phones get a thinner sharp field
 * and a CSS veil instead.
 */
export function NebulaCta() {
  // Stars each run an infinite loop. The band sits at the foot of every page,
  // so without the offscreen pause it twinkles through whatever you are reading.
  const sky = usePauseOffscreen<HTMLDivElement>();
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 700px)');
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return (
    <section className="nebula-cta relative overflow-hidden text-center" aria-labelledby="nebula-cta-title">
      <div ref={sky} className="nebula" aria-hidden="true">
        <div className="galaxy">
          <div className="galaxy-disk" />
          <div className="galaxy-lane" />
        </div>
        <Starfield compact={compact} />
        {!compact ? <Starfield soft /> : null}
        <div className="nebula-edge" />
      </div>

      <p className="eyebrow absolute top-5 right-[max(2.5rem,calc((100%-82rem)/2+1.25rem))] z-10 font-normal tracking-[0.32em] whitespace-nowrap text-[0.65rem] md:right-[max(3.75rem,calc((100%-82rem)/2+2.5rem))]">
        Have an idea<span className="tracking-normal">...</span>
      </p>

      <div className="relative mx-auto flex w-full max-w-[40rem] flex-col items-center px-6 py-[clamp(3.25rem,5.5vw,4.25rem)]">
        <Reveal>
          <h2
            id="nebula-cta-title"
            className="display mx-auto mt-4 max-w-[12ch] text-balance text-[clamp(2.35rem,4.6vw,3.6rem)] text-foreground"
          >
            Have something <span className="italic">to build.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.12} className="mt-6">
          <ArrowPill href="/contact">Contact</ArrowPill>
        </Reveal>
      </div>
    </section>
  );
}
