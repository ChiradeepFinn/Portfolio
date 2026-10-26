/**
 * Structured data we author ourselves. The JSON is escaped so a title cannot close the script.
 */
export function JsonLd({ data }: { readonly data: object }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
