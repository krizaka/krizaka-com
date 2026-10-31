/* The pure part of scripts/check-figures.mjs: a row of figures reads as one line of numbers (Oussama, 2026-10-21: « 4 514 »
   and « 39 » sat at different heights when a label wrapped, and Young Serif's old-style digits looked uneven). Every figure
   is a lining, tabular figure (@krizaka/tokens --kz-figures) and the figures of one row share one baseline. Tested by
   tests/figures.test.mjs. */

export const WIDTHS = [360, 768, 1440];
export const THEMES = ["dark", "light"];
export const PATHS = ["/en", "/fr"];
/** The figures of a row: the home's proofs, the figure tiles (Stat values) of /story. */
export const FIGURES = ".kz-home-proofs dd, .kz-fig-grid > * > p:nth-child(2)";

export function cases(paths = PATHS, widths = WIDTHS, themes = THEMES) {
  return paths.flatMap((path) => widths.flatMap((width) => themes.map((theme) => ({ path, width, theme }))));
}

/** Runs in the page: each figure's row (its cell's top), its baseline (the bottom of an empty inline-block appended at the
    end of its text, which sits on the baseline) and its computed font-variant-numeric. */
export function sampleFigures(selector) {
  return [...document.querySelectorAll(selector)].map((el) => {
    const probe = document.createElement("span");
    probe.style.cssText = "display:inline-block;width:0;height:0;vertical-align:baseline";
    el.appendChild(probe);
    const baseline = probe.getBoundingClientRect().bottom + scrollY;
    probe.remove();
    return {
      row: Math.round(el.parentElement.getBoundingClientRect().top + scrollY),
      baseline, // The digits themselves: a NumberTicker draws them in its own spans, which set their own font-variant-numeric.
      numeric: getComputedStyle(el.querySelector(".kz-count-digit") ?? el.querySelector(".kz-count") ?? el)
        .fontVariantNumeric,
      text: (el.querySelector(".sr-only") ?? el).textContent.trim(),
    };
  });
}

/** Failure lines for one page × width × theme: a figure that is not lining and tabular, a row whose baselines differ. */
export function figureProblems({ path, width, theme }, samples) {
  const where = `${path} at ${width}px (${theme})`;
  const out = [];
  if (!samples.length) return [`${where}: no figure found`];
  for (const s of samples) {
    if (!/lining-nums/.test(s.numeric) || !/tabular-nums/.test(s.numeric))
      out.push(`${where}: « ${s.text} » is ${s.numeric || "normal"}, not lining-nums tabular-nums`);
  }
  const rows = Map.groupBy(samples, (s) => s.row);
  for (const [, row] of rows) {
    const lines = row.map((s) => s.baseline);
    const spread = Math.max(...lines) - Math.min(...lines);
    if (spread > 1)
      out.push(`${where}: the figures ${row.map((s) => `« ${s.text} »`).join(" ")} sit ${Math.round(spread)}px apart`);
  }
  return out;
}
