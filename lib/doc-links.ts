/* Links inside the written docs → their page on the site, in the reader's language. Pure (tested by tests/docs.test.mjs).
   `/docs/…` (and `/docs`, `/docs#…`) gets the locale prefix; anything else is left as written. */

export function resolveDocHref(href: string | undefined, locale: string): string | undefined {
  if (!href) return href;
  if (href === "/docs" || href.startsWith("/docs/") || href.startsWith("/docs#")) return `/${locale}${href}`;
  if (href === "/products") return `/${locale}${href}`;
  return href;
}
