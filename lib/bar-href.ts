/* Where a link of the bar points (krizaka-internal#2450), free of the rest of lib/nav.ts so the tests import it alone. */

/** Strips the /fr or /en prefix. */
export function localeless(pathname: string): string {
  return pathname.replace(/^\/(fr|en)(?=\/|$)/, "") || "/";
}

/** Where a bar link points from the page the visitor is on. An anchor of the home (`/#products`) is the bare anchor on
 *  the home itself, so pressing it scrolls there (an unprefixed `/#…` went through the locale redirect and lost the
 *  scroll), and `/<locale>#…` from any other page. Any other link keeps its address. */
export function barHref(link: { href: string }, locale: string, pathname: string): string {
  const [path, anchor] = link.href.split("#");
  if (anchor === undefined || path !== "/") {
    return link.href;
  }
  return localeless(pathname) === "/" ? `#${anchor}` : `/${locale}#${anchor}`;
}
