'use client';

import { useRef, type ReactNode } from 'react';
import Image from 'next/image';
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useHydratedReducedMotion } from '@/lib/use-hydrated-reduced-motion';
import { cn } from '@/lib/utils';

const STICKY_PAD = 12;

type TextParallaxContentProps = {
  readonly imgUrl: string;
  readonly alt: string;
  readonly subheading: string;
  readonly heading: string;
  readonly children?: ReactNode;
  readonly className?: string;
};

/**
 * Hover.dev Text Parallax Content pattern, adapted to the portfolio:
 * tall scroll chapter, sticky photograph that eases back, overlay copy that
 * drifts through the frame. Children sit below as the chapter body.
 */
export function TextParallaxContent({
  imgUrl,
  alt,
  subheading,
  heading,
  children,
  className,
}: TextParallaxContentProps) {
  return (
    <section className={cn('relative', className)}>
      <div
        className="relative"
        style={{
          paddingLeft: STICKY_PAD,
          paddingRight: STICKY_PAD,
        }}
      >
        <div className="relative h-[120vh] sm:h-[145vh]">
          <StickyImage imgUrl={imgUrl} alt={alt} />
          <OverlayCopy subheading={subheading} heading={heading} />
        </div>
      </div>
      {children ? <div className="relative z-10">{children}</div> : null}
    </section>
  );
}

function StickyImage({ imgUrl, alt }: { readonly imgUrl: string; readonly alt: string }) {
  const targetRef = useRef<HTMLDivElement>(null);
  const reduce = useHydratedReducedMotion();
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['end end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const veil = useTransform(scrollYProgress, [0, 1], [0.35, 0.72]);

  return (
    <motion.div
      ref={targetRef}
      style={{
        height: `calc(100svh - ${STICKY_PAD * 2}px)`,
        top: STICKY_PAD,
        scale: reduce ? 1 : scale,
      }}
      className="sticky z-0 overflow-hidden rounded-[0.35rem] border border-hairline bg-surface"
    >
      <Image
        src={imgUrl}
        alt={alt}
        fill
        sizes="100vw"
        className="object-cover"
        priority={false}
      />
      <motion.div
        className="absolute inset-0 bg-background"
        style={{ opacity: reduce ? 0.42 : veil }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/75 via-transparent to-background/25"
        aria-hidden="true"
      />
    </motion.div>
  );
}

function OverlayCopy({
  subheading,
  heading,
}: {
  readonly subheading: string;
  readonly heading: string;
}) {
  const targetRef = useRef<HTMLDivElement>(null);
  const reduce = useHydratedReducedMotion();
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [140, -140]);
  const opacity = useTransform(scrollYProgress, [0.25, 0.45, 0.7], [0, 1, 0]);

  return (
    <motion.div
      ref={targetRef}
      style={reduce ? undefined : { y, opacity }}
      className="absolute inset-0 z-[1] flex flex-col items-center justify-center px-6 text-center"
    >
      <p className="eyebrow text-muted-2">{subheading}</p>
      <h2 className="display mt-4 max-w-[18ch] text-balance text-[clamp(2rem,6vw,4.4rem)] text-foreground">
        {heading}
      </h2>
    </motion.div>
  );
}

type ParallaxFigureProps = {
  readonly src: string;
  readonly alt: string;
  readonly className?: string;
  readonly progress: MotionValue<number>;
  readonly reduce: boolean;
  readonly range?: readonly [number, number];
};

/** Small supporting photograph with a restrained vertical parallax. */
export function ParallaxFigure({
  src,
  alt,
  className,
  progress,
  reduce,
  range = [32, -32],
}: ParallaxFigureProps) {
  const y = useTransform(progress, [0, 1], [...range]);

  return (
    <motion.div
      style={{ y: reduce ? 0 : y }}
      className={cn(
        'relative aspect-[4/5] overflow-hidden rounded-[0.25rem] border border-hairline bg-surface',
        className,
      )}
    >
      <Image src={src} alt={alt} fill sizes="(max-width: 1024px) 16rem, 22vw" className="object-cover" />
    </motion.div>
  );
}
