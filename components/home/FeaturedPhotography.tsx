import { getPhotographs } from '@/lib/content';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SlotFrame } from '@/components/ui/SlotFrame';
import { Reveal } from '@/components/ui/Reveal';

/**
 * One wide frame carries the section; the three smaller ones sit below it on a
 * staggered baseline. The offsets are what stop this reading as the artwork
 * section repeated with different words.
 */
export async function FeaturedPhotography() {
  const photographs = (await getPhotographs()).filter((photo) => photo.featured).slice(0, 4);
  if (photographs.length === 0) return null;

  const [lead, ...rest] = photographs;

  return (
    <Section border="top" atmosphere="atmos-darkroom">
      <SectionHeading
        eyebrow="Featured photography"
        title={
          <>
            How I <span className="warm-italic">see the world.</span>
          </>
        }
        cta={{ label: 'Explore photography', href: '/archive/photography' }}
        accentClassName="text-accent-rose"
      />

      <Reveal className="mt-14">
        <figure>
          <SlotFrame label="Photograph" ratio="16 / 9" tone="blue" />
          <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <span className="text-sm text-foreground">{lead.title}</span>
            <span className="meta">
              {[lead.place, lead.captured, lead.camera].filter(Boolean).join(' · ')}
            </span>
          </figcaption>
        </figure>
      </Reveal>

      <div className="mt-10 grid gap-6 sm:grid-cols-3 sm:gap-7">
        {rest.map((photo, index) => (
          <Reveal
            key={photo.slug}
            delay={0.06 * index}
            className={index === 1 ? 'sm:mt-10' : index === 2 ? 'sm:mt-4' : undefined}
          >
            <figure>
              <SlotFrame
                label="Photograph"
                ratio={photo.size === 'tall' ? '3 / 4' : photo.size === 'wide' ? '4 / 3' : '1 / 1'}
                tone="neutral"
              />
              <figcaption className="mt-3 flex items-baseline justify-between gap-3">
                <span className="text-[0.82rem] text-muted">{photo.title}</span>
                <span className="meta">{photo.place}</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
