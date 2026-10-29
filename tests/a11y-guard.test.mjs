import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { EXTRA_PAGES, routesOf, THEMES, WIDTHS } from "../scripts/check-a11y.mjs";

// The accessibility guard (a bug means a missing guard): axe-core WCAG 2.1 AA on every page of the sitemap, held by a ratchet.
const read = (name) => readFileSync(new URL(`../${name}`, import.meta.url), "utf8");

test("the pages are the sitemap's (en and fr, trailing slash removed) plus the 404", () => {
  const xml =
    "<urlset><url><loc>https://www.krizaka.com/en</loc></url><url><loc>https://www.krizaka.com/fr/story/</loc></url><url><loc>https://www.krizaka.com/en</loc></url></urlset>";
  assert.deepEqual(routesOf(xml), ["/en", "/fr/story", ...EXTRA_PAGES]);
});

test("dark and light, phone and desktop", () => {
  assert.deepEqual(THEMES, ["dark", "light"]);
  assert.ok(Math.min(...WIDTHS) <= 390 && Math.max(...WIDTHS) >= 1280);
});

test("runs axe through @krizaka/a11y-audit (never axe-core itself) and CI runs it on the container", () => {
  const script = read("scripts/check-a11y.mjs");
  assert.match(script, /from "@krizaka\/a11y-audit"/);
  assert.doesNotMatch(script, /from "axe-core"/);
  assert.match(read("scripts/ci-container-smoke.sh"), /node scripts\/check-a11y\.mjs --base http:\/\/localhost:3000/);
});

test("a11y-baseline.json holds counts, and no serious or critical rule (those are fixed, not recorded)", () => {
  const { rules } = JSON.parse(read("a11y-baseline.json"));
  for (const [rule, { impact, count }] of Object.entries(rules)) {
    assert.ok(Number.isInteger(count) && count > 0, `${rule}: a positive count`);
    assert.ok(["minor", "moderate"].includes(impact), `${rule} is ${impact}: fix it, do not record it`);
  }
});
