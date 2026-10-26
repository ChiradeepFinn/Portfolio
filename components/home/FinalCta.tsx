import { Section } from '@/components/layout/Section';
import { MagneticLink } from '@/components/ui/MagneticLink';
import { Reveal } from '@/components/ui/Reveal';

/**
 * The closing scene, not another content block. One line, two doors, and then
 * the footer.
 */
export function FinalCta() {
  return (
    <Section border="top" className="text-center">
      <Reveal>
        <h2 className="display mx-auto max-w-3xl text-balance text-[clamp(2.1rem,5.6vw,3.8rem)] text-foreground">
          There&apos;s more to explore <span className="warm-italic">one level deeper.</span>
        </h2>
        <p className="body-copy mx-auto mt-6 max-w-md">
          Everything above is a glimpse. The collections, the case studies, and the rest of the work live
          behind these two doors.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <MagneticLink href="/archive" variant="light">
            Explore the archive
          </MagneticLink>
          <MagneticLink href="/contact" variant="ghost">
            Let&apos;s connect
          </MagneticLink>
        </div>
      </Reveal>
    </Section>
  );
}
