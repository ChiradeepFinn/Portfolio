import type { Book } from '@/lib/types';
import { booksWorld } from '@/lib/data/worlds';
import { BookPlate } from '@/components/books/BookPlate';
import { ArrowPill } from '@/components/ui/ArrowPill';
import { GradientWord } from '@/components/ui/GradientWord';
import { IntroFrame, WorldIndex } from './WorldMarks';

/**
 * The opening is the book, set like a title page: jacket plate, then the name.
 */
export function BooksIntro({ book }: { readonly book: Book | null }) {
  return (
    <IntroFrame atmosphere="atmos-paper">
      <WorldIndex index={booksWorld.index} label={booksWorld.label} className="text-warm-2" />

      {book ? (
        <div id="the-inward-silhouette" className="mt-8 grid scroll-mt-28 items-end gap-8 sm:grid-cols-[18rem_minmax(0,1fr)] sm:gap-12 lg:gap-16">
          <BookPlate title={book.title} />
          <div className="min-w-0 pb-1">
            <h1 className="display text-balance text-[clamp(2.4rem,6vw,4.6rem)] leading-[0.96] text-foreground italic">
              {book.title}
            </h1>
            {book.subtitle ? <p className="mt-3 text-sm text-muted-2 italic">{book.subtitle}</p> : null}
            <p className="body-copy mt-6 max-w-xl">{book.synopsis}</p>
            <Edition book={book} />
            {book.excerpt.trim().length > 0 ? (
              <blockquote className="mt-8 max-w-xl border-l border-border pl-5">
                <p className="font-display text-[1.05rem] leading-relaxed text-muted italic">{book.excerpt}</p>
              </blockquote>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="mt-8 max-w-xl">
          <h1 className="display text-[clamp(2.2rem,5vw,3.6rem)] text-foreground">
            The shelf is <GradientWord>waiting on titles.</GradientWord>
          </h1>
          <p className="body-copy mt-6">{booksWorld.lead}</p>
        </div>
      )}
    </IntroFrame>
  );
}

function Edition({ book }: { readonly book: Book }) {
  const rows = [
    book.publisher ? { term: 'Publisher', value: book.publisher } : null,
    book.year ? { term: 'Published', value: book.year } : null,
  ].filter((row): row is { term: string; value: string } => row !== null);

  if (rows.length === 0) {
    return <p className="meta mt-6">Publisher and year not on file</p>;
  }

  return (
    <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
      {rows.map((row) => (
        <div key={row.term}>
          <dt className="text-[0.62rem] tracking-[0.14em] text-muted-2 uppercase">{row.term}</dt>
          <dd className="mt-1.5 text-sm text-muted">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
