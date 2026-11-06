import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";

// `npm test` runs where no browser is installed (CI's Verify job, a fresh checkout): a unit test that launches Chromium
// fails there and nowhere else (krizaka-com#635, 2026-11-06). A check that needs a real browser is a script run by
// scripts/ci-container-smoke.sh after `playwright install` (check-arrival, check-a11y, check-focus-ring…).
const dir = new URL("./", import.meta.url);
const BROWSER =
  /from\s+["'](?:playwright|@playwright\/test|puppeteer)["']|import\(\s*["'](?:playwright|@playwright\/test|puppeteer)["']\s*\)|\.launch\(/;

test("no unit test imports a browser or launches one", () => {
  const offenders = readdirSync(dir)
    .filter((f) => f.endsWith(".test.mjs") && f !== "no-browser-in-unit-tests.test.mjs")
    .filter((f) => BROWSER.test(readFileSync(new URL(f, dir), "utf8")));
  assert.deepEqual(offenders, [], "move the browser part to a scripts/check-*.mjs run by ci-container-smoke.sh");
});

test("the pattern catches a static import, a dynamic import and a launch, and leaves plain tests alone", () => {
  assert.ok(BROWSER.test('import { chromium } from "playwright";'));
  assert.ok(BROWSER.test('const { chromium } = await import("playwright");'));
  assert.ok(BROWSER.test("const b = await chromium.launch();"));
  assert.ok(!BROWSER.test('import { test } from "node:test";'));
});
