/* The pure part of scripts/check-home-stack.mjs: what is sampled on the home's stack section, and how a sample reads.
   Tested by tests/check-home-stack.test.mjs.
   The rule (Oussama, 2026-10-23): the home's stack section is short — per tile a host, a name, one line, one still
   picture and one link. No code block, no install command, no playground control: those live on /open-source. Every
   picture has the same height, the tiles of a row are as tall as each other, and nothing is left empty under a picture. */

/** A phone and a desktop: the two widths the captures are taken at. */
export const WIDTHS = [390, 1440];
export const THEMES = ["dark", "light"];
/** The home, in both languages. */
export const PATHS = ["/en", "/fr"];
/** How many tiles the section has: Krizaka UI, Krizaka Motion, Krizaka Java, Krizaka TypeScript. */
export const TILES = 4;
/** The most that may separate a picture's foot from the tile's action: the gap of the column plus one line of facts, never
    a band. */
export const MAX_BAND_PX = 48;
/** The most the pictures of one row may differ by: the box grows to the tile's foot, so a tile whose line is shorter has
    a box taller by that many lines — two lines of text at most, never a picture twice another. */
export const MAX_PICTURE_DELTA_PX = 48;
/** Rounding allowed between two heights that must be equal. */
const TOLERANCE_PX = 1;
/** A site address as the tile names it: a host, with the site's path when it has one (GitHub Pages) — never a scheme, never
    a trailing slash, never typed words. */
const ADDRESS = /^[a-z0-9.-]+(\/[a-z0-9-]+)*$/;

/** Every page × width × theme to load. */
export function cases(paths = PATHS, widths = WIDTHS, themes = THEMES) {
  return paths.flatMap((path) => widths.flatMap((width) => themes.map((theme) => ({ path, width, theme }))));
}

/** Runs in the page: what the section renders. `null` when there is no stack section. */
export function sampleHomeStackInPage() {
  // `#stack` is the section's anchor (the heading's target): the section is its closest ancestor.
  const anchor = document.querySelector("#stack");
  const root = anchor?.closest("section") ?? anchor;
  if (!root) return null;
  const box = (el) => el.getBoundingClientRect();
  const tiles = [...root.querySelectorAll(".kz-build-tile")].map((tile) => {
    const still = tile.querySelector(".kz-build-still");
    const cta = tile.querySelector(".kz-build-cta");
    return {
      height: Math.round(box(tile).height),
      still: still ? Math.round(box(still).height) : null,
      band: still && cta ? Math.round(box(cta).top - box(still).bottom) : null,
      meta: tile.querySelector(".kz-build-meta")?.textContent?.trim() ?? "",
    };
  });
  return {
    tiles,
    code: root.querySelectorAll("pre, code").length,
    // A control that is not inside an inert picture is live: a playground knob, a copy button, a tab.
    controls: [...root.querySelectorAll("button, input, select, textarea, [role=radio], [role=switch], [role=tab]")].filter((el) => !el.closest("[inert]")).length,
  };
}

/** The failure lines of one sample; empty when the section behaves. `columns`: how many tiles share a row at that width
    (two from a laptop, one on a phone). */
export function homeStackProblems({ path, width, theme }, sample) {
  const where = `${path} at ${width}px (${theme})`;
  if (!sample) return [`${where}: no #stack section`];
  const problems = [];
  if (sample.code > 0) problems.push(`${where}: ${sample.code} code element(s) in the stack section — code lives on /open-source`);
  if (sample.controls > 0) problems.push(`${where}: ${sample.controls} live control(s) in the stack section — playground controls live on /open-source`);
  if (sample.tiles.length !== TILES) problems.push(`${where}: ${sample.tiles.length} tiles, expected ${TILES}`);
  sample.tiles.forEach((tile, i) => {
    if (tile.still === null) problems.push(`${where}: tile ${i + 1} has no still picture`);
    if (!ADDRESS.test(tile.meta)) problems.push(`${where}: tile ${i + 1} names "${tile.meta}", not a site address`);
    if (tile.band !== null && tile.band > MAX_BAND_PX) problems.push(`${where}: tile ${i + 1} leaves ${tile.band}px empty under its picture`);
  });
  const columns = width >= 1024 ? 2 : 1;
  const spread = (values) => Math.max(...values) - Math.min(...values);
  for (let i = 0; i + columns <= sample.tiles.length; i += columns) {
    const row = sample.tiles.slice(i, i + columns);
    const n = i / columns + 1;
    const heights = row.map((t) => t.height);
    if (columns > 1 && spread(heights) > TOLERANCE_PX) problems.push(`${where}: the tiles of row ${n} differ in height (${heights.join(", ")}px)`);
    const stills = row.map((t) => t.still).filter((h) => h !== null);
    if (stills.length > 1 && spread(stills) > MAX_PICTURE_DELTA_PX) problems.push(`${where}: the pictures of row ${n} differ in height (${stills.join(", ")}px)`);
  }
  // One column: every picture keeps the box's minimum height.
  if (columns === 1) {
    const stills = sample.tiles.map((t) => t.still).filter((h) => h !== null);
    if (stills.length > 1 && spread(stills) > TOLERANCE_PX) problems.push(`${where}: the pictures differ in height (${stills.join(", ")}px)`);
  }
  return problems;
}
