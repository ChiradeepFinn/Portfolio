import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { bookGraph, breadcrumbGraph, withCanonical } from '@/lib/seo';
import { getBooks } from '@/lib/content';
import { booksWorld } from '@/lib/data/worlds';
import { Section } from '@/components/layout/Section';
import { BooksIntro } from '@/components/worlds/BooksIntro';

export const metadata: Metadata = withCanonical('/archive/books', {
  title: 'Books',
  description: booksWorld.lead,
});

export default async function BooksPage() {
  const books = await getBooks();
  const published = books.filter((book) => !book.isPlaceholder);
  const featured = published[0] ?? null;
  const further = published.slice(1);
  const untitled = books.some((book) => book.isPlaceholder);

  const crumbs = breadcrumbGraph([
    { name: 'Archive', path: '/archive' },
    { name: 'Books' },
  ]);

  return (
    <>
      {crumbs ? <JsonLd data={crumbs} /> : null}
      {published.length > 0 ? <JsonLd data={bookGraph(published)} /> : null}
      <BooksIntro book={featured} />

      {further.length > 0 || untitled ? (
        <Section id="shelf" border="top" className="pt-0" width="narrow" labelledBy="shelf-heading">
          <h2 id="shelf-heading" className="display text-[clamp(1.6rem,3vw,2.2rem)] text-foreground">
            The rest of the shelf
          </h2>
          {further.length > 0 ? (
            <ul className="mt-8 grid gap-10">
              {further.map((book) => (
                <li key={book.slug} className="border-t border-border pt-8">
                  <p className="meta">{book.index}</p>
                  <h3 className="display mt-3 text-[clamp(1.4rem,3vw,2rem)] text-foreground italic">{book.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted">{book.synopsis}</p>
                </li>
              ))}
            </ul>
          ) : null}
          {untitled ? (
            <p className="mt-8 text-sm leading-relaxed text-muted">
              Another published book belongs here. Its title is not in the site record yet, so it is not given one.
            </p>
          ) : null}
        </Section>
      ) : null}
    </>
  );
}
