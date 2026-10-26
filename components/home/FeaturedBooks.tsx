import { getBooks } from '@/lib/content';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SlotFrame } from '@/components/ui/SlotFrame';
import { Reveal } from '@/components/ui/Reveal';

/**
 * Two books presented as objects on a shelf, not as products in a store. The
 * second cover sits lower than the first and a hairline runs beneath both -
 * enough to read as a shelf without drawing one.
 */
export async function FeaturedBooks() {
  const books = await getBooks();
  if (books.length === 0) return null;

  return (
    <Section border="top" atmosphere="atmos-paper">
      <SectionHeading
        eyebrow="Published books"
        title={
          <>
            Two books that <span className="warm-italic">left my hands.</span>
          </>
        }
        cta={{ label: 'Explore books', href: '/archive/books' }}
        accentClassName="text-warm-2"
      />

      <div className="relative mt-14">
        <div className="grid gap-10 sm:grid-cols-2 sm:gap-14 lg:max-w-4xl">
          {books.slice(0, 2).map((book, index) => (
            <Reveal key={book.slug} delay={index * 0.08} className={index === 1 ? 'sm:mt-14' : undefined}>
              <article>
                <SlotFrame label="Cover" ratio="2 / 3" tone="neutral" className="max-w-[16rem]" />
                <p className="meta mt-5">{book.index}</p>
                <h3 className="display mt-2 text-[clamp(1.3rem,2.2vw,1.75rem)] text-foreground">
                  {book.title}
                </h3>
                <p className="mt-1 text-sm text-muted-2 italic">{book.subtitle}</p>
                <p className="body-copy mt-4 max-w-sm text-[0.92rem]">{book.synopsis}</p>
                {(book.year || book.publisher) && (
                  <p className="meta mt-4">{[book.publisher, book.year].filter(Boolean).join(' · ')}</p>
                )}
              </article>
            </Reveal>
          ))}
        </div>

        <span aria-hidden="true" className="mt-14 block h-px w-full bg-border sm:max-w-4xl" />
      </div>
    </Section>
  );
}
