'use client';

import Link from 'next/link';
import { useCallback, useRef, type MouseEvent, type ReactNode } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

type Variant = 'solid' | 'ghost' | 'light';

interface MagneticLinkProps {
  readonly href: string;
  readonly children: ReactNode;
  readonly variant?: Variant;
  readonly className?: string;
  readonly external?: boolean;
}

const variantClass: Record<Variant, string> = {
  solid: 'bg-foreground text-background hover:bg-accent-blue hover:text-white',
  ghost: 'border border-border-strong text-foreground hover:border-accent-blue hover:text-accent-blue',
  light: 'bg-white text-background hover:bg-accent-blue hover:text-white',
};

/**
 * A call to action that leans very slightly toward the cursor. The pull is
 * small on purpose: it should register as responsiveness, not as a toy.
 */
export function MagneticLink({
  href,
  children,
  variant = 'solid',
  className,
  external = false,
}: MagneticLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 20, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 20, mass: 0.4 });

  const handleMouseMove = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (reduce) return;
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      x.set((event.clientX - rect.left - rect.width / 2) * 0.24);
      y.set((event.clientY - rect.top - rect.height / 2) * 0.3);
    },
    [reduce, x, y],
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const className_ = cn(
    'inline-flex min-h-11 items-center gap-2 rounded-pill px-5 text-sm font-medium transition-colors duration-300',
    variantClass[variant],
    className,
  );

  return (
    <motion.span style={{ x: springX, y: springY }} className="inline-block">
      {external ? (
        <a
          ref={ref}
          href={href}
          target="_blank"
          rel="noreferrer"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={className_}
        >
          {children}
        </a>
      ) : (
        <Link
          ref={ref}
          href={href}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={className_}
        >
          {children}
        </Link>
      )}
    </motion.span>
  );
}
