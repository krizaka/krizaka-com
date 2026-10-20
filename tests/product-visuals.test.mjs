import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// Each product card SHOWS its field (Oussama, 2026-10-17): a live mini-visual made of @krizaka/ui pieces — lazy,
// decorative, a fixed box (no layout shift), playing only on screen (hover on a fine pointer), still under reduced motion.
const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const frame = read("app/components/home/visuals/ProductVisual.tsx");
const visuals = read("app/components/home/visuals/ProductVisuals.tsx");
const css = read("app/components/home/visuals/visuals.css");
const ids = [...read("lib/products.ts").matchAll(/\{ id: "(\w+)", name:/g)].map((m) => m[1]);

// Orazaka's card draws the engine flow instead (2026-10-20: @krizaka/ui/engine-flow, tests/engine.test.mjs).
test("every product but the engine has its visual, and every product card shows it", () => {
  for (const id of ids.filter((id) => id !== "orazaka")) assert.match(visuals, new RegExp(`^  ${id}: [A-Z]\\w+,$`, "m"), id);
  assert.doesNotMatch(visuals, /^  orazaka:/m, "the engine's old dashed-lines visual is gone");
  const showcase = read("app/components/home/ProductShowcase.tsx");
  assert.match(showcase, /<EngineFlowView t=\{t\} \/>/);
  assert.match(showcase, /<ProductVisual id=\{p\.id\} \/>/);
});

test("lazy, decorative and without layout shift", () => {
  assert.match(frame, /dynamic\(\(\) => import\("\.\/ProductVisuals"\), \{ ssr: false \}\)/);
  assert.match(frame, /IntersectionObserver/);
  assert.match(frame, /inert aria-hidden/);
  assert.match(css, /^\.pv \{ position: relative; aspect-ratio: 16 \/ 9;/m, "the box has its size before the visual loads");
});

// 2026-10-20 (redesign): the visuals play as soon as they are on screen, on every pointer — no hover to wake them.
test("it plays when on screen, never under reduced motion, never off screen; no rAF, no canvas", () => {
  assert.match(frame, /REDUCE = "\(prefers-reduced-motion: reduce\)"/);
  assert.match(frame, /const playing = !still && onScreen;/);
  assert.doesNotMatch(frame, /pointerenter|FINE =/, "no hover gate");
  assert.match(visuals, /window\.clearInterval/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{\s*\.pv \*, \.pv \*::before, \.pv \*::after \{ animation: none !important; transition: none !important; \}/);
  for (const src of [frame, visuals]) assert.doesNotMatch(src, /requestAnimationFrame|<canvas|getContext\(/);
});

test("built from @krizaka/ui components, demo data said as such, Orochia without media (AGENTS §2)", () => {
  for (const part of ["@krizaka/ui/chat", "@krizaka/ui/chip", "@krizaka/ui/progress", "@krizaka/ui/verified-badge", "@krizaka/charts/sparkline", "@krizaka/ui/number-ticker"]) {
    assert.ok(visuals.includes(`from "${part}"`), part);
  }
  assert.doesNotMatch(visuals, /SkeletonText/, "no generic skeleton lines: the lease shows its clauses");
  assert.doesNotMatch(css, /^\.pv \{[^}]*border: 1px/m, "no box in a box: the visual has no border of its own");
  const orochia = visuals.slice(visuals.indexOf("function Orochia"), visuals.indexOf("function Kachizaka"));
  assert.doesNotMatch(orochia, /<video|cdn\(|video\(/, "no clip on Orochia's card");
  for (const l of ["en", "fr"]) {
    const v = JSON.parse(read(`messages/${l}.json`)).site.home.visuals;
    assert.deepEqual(Object.keys(v).sort(), [...ids].sort(), l);
    assert.match(v.yomizaka.source + v.akinaza.booked, /d[ée]mo/, `${l}: the demo data says it is demo`);
    for (const k of ["before", "after"]) assert.ok(v.yomizaka[k], `${l}: visuals.yomizaka.${k}`);
  }
});

// Kachizaka's points counter (bug 2026-10-20: the digits looked misaligned while they rolled). The cause: the unit's rule
// was `.pv-live-value span`, which also hit every span inside NumberTicker (ghost, roll, each digit column) and shrank the
// number to the unit's 12 px sans while its line box stayed 26 px. The unit has its own class; the number keeps the
// display face, tabular digits, one fixed line height, a baseline shared with the unit and a fixed width.
test("the points counter: the unit's style never reaches the ticker, digits are tabular on a shared baseline in a fixed width", () => {
  assert.match(visuals, /<span className="pv-live-unit">\{v\.points\}<\/span>/);
  assert.doesNotMatch(css, /\.pv-live-value span\b/, "a descendant selector would restyle the ticker's own spans");
  assert.match(css, /\.pv-live-unit \{[^}]*font-size: 12px/);
  const value = css.match(/^\.pv-live-value \{([^}]*)\}/m)?.[1] ?? "";
  assert.match(value, /font-variant-numeric: tabular-nums/);
  assert.match(value, /line-height: 1\.2/);
  assert.match(value, /display: flex/);
  assert.match(value, /align-items: baseline/);
  const count = css.match(/^\.pv-live-value \.kz-count \{([^}]*)\}/m)?.[1] ?? "";
  assert.match(count, /min-width: \d+(\.\d+)?ch/, "a fixed width: the counter never pushes the unit while it rolls");
  assert.match(count, /justify-items: start/, "left edge on the label");
});
