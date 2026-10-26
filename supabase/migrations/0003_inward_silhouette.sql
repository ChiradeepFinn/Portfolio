-- Title supplied for the portfolio. Cover, synopsis, year, and publisher stay empty.
update public.books
set
  title = 'The Inward Silhouette',
  subtitle = '',
  synopsis = 'A published book. The cover, a synopsis from the text, and the edition details are not in the site record, so none of them are invented here.',
  excerpt = '',
  is_placeholder = false
where slug = 'book-one';

update public.books
set
  synopsis = 'A second published book is part of the record. Its title, cover, and edition details are not, so they stay blank.',
  excerpt = ''
where slug = 'book-two';
