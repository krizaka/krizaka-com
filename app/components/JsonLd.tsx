/**
 * Renders a JSON-LD <script>. Server component — the payload is serialized at
 * build/render time, never on the client. Reuse for the sitewide @graph and for
 * page-scoped schema (BreadcrumbList, FAQPage, …).
 */
export function JsonLd({ data }: { readonly data: object }) {
  return (
    <script
      type="application/ld+json"
      // Schema payloads are first-party, build-time data (no user input).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
