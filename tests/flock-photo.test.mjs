// The flock band is a photo pinned in the notebook (Oussama 2026-10-21: « fais en sorte que la photo soit de travers un
// peu »): tilted about -1.5° to -2°, a thin white print border, a soft paper shadow (not a glow), tape at the corners,
// straight enough on a phone, no layout shift, and the birds still alive (scenes) and still linked to the product list.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const css = read("app/components/home/home.css");
const rule = (selector) => {
  const at = css.indexOf(`${selector} {`);
  assert.ok(at >= 0, `${selector} is styled`);
  return css.slice(at, css.indexOf("}", at));
};

test("the photo is tilted between -1.5 and -2 degrees on a desk, with a thin print border and a soft paper shadow", () => {
  const photo = rule(".kz-photo");
  const tilt = Number(photo.match(/rotate\((-[\d.]+)deg\)/)?.[1]);
  assert.ok(tilt <= -1.5 && tilt >= -2, `tilt ${tilt}`);
  assert.match(photo, /padding: clamp\(/, "a print border");
  assert.match(photo, /background: var\(--kz-print\)/);
  assert.match(photo, /box-shadow:[^;]*,[^;]*,/, "a layered paper shadow");
  assert.doesNotMatch(photo, /box-shadow:[^;]*0 0 \d+px/, "a shadow, not a glow");
});

test("one strip of tape at two corners", () => {
  assert.match(css, /\.kz-photo::before, \.kz-photo::after \{[^}]*position: absolute/);
  assert.match(css, /\.kz-photo::before \{[^}]*rotate\(/);
  assert.match(css, /\.kz-photo::after \{[^}]*rotate\(/);
});

test("on a phone the tilt is eased so the names stay readable, and nothing shifts: the film keeps its reserved ratio, the tilt is a transform", () => {
  assert.match(css, /@media \(max-width: 640px\) \{ \.kz-photo \{ transform: rotate\(-1(\.\d+)?deg\); \}/);
  assert.match(css.slice(css.indexOf(".kz-band {"), css.indexOf(".kz-band-stage")), /aspect-ratio: 16 \/ 6\.1/);
  assert.doesNotMatch(rule(".kz-photo"), /\b(margin|width|height|top|left)[^;]*rotate/, "layout untouched");
});

test("the band sits in the page frame inside the photo, the birds play scenes and keep their links", () => {
  const flock = read("app/components/home/ProductsFlock.tsx");
  assert.match(flock, /<figure className="kz-photo-wrap">\s*<div className="kz-photo">/);
  assert.match(flock, /<Flock [^>]*\bscenes\b/);
  assert.match(flock, /href=\{`#product-\$\{b\.product\}`\}/);
  assert.match(css, /\.kz-photo \.kz-band::before \{ display: none; \}/, "the print has its own edges, no fade into the page");
});

test("the tilt does not leak onto the section below (the photo wrapper holds its own space)", () => {
  assert.match(rule(".kz-photo-wrap"), /max-width: var\(--kz-page-max\)/);
});
