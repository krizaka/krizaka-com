/* Links inside the docs → their page on the site, in the reader's language. Pure (tested by tests/docs.test.mjs).
   - `/docs/…` (written docs) gets the locale prefix;
   - in the synced product docs, `ARCHITECTURE.md`, `./docs/AUTH.md#jwt`… point to the published page when the
     product's manifest publishes it; an internal doc keeps its original link. */

export function resolveDocHref(
  href: string | undefined,
  locale: string,
  product?: { id: string; manifest: Record<string, unknown> },
): string | undefined {
  if (!href) return href;
  if (href === "/docs" || href.startsWith("/docs/") || href.startsWith("/docs#")) return `/${locale}${href}`;
  if (!product) return href;
  const match = /^(?:\.{1,2}\/)*(?:docs\/)?([A-Za-z0-9_-]+)\.md(#.+)?$/.exec(href);
  if (!match) return href;
  const slug = match[1].toLowerCase();
  return slug in product.manifest ? `/${locale}/docs/${product.id}/${slug}${match[2] ?? ""}` : href;
}
