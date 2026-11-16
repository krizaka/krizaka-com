import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { cases, FILM_IDS, frameProblem, overflowProblem, PATHS, WIDTHS } from "../scripts/overflow-lib.mjs";

// 360–1440 px with no horizontal scroll, dark and light (the coordinator, 2026-10-20): checked by CI in a real browser
// on the container (scripts/check-overflow.mjs); the rules are pure and tested here.
test("every page is measured at phone, tablet, laptop and desktop widths, in both themes", () => {
  assert.deepEqual(WIDTHS, [360, 390, 768, 1024, 1440]);
  const all = cases(["/en"]);
  assert.equal(all.length, 10);
  assert.ok(all.some((c) => c.width === 360 && c.theme === "light"));
});

test("a page that scrolls sideways is a failure that names what passes the edge; rounding is not", () => {
  const c = { path: "/en", width: 360, theme: "dark" };
  assert.equal(overflowProblem(c, 360), undefined);
  assert.equal(overflowProblem(c, 360.4), undefined);
  assert.match(overflowProblem(c, 412, ["div.kz-build"]), /\/en at 360px \(dark\): 52px .*div\.kz-build/);
});

test("CI runs the check against the container", () => {
  // The pipeline is the org's node-ci.yml; the container job runs this repository's smoke script against the image.
  const ci = readFileSync(new URL("../.github/workflows/ci.yml", import.meta.url), "utf8");
  assert.match(ci, /container-smoke: scripts\/ci-container-smoke\.sh/);
  const smoke = readFileSync(new URL("../scripts/ci-container-smoke.sh", import.meta.url), "utf8");
  assert.match(smoke, /node scripts\/check-overflow\.mjs --base http:\/\/localhost:3000/);
  assert.match(smoke, /playwright install --with-deps chromium/);
});

// krizaka-internal#231: a heading cut at the left edge, cards past the right: the framed boxes stay between the bar's edges.
test("a framed box that leaves the bar's edges is a failure; rounding and boxes inside are not", () => {
  const c = { path: "/fr/docs", width: 1440, theme: "dark" };
  const frame = { left: 144, right: 1296 };
  assert.equal(frameProblem(c, frame, [{ name: "h2.title", left: 144, right: 1296 }]), undefined);
  assert.equal(frameProblem(c, frame, [{ name: "li.card", left: 142.5, right: 1297.5 }]), undefined);
  assert.match(frameProblem(c, frame, [{ name: "h2.title", left: 80, right: 600 }]), /h2\.title 80-600/);
  assert.match(
    frameProblem(c, frame, [{ name: "li.card", left: 900, right: 1500 }]),
    /1 box\(es\) outside the frame 144-1296/,
  );
});

test("the pages of the report (docs, services) are in the measured set", () => {
  for (const p of ["/en/docs", "/fr/docs", "/en/services", "/fr/services"]) {
    assert.ok(PATHS.includes(p), p);
  }
});

// krizaka-internal#3909: the films' watch pages, in both languages, at 360 and 390 px, are measured; an element past the edge fails even when the page does not scroll.
test("every film watch page is in the measured set, in both languages", async () => {
  const { WATCH_FILMS } = await import("../lib/watch-films.ts");
  assert.deepEqual([...FILM_IDS].sort(), WATCH_FILMS.map((f) => f.id).sort());
  for (const locale of ["en", "fr"]) {
    for (const id of FILM_IDS) {
      assert.ok(PATHS.includes(`/${locale}/films/${id}`), `${locale}/${id}`);
    }
  }
  assert.ok(WIDTHS.includes(360) && WIDTHS.includes(390));
});

test("an element past the edge is a failure even when scrollWidth fits (clipped overflow)", () => {
  const c = { path: "/fr/films/dossier-sam", width: 390, theme: "light" };
  assert.match(
    overflowProblem(c, 390, ["li.kz-offers-item"]),
    /\/fr\/films\/dossier-sam at 390px \(light\).*li\.kz-offers-item/,
  );
});
