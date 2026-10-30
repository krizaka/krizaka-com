import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  PRODUCT_RECORDS,
  calls,
  cssDecls,
  cssSelectors,
  hasCode,
  hasJsx,
  identifiers,
  importsFrom,
  importsOf,
  strings,
} from "./helpers/source.mjs";

// Each product card SHOWS its field (Oussama, 2026-10-17): a live mini-visual made of @krizaka/ui pieces — lazy,
// decorative, a fixed box (no layout shift), playing only on screen (hover on a fine pointer), still under reduced motion.
const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const FRAME = "app/components/home/visuals/ProductVisual.tsx";
const VISUALS = "app/components/home/visuals/ProductVisuals.tsx";
const CSS = "app/components/home/visuals/visuals.css";
const frame = read(FRAME);
const visuals = read(VISUALS);
const css = read(CSS);
const ids = PRODUCT_RECORDS().map((p) => p.id);

// Orazaka's card draws the engine flow instead (2026-10-20: @krizaka/ui/engine-flow, tests/engine.test.mjs).
test("every product but the engine has its visual, and every product card shows it", () => {
  for (const id of ids.filter((id) => id !== "orazaka"))
    assert.match(visuals, new RegExp(`^  ${id}: [A-Z]\\w+,$`, "m"), id);
  assert.doesNotMatch(visuals, /^  orazaka:/m, "the engine's old dashed-lines visual is gone");
  const showcase = read("app/components/home/ProductShowcase.tsx");
  assert.match(showcase, /<EngineFlowView t=\{t\} \/>/);
  assert.match(showcase, /<ProductVisual id=\{p\.id\} \/>/);
});

test("lazy, decorative and without layout shift", () => {
  assert.ok(hasCode(FRAME, 'dynamic(() => import("./ProductVisuals"), { ssr: false })'));
  assert.ok(identifiers(FRAME).has("IntersectionObserver"));
  assert.ok(hasJsx(FRAME, "div", { className: "pv", inert: true, "aria-hidden": true }));
  const pv = cssDecls(CSS, ".pv");
  assert.equal(pv.position, "relative");
  assert.equal(pv["aspect-ratio"], "16 / 9", "the box has its size before the visual loads");
});

// 2026-10-20 (redesign): the visuals play as soon as they are on screen, on every pointer — no hover to wake them.
test("it plays when on screen, never under reduced motion, never off screen; no rAF, no canvas", () => {
  assert.ok(hasCode(FRAME, 'REDUCE = "(prefers-reduced-motion: reduce)"'));
  assert.ok(hasCode(FRAME, "const playing = !still && onScreen;"));
  const ids = identifiers(FRAME);
  assert.ok(!ids.has("pointerenter") && !ids.has("FINE") && !strings(FRAME).includes("pointerenter"), "no hover gate");
  assert.ok(calls(VISUALS).includes("window.clearInterval"));
  const reduced = (sel) => cssDecls(CSS, sel, { within: "(prefers-reduced-motion: reduce)" });
  for (const sel of [".pv *", ".pv *::before", ".pv *::after"]) {
    assert.equal(reduced(sel).animation, "none !important", sel);
    assert.equal(reduced(sel).transition, "none !important", sel);
  }
  for (const f of [FRAME, VISUALS]) {
    assert.ok(
      !identifiers(f).has("requestAnimationFrame") &&
        !hasJsx(f, "canvas") &&
        !calls(f).some((c) => c.endsWith("getContext")),
      f,
    );
  }
});

test("built from @krizaka/ui components, specific to each field, demo data said as such", () => {
  for (const part of ["@krizaka/ui/chip", "@krizaka/icons"]) assert.ok(importsFrom(VISUALS, part), part);
  // #417: no generic chart and no gradient rectangle with a play button — each visual shows what the product does.
  const used = identifiers(VISUALS);
  assert.ok(
    !used.has("Sparkline") && !importsOf(VISUALS).some((i) => i.from.startsWith("@krizaka/charts")),
    "a generic sparkline",
  );
  const classes = [...strings(VISUALS), ...cssSelectors(CSS)].join(" ");
  assert.doesNotMatch(classes, /pv-media-play|pv-media-frame/, "a play button on a gradient rectangle");
  assert.ok(!used.has("SkeletonText"), "no generic skeleton lines: the lease shows its clauses");
  assert.ok(!("border" in cssDecls(CSS, ".pv")), "no box in a box: the visual has no border of its own");
  assert.ok(
    !hasJsx(VISUALS, "video") && !calls(VISUALS).some((c) => c === "cdn" || c === "video"),
    "a visual is drawn, never a clip",
  );
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
