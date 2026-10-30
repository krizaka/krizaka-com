/* Arriving on a page from the footer (pure judgement, tested in tests/check-arrival.test.mjs; the browser part is
   scripts/check-arrival.mjs). A visitor who clicks a footer link must land at the top of the page, see its heading, have
   the screen reader moved to it, and see the footer link of that page marked as the current one. */

export const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "phone", width: 390, height: 844 },
];

/** The pages whose footer is read: exactly one contentinfo landmark each (never a page's own closing footer under the layout's). */
export const PAGES = [
  "/en",
  "/fr",
  "/en/story",
  "/fr/story",
  "/en/open-source",
  "/en/changelog",
  "/en/contact",
  "/en/privacy",
  "/en/terms",
];

/** A link to an anchor of a page (`/en#products`) lands on that section, not at the top. */
export const isAnchor = (href) => href.includes("#");

/** The lines of what is wrong with one arrival: `r` is what the browser read after the click (see check-arrival.mjs). */
export function arrivalProblems(c, r) {
  const where = `${c.vp} ${c.from} → footer « ${c.label} » (${c.href})`;
  const out = [];
  if (r.error) return [`${where}: ${r.error}`];
  if (isAnchor(c.href)) {
    if (!r.targetInView)
      out.push(`${where}: the section #${c.href.split("#")[1]} is not in view (scrollY ${r.scrollY})`);
    return out;
  }
  if (r.scrollY > 2) out.push(`${where}: lands at scrollY ${r.scrollY}, not at the top`);
  if (!r.h1Visible) out.push(`${where}: the page's h1 is not in view${r.h1 ? ` (« ${r.h1} »)` : ""}`);
  if (!r.h1Focused) out.push(`${where}: focus is not on the h1 (it is on ${r.focus})`);
  if (r.hasFooterLink && r.current !== "page")
    out.push(`${where}: the footer link is not aria-current="page" on its own page`);
  return out;
}

/** One page, one footer landmark. */
export function footerProblems(path, counts) {
  const out = [];
  if (counts.contentinfo !== 1) out.push(`${path}: ${counts.contentinfo} contentinfo landmarks, expected 1`);
  if (counts.footer !== 1) out.push(`${path}: ${counts.footer} <footer> elements, expected 1`);
  return out;
}
