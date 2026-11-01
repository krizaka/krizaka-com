// The plates of the home's entries (founder, 2026-11-01, krizaka-internal#683): one product moment each, input then result,
// still under reduced motion, and never a code name in their words — the display name comes from lib/products.ts.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PLATE_REST, PLATE_STEP_MS, PLATE_STEPS, DEMO_RUNS } from "../lib/product-visuals.ts";
import { PRODUCTS } from "../lib/products.ts";
import { cssDecls } from "./helpers/source.mjs";

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const VISUALS = read("app/components/home/visuals/ProductVisuals.tsx");
const CSS = "app/components/home/visuals/visuals.css";
const CODE_NAMES = /orazaka|yomizaka|akinaza|kachizaka/i;

test("under reduced motion and at rest a plate is still on its last step: the result in, the run line full", () => {
  assert.equal(PLATE_REST, PLATE_STEPS - 1);
  assert.equal(PLATE_STEP_MS.length, PLATE_STEPS);
  assert.equal(Math.max(...PLATE_STEP_MS), PLATE_STEP_MS[PLATE_REST], "the result is held longest");
  assert.match(
    VISUALS,
    /return playing \? step : PLATE_REST;/,
    "not playing (reduced motion, off screen) is the rest step",
  );
  assert.match(VISUALS, /useState\(PLATE_REST\)/, "the first frame is the result, never an empty plate");
  assert.match(VISUALS, /data-in=\{step >= 2 \? "" : undefined\}/);
  assert.equal(cssDecls(CSS, ".pv-out[data-in]").opacity, "1");
  // The transitions exist only where motion is welcome.
  for (const sel of [".pv-run-bar", ".pv-out"])
    assert.ok(cssDecls(CSS, sel, { within: "(prefers-reduced-motion: no-preference)" }).transition, sel);
  assert.ok(!("transition" in cssDecls(CSS, ".pv-out")), "no transition outside the no-preference query");
});

test("no code name in the plates' words; the name on a plate is the caller's, read from lib/products.ts", () => {
  for (const l of ["en", "fr"]) {
    const m = JSON.parse(read(`messages/${l}.json`));
    // The keys are the code ids (structure); the words, the values, never say a code name.
    const words = (o) =>
      JSON.stringify(o, (k, v) => (typeof v === "object" && v && !Array.isArray(v) ? Object.values(v) : v));
    assert.doesNotMatch(words(m.site.home.visuals), CODE_NAMES, `${l}: visuals`);
    assert.doesNotMatch(words(m.site.home.products.figures), CODE_NAMES, `${l}: figures`);
  }
  const strings = VISUALS.replace(/\/\*[\s\S]*?\*\//g, "").match(/"[^"\n]*"/g) ?? [];
  for (const s of strings) assert.doesNotMatch(s, /^"(Orazaka|Yomizaka|Akinaza)"$/, `a typed product name: ${s}`);
  assert.match(VISUALS, /<span className="pv-app-name">\{name\}<\/span>/);
  assert.match(read("app/components/home/visuals/ProductVisual.tsx"), /<ProductVisuals id=\{id\} name=\{name\}/);
  assert.ok(PRODUCTS.every((p) => typeof p.name === "string" && p.name.length > 0));
});

test("the subject is what the tool does; the run id is a small caption, said as demo", () => {
  assert.equal(
    VISUALS.match(/<p className="pv-caption">\{caption\}<\/p>/g)?.length,
    1,
    "one caption slot, under the result",
  );
  for (const run of Object.values(DEMO_RUNS)) assert.match(run, /^[0-9a-f]{6}$/);
  assert.equal(cssDecls(CSS, ".pv-caption")["font-size"], "11px");
  for (const l of ["en", "fr"]) {
    const v = JSON.parse(read(`messages/${l}.json`)).site.home.visuals;
    assert.match(v.akinaza.gst + v.akinaza.qst, l === "fr" ? /TPS.*TVQ/ : /GST.*QST/);
    assert.ok(v.yomizaka.passage && v.yomizaka.law, `${l}: the finding shows its passage and its article`);
    assert.equal(v.orazaka.points.length, 3, `${l}: the answer to the request`);
  }
});
