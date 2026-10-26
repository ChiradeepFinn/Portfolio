import type { Metadata } from 'next';
import { Section } from '@/components/layout/Section';
import { MagneticLink } from '@/components/ui/MagneticLink';
import { GradientWord } from '@/components/ui/GradientWord';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Section className="pt-44 text-center">
      <p className="eyebrow text-accent-blue">404</p>
      <h1 className="display mt-5 text-[clamp(2rem,5vw,3.4rem)] text-foreground">
        This one doesn&apos;t exist <GradientWord>yet.</GradientWord>
      </h1>
      <p className="body-copy mx-auto mt-5 max-w-sm">
        The page you were looking for isn&apos;t here. The archive is a good place to start again.
      </p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <MagneticLink href="/" variant="light">
          Back home
        </MagneticLink>
        <MagneticLink href="/archive" variant="ghost">
          Explore the archive
        </MagneticLink>
      </div>
    </Section>
  );
}
