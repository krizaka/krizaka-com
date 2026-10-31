import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { STACK, hostOf, stackActionUrl } from "../lib/stack.ts";

// The open-source stack is ONE list (lib/stack.ts), Krizaka Lab included. Since 2026-10-26 the home no longer carries it:
// /open-source and /story draw the full cards from this list.
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const messages = (lang) => JSON.parse(read(`messages/${lang}.json`));

test("the list: four publications, Krizaka Lab among them, with their registry and status", () => {
  assert.deepEqual(
    STACK.map((p) => p.id),
    ["ui", "motion", "java", "ts"],
  );
  for (const p of STACK) {
    assert.ok(p.name && p.url.startsWith("https://") && p.repoUrl.startsWith("https://github.com/krizaka/"), p.id);
    assert.ok(["npm", "maven", "none"].includes(p.registry), `${p.id}: registry`);
    assert.ok(["released", "development"].includes(p.status), `${p.id}: status`);
    assert.ok(["docs", "lab"].includes(p.action), `${p.id}: action`);
  }
  const motion = STACK.find((p) => p.id === "motion");
  assert.deepEqual(
    [motion.registry, motion.status, motion.action],
    ["none", "development", "lab"],
    "the lab is not a package and is still in development",
  );
  assert.equal(new Set(STACK.map((p) => p.id)).size, STACK.length);
});

test("every entry has its words in English and French (site.home.stack.<id>.line)", () => {
  for (const lang of ["en", "fr"]) {
    const s = messages(lang).site.home.stack;
    for (const p of STACK) assert.ok(s[p.id]?.line, `${lang}: site.home.stack.${p.id}.line`);
  }
});

test("the first action goes to the site, the lab to its scene", () => {
  assert.equal(stackActionUrl(STACK[0]), "https://ui.krizaka.com");
  assert.equal(stackActionUrl(STACK[1]), "https://lab.krizaka.com/orazaka");
  assert.equal(hostOf(STACK[1].url), "lab.krizaka.com");
});

test("Krizaka Lab is served over HTTPS at lab.krizaka.com, one value in the data (LAB_SITE)", () => {
  const data = read("lib/stack.ts");
  assert.match(data, /const LAB_SITE = "https:\/\/lab\.krizaka\.com";/);
  assert.doesNotMatch(data, /github\.io/);
  assert.doesNotMatch(
    read("app/components/home/OpenStack.tsx"),
    /github\.io|lab\.krizaka\.com/,
    "no host typed in a component",
  );
});

test("the tiles are the only drawing of the stack: no row, no home visual left", () => {
  const css = read("app/components/home/stack-tiles.css");
  assert.doesNotMatch(css, /kz-stack-/, "the home's rows' styles are gone");
  assert.doesNotMatch(read("scripts/ci-container-smoke.sh"), /check-home-stack/);
});
