// The floating bar leaves a gap above it (SiteBar: top-N); the page scrolls under that gap, so a strip of the page's
// surface must cover it (krizaka-com: text showed cut above the bar, v0.15.0).
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const bar = readFileSync(new URL("../app/components/SiteBar.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

test("the strip above the floating bar covers its whole gap with the page surface", () => {
  const top = /kz-site-bar-wrap[^"]*\btop-(\d+)\b/.exec(bar);
  assert.ok(top, "SiteBar wrapper has a top-N offset");
  const gapRem = Number(top[1]) * 0.25;
  const rule = /\.kz-site-bar-wrap::before\s*\{([^}]*)\}/.exec(css);
  assert.ok(rule, "globals.css paints .kz-site-bar-wrap::before");
  assert.match(rule[1], /background:\s*var\(--kz-surface-0\)/);
  assert.match(rule[1], /position:\s*absolute/);
  assert.match(rule[1], /inset:\s*-0\.75rem 0 auto 0/, "the strip starts at the viewport top, above the wrapper");
  const h = /height:\s*([\d.]+)rem/.exec(rule[1]);
  assert.ok(h && Number(h[1]) >= gapRem, `strip is at least ${gapRem}rem tall`);
});
