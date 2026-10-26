import type { Metadata } from 'next';
import { withCanonical } from '@/lib/seo';
import Link from 'next/link';
import { ArrowUpRight, BadgeCheck, BookOpen, Camera, FlaskConical, Palette, ScrollText } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { GradientWord } from '@/components/ui/GradientWord';

export const metadata: Metadata = withCanonical('/archive', {
  title: 'Archive',
  description: 'Photography, artwork, books, research, philosophy, and certifications.',
});

/**
 * A gateway, not a dashboard. Numbered doors, so the page reads as the
 * entrance hall of an exhibition rather than a list of links.
 */
const destinations = [
  {
    index: '01',
    label: 'Photography',
    copy: 'Light, weather, and the ordinary things worth remembering.',
    href: '/archive/photography',
    icon: Camera,
    wash: 'from-[#16233f] via-[#0d0f16] to-transparent',
  },
  {
    index: '02',
    label: 'Artwork',
    copy: 'Canvas, texture, and colour - the other side of the same practice.',
    href: '/archive/artwork',
    icon: Palette,
    wash: 'from-[#2a1526] via-[#150e15] to-transparent',
  },
  {
    index: '03',
    label: 'Books',
    copy: 'The Inward Silhouette, and the rest of the shelf.',
    href: '/archive/books',
    icon: BookOpen,
    wash: 'from-[#2a1e15] via-[#161110] to-transparent',
  },
  {
    index: '04',
    label: 'Research',
    copy: 'Questions worth investigating, written up properly.',
    href: '/archive/research',
    icon: FlaskConical,
    wash: 'from-[#0d2426] via-[#0b1517] to-transparent',
  },
  {
    index: '05',
    label: 'Philosophy',
    copy: 'Essays and questions. A piece appears when it has been written.',
    href: '/about',
    icon: ScrollText,
    wash: 'from-[#1a1a22] via-[#101014] to-transparent',
  },
  {
    index: '06',
    label: 'Certifications',
    copy: 'The proof shelf, kept deliberately quiet.',
    href: '/archive/certifications',
    icon: BadgeCheck,
    wash: 'from-[#151a2e] via-[#0d0f16] to-transparent',
  },
] as const;

export default function ArchivePage() {
  return (
    <>
      <PageHeader
        eyebrow="The archive"
        title={
          <>
            Every room, <GradientWord>one practice.</GradientWord>
          </>
        }
        description="This is an entrance, not an index. Each room holds its own collection and its own way of looking."
        atmosphere="atmos-gallery"
      />

      <Section className="pt-0">
        <div className="grid gap-px overflow-hidden rounded-card border border-border bg-border">
          {destinations.map((destination, index) => (
            <Reveal key={destination.href} delay={index * 0.05}>
              <Link
                href={destination.href}
                className={`group relative flex items-center gap-6 overflow-hidden bg-surface px-6 py-8 transition-colors duration-300 hover:bg-surface-2 sm:px-9 sm:py-10`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${destination.wash}`}
                />
                <span className="meta relative w-8 shrink-0">{destination.index}</span>
                <destination.icon
                  size={18}
                  aria-hidden="true"
                  className="relative shrink-0 text-muted-2 transition-colors duration-300 group-hover:text-foreground"
                />
                <span className="relative min-w-0 flex-1">
                  <span className="display block text-[clamp(1.4rem,3vw,2.1rem)] text-foreground">
                    {destination.label}
                  </span>
                  <span className="mt-1.5 block text-sm text-muted">{destination.copy}</span>
                </span>
                <ArrowUpRight
                  size={18}
                  aria-hidden="true"
                  className="relative shrink-0 text-muted-2 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
                />
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
