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

test("built from @krizaka/ui components, specific to each field, demo data said as such", () => {
  for (const part of ["@krizaka/ui/chip", "@krizaka/ui/specimen-tag"]) {
    assert.ok(visuals.includes(`from "${part}"`), part);
  }
  // #417: no generic chart and no gradient rectangle with a play button — each visual shows what the product does.
  assert.doesNotMatch(visuals, /Sparkline|@krizaka\/charts/, "a generic sparkline");
  assert.doesNotMatch(visuals + css, /pv-media-play|pv-media-frame/, "a play button on a gradient rectangle");
  assert.doesNotMatch(visuals, /SkeletonText/, "no generic skeleton lines: the lease shows its clauses");
  assert.doesNotMatch(css, /^\.pv \{[^}]*border: 1px/m, "no box in a box: the visual has no border of its own");
  assert.doesNotMatch(visuals, /<video|cdn\(|video\(/, "a visual is drawn, never a clip");
  for (const l of ["en", "fr"]) {
    const v = JSON.parse(read(`messages/${l}.json`)).site.home.visuals;
    assert.deepEqual(Object.keys(v).sort(), [...ids].sort(), l);
    assert.match(v.yomizaka.source + v.akinaza.booked, /d[ée]mo/, `${l}: the demo data says it is demo`);
    for (const k of ["before", "after"]) assert.ok(v.yomizaka[k], `${l}: visuals.yomizaka.${k}`);
  }
});

// Akinaza's receipt is real Québec arithmetic: GST 5 % and QST 9.975 % on the price, each rounded to the cent.
test("Akinaza's receipt: GST and QST to the cent, computed, never typed", async () => {
  const src = read("lib/product-visuals.ts");
  assert.match(src, /export const GST = 0\.05;/);
  assert.match(src, /export const QST = 0\.09975;/);
  const { receipt } = await import("../lib/product-visuals.ts");
  assert.deepEqual(receipt(45), { price: 45, gst: 2.25, qst: 4.49, total: 51.74 });
  assert.deepEqual(receipt(62), { price: 62, gst: 3.1, qst: 6.18, total: 71.28 });
});

