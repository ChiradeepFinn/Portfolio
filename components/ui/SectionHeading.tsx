import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  readonly eyebrow: string;
  readonly title: ReactNode;
  readonly lede?: string;
  readonly cta?: { readonly label: string; readonly href: string };
  readonly accentClassName?: string;
  readonly className?: string;
}

/**
 * The repeated header for every homepage door: what this is, one line of
 * context, and exactly one way deeper. Keeping it in one component is what
 * gives the long homepage a steady rhythm.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  cta,
  accentClassName = 'text-accent-blue',
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-10', className)}>
      <div className="max-w-2xl">
        <p className={cn('eyebrow', accentClassName)}>{eyebrow}</p>
        <h2 className="display mt-4 text-balance text-[clamp(1.9rem,4.6vw,3.2rem)] text-foreground">{title}</h2>
        {lede && <p className="body-copy mt-5 max-w-lg">{lede}</p>}
      </div>

      {cta && (
        <Link
          href={cta.href}
          className="link-underline shrink-0 text-sm text-muted transition-colors duration-200 hover:text-foreground"
        >
          {cta.label}
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
