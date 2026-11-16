/* The pure part of scripts/check-overflow.mjs: what is measured, and how a measure reads. Tested by
   tests/check-overflow.test.mjs. */

import { pageCases } from "./site-pages.mjs";

/** The films' watch pages (lib/watch-films.ts; tests/check-overflow.test.mjs keeps this list equal to it), the timeline and
    the list of the other films included (krizaka-internal#3909: text cut on the right at 390 px). */
export const FILM_IDS = ["montrer-son-travail", "dossier-nadia", "dossier-sam", "dossier-theo"];

/** Phone, tablet, laptop, desktop: the widths every page must fit without a horizontal scroll. */
export const WIDTHS = [360, 390, 768, 1024, 1440];
export const THEMES = ["dark", "light"];
/** The pages that carry the site's richest blocks. */
export const PATHS = [
  "/en",
  "/fr",
  "/en/docs",
  "/fr/docs",
  "/en/services",
  "/fr/services",
  "/en/story",
  "/en/contact",
  ...["en", "fr"].flatMap((locale) => FILM_IDS.map((id) => `/${locale}/films/${id}`)),
];

/** Every page × width × theme to load. */
export const cases = (paths = PATHS, widths = WIDTHS, themes = THEMES) => pageCases(paths, widths, themes);

/** The elements that really pass the viewport's right edge (half a pixel of rounding allowed), named with their right edge, at
    most three. An element inside a box that scrolls sideways (a code block, a contents strip) is read by scrolling that box,
    and a visually hidden one (sr-only) is never seen: neither is cut (PR #723). `items`: `{ name, right, scrolled, hidden }`. */
export function edgeCulprits(items, width) {
  return items
    .filter((i) => !i.scrolled && !i.hidden && i.right > width + 0.5)
    .slice(0, 3)
    .map((i) => `${i.name} (right ${Math.round(i.right)})`);
}

/** A failure line when the page scrolls sideways (`scrollWidth` beyond the viewport, half a pixel of rounding allowed);
    `undefined` when it fits. `culprits`: the widest elements that pass the edge, as the browser named them. */
export function overflowProblem({ path, width, theme }, scrollWidth, culprits = []) {
  const over = scrollWidth - width;
  if (over <= 0.5) return undefined;
  const named = culprits.length ? ` — ${culprits.join(", ")}` : "";
  return `${path} at ${width}px (${theme}): ${Math.round(over)}px of horizontal overflow${named}`;
}

/** A failure line when a watch page's reading blocks (the timeline, the list of the other films) cut their text, even when the
    page does not scroll: something above clips what passes (krizaka-internal#3909). `cut`: the boxes whose content is wider than
    themselves and the elements past the viewport's edge, named. `undefined` when they hold their text. Every page gets this rule
    once the bar and the docs' packages table no longer pass the edge at 768 px (PR #723's first run found both). */
export function readingProblem({ path, width, theme }, cut) {
  if (cut.length === 0) return undefined;
  return `${path} at ${width}px (${theme}): text cut in the reading blocks — ${cut.slice(0, 3).join(", ")}`;
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
