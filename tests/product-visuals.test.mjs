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

test("every product has its visual, and every card shows it", () => {
  for (const id of ids) assert.match(visuals, new RegExp(`^  ${id}: [A-Z]\\w+,$`, "m"), id);
  const showcase = read("app/components/home/ProductShowcase.tsx");
  assert.match(showcase, /<ProductVisual id=\{engine\.id\} \/>/);
  assert.match(showcase, /<ProductVisual id=\{p\.id\} \/>/);
});

test("lazy, decorative and without layout shift", () => {
  assert.match(frame, /dynamic\(\(\) => import\("\.\/ProductVisuals"\), \{ ssr: false \}\)/);
  assert.match(frame, /IntersectionObserver/);
  assert.match(frame, /inert aria-hidden/);
  assert.match(css, /^\.pv \{ position: relative; aspect-ratio: 16 \/ 9;/m, "the box has its size before the visual loads");
});

test("it plays only on screen (hover on a fine pointer, always on touch), never under reduced motion; no rAF, no canvas", () => {
  assert.match(frame, /REDUCE = "\(prefers-reduced-motion: reduce\)"/);
  assert.match(frame, /FINE = "\(hover: hover\) and \(pointer: fine\)"/);
  assert.match(frame, /const playing = mode !== "still" && onScreen && \(mode === "screen" \|\| hover\);/);
  assert.match(visuals, /window\.clearInterval/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{\s*\.pv \*, \.pv \*::before, \.pv \*::after \{ animation: none !important; transition: none !important; \}/);
  for (const src of [frame, visuals]) assert.doesNotMatch(src, /requestAnimationFrame|<canvas|getContext\(/);
});

test("built from @krizaka/ui components, demo data said as such, Orochia without media (AGENTS §2)", () => {
  for (const part of ["@krizaka/ui/chat", "@krizaka/ui/chip", "@krizaka/ui/progress", "@krizaka/ui/skeleton", "@krizaka/ui/verified-badge", "@krizaka/charts/sparkline", "@krizaka/ui/number-ticker"]) {
    assert.ok(visuals.includes(`from "${part}"`), part);
  }
  const orochia = visuals.slice(visuals.indexOf("function Orochia"), visuals.indexOf("function Kachizaka"));
  assert.doesNotMatch(orochia, /<video|cdn\(|video\(/, "no clip on Orochia's card");
  for (const l of ["en", "fr"]) {
    const v = JSON.parse(read(`messages/${l}.json`)).site.home.visuals;
    assert.deepEqual(Object.keys(v).sort(), [...ids].sort(), l);
    assert.match(v.yomizaka.source + v.akinaza.booked, /d[ée]mo/, `${l}: the demo data says it is demo`);
  }
});
