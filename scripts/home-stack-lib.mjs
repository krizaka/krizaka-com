/* The pure part of scripts/check-home-stack.mjs: what is sampled on the home's stack section, and how a sample reads.
   Tested by tests/check-home-stack.test.mjs.
   The rule (Oussama, 2026-10-25, krizaka-com#392): the stack is one row per publication of lib/stack.ts, like the products':
   the live visual on one side (a box of one fixed height — no layout shift), a specimen tag on the other (library code
   KZ-L01…, a stamp, the name, fields, two actions). The rows alternate on a wide screen and fall to one column on a phone, the
   tag under its visual. No live control, no code outside an inert picture: the detail lives on /open-source. */

/** A phone and a desktop: the two widths the captures are taken at. */
export const WIDTHS = [390, 1440];
export const THEMES = ["dark", "light"];
/** The home, in both languages. */
export const PATHS = ["/en", "/fr"];
/** How many rows the section has: one per publication of lib/stack.ts (tests/stack-config.test.mjs keeps them equal). */
export const ROWS = 4;
/** From this width the visual and the tag sit side by side (home.css / stack-tiles.css: 640px). */
export const SIDE_BY_SIDE_PX = 640;
/** Rounding allowed between two heights that must be equal. */
const TOLERANCE_PX = 1;
/** A site as the row names it: a host — never a scheme, a path or a trailing slash, never typed words. */
const ADDRESS = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/;
/** The library series, distinct from the products' KZ-0n. */
const CODE = /^KZ-L(\d{2})$/;

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
  const rect = (el) => {
    const b = el.getBoundingClientRect();
    return { left: Math.round(b.left), right: Math.round(b.right), top: Math.round(b.top), bottom: Math.round(b.bottom), height: Math.round(b.height) };
  };
  const rows = [...root.querySelectorAll(".kz-stack-row")].map((row) => {
    const visual = row.querySelector(".kz-stack-visual");
    const tag = row.querySelector(".kz-stack-tag");
    // The first field of the record is the site, in both languages.
    const site = tag?.querySelector(".kz-tag-fields > div");
    return {
      id: row.dataset.stack ?? "",
      visual: visual ? rect(visual) : null,
      tag: tag ? rect(tag) : null,
      code: tag?.querySelector(".kz-tag-code")?.textContent?.trim() ?? "",
      site: site?.querySelector("dd")?.textContent?.trim() ?? "",
      actions: tag?.querySelectorAll(".kz-tag-foot a").length ?? 0,
    };
  });
  return {
    rows,
    viewport: document.documentElement.clientWidth,
    // Code outside an inert picture is a snippet on the home; a control outside one is live (a knob, a copy button, a tab).
    code: [...root.querySelectorAll("pre, code")].filter((el) => !el.closest("[inert]")).length,
    controls: [...root.querySelectorAll("button, input, select, textarea, [role=radio], [role=switch], [role=tab]")].filter((el) => !el.closest("[inert]")).length,
  };
}

/** The problems of one row at one width: its parts, its code and site, its two actions, its place beside or under its visual. */
function rowProblems(where, row, i, { side, viewport }) {
  const n = `row ${i + 1} (${row.id})`;
  if (!row.visual) return [`${where}: ${n} has no visual`];
  if (!row.tag) return [`${where}: ${n} has no specimen tag`];
  const problems = [];
  const code = CODE.exec(row.code);
  if (!code || Number(code[1]) !== i + 1) problems.push(`${where}: ${n} is coded "${row.code}", expected KZ-L${String(i + 1).padStart(2, "0")}`);
  if (!ADDRESS.test(row.site)) problems.push(`${where}: ${n} names "${row.site}", not a site address`);
  if (row.actions !== 2) problems.push(`${where}: ${n} has ${row.actions} action(s), expected 2`);
  if (row.tag.right > viewport + TOLERANCE_PX || row.visual.right > viewport + TOLERANCE_PX) problems.push(`${where}: ${n} overflows the screen`);
  if (!side) {
    if (row.tag.top < row.visual.bottom - TOLERANCE_PX) problems.push(`${where}: ${n}: on a phone the tag goes under its visual`);
    return problems;
  }
  if (!(row.tag.top < row.visual.bottom && row.visual.top < row.tag.bottom)) problems.push(`${where}: ${n}: the tag is not beside its visual`);
  const visualFirst = i % 2 === 0;
  const alternates = visualFirst ? row.visual.left < row.tag.left : row.tag.left < row.visual.left;
  if (!alternates) problems.push(`${where}: ${n} does not alternate (the visual should be on the ${visualFirst ? "left" : "right"})`);
  return problems;
}

/** The failure lines of one sample; empty when the section behaves. */
export function homeStackProblems({ path, width, theme }, sample, expected = ROWS) {
  const where = `${path} at ${width}px (${theme})`;
  if (!sample) return [`${where}: no #stack section`];
  const problems = [];
  if (sample.code > 0) problems.push(`${where}: ${sample.code} code element(s) in the stack section — code lives on /open-source`);
  if (sample.controls > 0) problems.push(`${where}: ${sample.controls} live control(s) in the stack section — playground controls live on /open-source`);
  if (sample.rows.length !== expected) problems.push(`${where}: ${sample.rows.length} rows, expected ${expected}`);
  const heights = sample.rows.map((r) => r.visual?.height).filter((h) => h !== undefined);
  if (heights.length > 1 && Math.max(...heights) - Math.min(...heights) > TOLERANCE_PX) problems.push(`${where}: the visuals differ in height (${heights.join(", ")}px) — one fixed box`);
  const layout = { side: width >= SIDE_BY_SIDE_PX, viewport: sample.viewport };
  sample.rows.forEach((row, i) => problems.push(...rowProblems(where, row, i, layout)));
  return problems;
}
