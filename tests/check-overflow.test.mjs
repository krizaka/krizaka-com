import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { cases, overflowProblem, WIDTHS } from "../scripts/overflow-lib.mjs";

// 360–1440 px with no horizontal scroll, dark and light (the coordinator, 2026-10-20): checked by CI in a real browser
// on the container (scripts/check-overflow.mjs); the rules are pure and tested here.
test("every page is measured at phone, tablet, laptop and desktop widths, in both themes", () => {
  assert.deepEqual(WIDTHS, [360, 768, 1024, 1440]);
  const all = cases(["/en"]);
  assert.equal(all.length, 8);
  assert.ok(all.some((c) => c.width === 360 && c.theme === "light"));
});

test("a page that scrolls sideways is a failure that names what passes the edge; rounding is not", () => {
  const c = { path: "/en", width: 360, theme: "dark" };
  assert.equal(overflowProblem(c, 360), undefined);
  assert.equal(overflowProblem(c, 360.4), undefined);
  assert.match(overflowProblem(c, 412, ["div.kz-build"]), /\/en at 360px \(dark\): 52px .*div\.kz-build/);
});

test("CI runs the check against the container", () => {
  const ci = readFileSync(new URL("../.github/workflows/ci.yml", import.meta.url), "utf8");
  assert.match(ci, /node scripts\/check-overflow\.mjs --base http:\/\/localhost:3000/);
  assert.match(ci, /playwright install --with-deps chromium/);
});
