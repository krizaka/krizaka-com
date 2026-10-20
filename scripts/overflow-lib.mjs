/* The pure part of scripts/check-overflow.mjs: what is measured, and how a measure reads. Tested by
   tests/check-overflow.test.mjs. */

/** Phone, tablet, laptop, desktop: the widths every page must fit without a horizontal scroll. */
export const WIDTHS = [360, 768, 1024, 1440];
export const THEMES = ["dark", "light"];
/** The pages that carry the site's richest blocks. */
export const PATHS = ["/en", "/fr", "/en/open-source", "/fr/open-source", "/en/story", "/en/contact"];

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
