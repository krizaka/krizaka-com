/* The pure part of scripts/check-overflow.mjs: what is measured, and how a measure reads. Tested by
   tests/check-overflow.test.mjs. */

/** Phone, tablet, laptop, desktop: the widths every page must fit without a horizontal scroll. */
export const WIDTHS = [360, 768, 1024, 1440];
export const THEMES = ["dark", "light"];
/** The pages that carry the site's richest blocks. */
export const PATHS = ["/en", "/fr", "/en/docs", "/fr/docs", "/en/services", "/fr/services", "/en/story", "/en/contact"];

/** Every page × width × theme to load. */
export function cases(paths = PATHS, widths = WIDTHS, themes = THEMES) {
  return paths.flatMap((path) => widths.flatMap((width) => themes.map((theme) => ({ path, width, theme }))));
}

/** A failure line when the page scrolls sideways (`scrollWidth` beyond the viewport, half a pixel of rounding allowed);
    `undefined` when it fits. `culprits`: the widest elements that pass the edge, as the browser named them. */
export function overflowProblem({ path, width, theme }, scrollWidth, culprits = []) {
  const over = scrollWidth - width;
  if (over <= 0.5) return undefined;
  return `${path} at ${width}px (${theme}): ${Math.round(over)}px of horizontal overflow${culprits.length ? ` — ${culprits.join(", ")}` : ""}`;
}

/** What a page lays out in the frame: headings, the cards of a grid, its folded questions, the rows of a sommaire. A table or a code block scrolls in
    its own box, so it is not measured. */
export const FRAMED = "main h1, main h2, main h3, main .kz-cards > *, main .kz-tpl-faq > *, main .kz-contents > *";

/** A failure line for the framed boxes that leave the bar's edges (`frame` = the bar's left and right; two pixels of rounding
    allowed): a heading cut at the left edge, cards running past the right (krizaka-internal#231). `boxes`: `{ name, left, right }`.
    `undefined` when everything stays in. */
export function frameProblem({ path, width, theme }, frame, boxes) {
  const out = boxes.filter((b) => b.left < frame.left - 2 || b.right > frame.right + 2);
  if (out.length === 0) {
    return undefined;
  }
  const names = out.slice(0, 3).map((b) => `${b.name} ${Math.round(b.left)}-${Math.round(b.right)}`);
  return `${path} at ${width}px (${theme}): ${out.length} box(es) outside the frame ${Math.round(frame.left)}-${Math.round(frame.right)} — ${names.join(", ")}`;
}
