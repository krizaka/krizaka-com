import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { MAX_BAND_PX, MAX_PICTURE_DELTA_PX, TILES, cases, homeStackProblems } from "../scripts/home-stack-lib.mjs";

// The home's stack section is short (Oussama, 2026-10-23): no code, no playground control, pictures of one height, rows
// aligned, nothing empty under a picture. scripts/check-home-stack.mjs reads it in a browser; the rule is here.
const tile = (over = {}) => ({ height: 420, still: 240, band: 12, meta: "ui.krizaka.com", ...over });
const ok = () => ({ tiles: [tile(), tile({ meta: "krizaka.github.io" }), tile({ meta: "java.krizaka.com" }), tile({ meta: "ts.krizaka.com" })], code: 0, controls: 0 });
const desktop = { path: "/en", width: 1440, theme: "dark" };
const phone = { path: "/fr", width: 390, theme: "light" };

test("the cases: the home in both languages, a phone and a desktop, dark and light", () => {
  const all = cases();
  assert.equal(all.length, 2 * 2 * 2);
  assert.deepEqual(all[0], { path: "/en", width: 390, theme: "dark" });
  assert.ok(all.some((c) => c.path === "/fr" && c.width === 1440 && c.theme === "light"));
});

test("a short, aligned section passes; a missing section is one problem", () => {
  assert.deepEqual(homeStackProblems(desktop, ok()), []);
  assert.deepEqual(homeStackProblems(phone, ok()), []);
  assert.deepEqual(homeStackProblems(desktop, null), ["/en at 1440px (dark): no #stack section"]);
});

test("a code element or a live control on the home is refused: they live on /open-source", () => {
  assert.match(homeStackProblems(desktop, { ...ok(), code: 2 }).join("\n"), /2 code element\(s\).*\/open-source/);
  assert.match(homeStackProblems(desktop, { ...ok(), controls: 6 }).join("\n"), /6 live control\(s\).*playground controls live on \/open-source/);
});

test("every tile has a still picture, the pictures of a row are alike, and the tiles of a row are as tall as each other", () => {
  assert.equal(TILES, 4);
  const three = ok();
  three.tiles.pop();
  assert.match(homeStackProblems(desktop, three).join("\n"), /3 tiles, expected 4/);
  const noStill = ok();
  noStill.tiles[1] = tile({ still: null, band: null, meta: "krizaka.github.io" });
  assert.match(homeStackProblems(desktop, noStill).join("\n"), /tile 2 has no still picture/);
  // The box grows to the tile's foot: a shorter line above a picture makes its box a line or two taller, never more.
  const taller = ok();
  taller.tiles[2] = tile({ still: 240 + MAX_PICTURE_DELTA_PX, meta: "java.krizaka.com" });
  assert.deepEqual(homeStackProblems(desktop, taller), [], "two lines of text between the pictures of a row");
  const uneven = ok();
  uneven.tiles[2] = tile({ still: 176, meta: "java.krizaka.com" });
  assert.match(homeStackProblems(desktop, uneven).join("\n"), /pictures of row 2 differ in height \(176, 240px\)/);
  assert.deepEqual(homeStackProblems(desktop, { ...ok(), tiles: [tile(), tile({ meta: "krizaka.github.io" }), tile({ still: 300, meta: "java.krizaka.com" }), tile({ still: 300, meta: "ts.krizaka.com" })] }), [], "rows are compared, not the whole grid");
  assert.match(homeStackProblems(phone, uneven).join("\n"), /pictures differ in height \(240, 240, 176, 240px\)/, "one column: every box keeps its minimum height");
  const rows = ok();
  rows.tiles[1] = tile({ height: 470, meta: "krizaka.github.io" });
  assert.match(homeStackProblems(desktop, rows).join("\n"), /tiles of row 1 differ in height \(420, 470px\)/);
  assert.deepEqual(homeStackProblems(phone, rows), [], "one column on a phone: each tile keeps its own height");
  const rounding = ok();
  rounding.tiles[3] = tile({ height: 421, still: 241, meta: "ts.krizaka.com" });
  assert.deepEqual(homeStackProblems(desktop, rounding), [], "a pixel of rounding is allowed");
});

test("no empty band under a picture, and the tile names a site address — a host, its path on GitHub Pages, never a scheme or typed words", () => {
  const band = ok();
  band.tiles[0] = tile({ band: MAX_BAND_PX + 1 });
  assert.match(homeStackProblems(desktop, band).join("\n"), /tile 1 leaves 49px empty under its picture/);
  const pages = ok();
  pages.tiles[1] = tile({ meta: "krizaka.github.io/krizaka-motion" });
  assert.deepEqual(homeStackProblems(desktop, pages), [], "the lab's GitHub Pages address, until motion.krizaka.com serves it");
  for (const meta of ["https://krizaka.github.io/krizaka-motion", "krizaka.github.io/krizaka-motion/", "Krizaka Motion"]) {
    const bad = ok();
    bad.tiles[1] = tile({ meta });
    assert.match(homeStackProblems(desktop, bad).join("\n"), new RegExp(`tile 2 names "${meta.replace(/[/.]/g, "\\$&")}", not a site address`), meta);
  }
});

test("the container smoke runs the check on the real image", () => {
  assert.match(readFileSync(new URL("../scripts/ci-container-smoke.sh", import.meta.url), "utf8"), /node scripts\/check-home-stack\.mjs --base http:\/\/localhost:3000/);
});
