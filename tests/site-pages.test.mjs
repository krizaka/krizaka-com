import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { baseFromArgv } from "../scripts/site-pages.mjs";

// One browser loop for every check of the rendered site (scripts/site-pages.mjs): the checks keep only their rule
// (a lib, tested) and their visit. The duplicate-code ratchet (dup-ratchet.json) only goes down.
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const CHECKS = ["scripts/check-overflow.mjs", "scripts/check-motion.mjs", "scripts/check-figures.mjs", "scripts/check-home-stack.mjs"];

test("the site to check comes from --base, localhost:3000 by default, never with a trailing slash", () => {
  assert.equal(baseFromArgv(["node", "x"]), "http://localhost:3000");
  assert.equal(baseFromArgv(["node", "x", "--base", "http://localhost:3377/"]), "http://localhost:3377");
  assert.equal(baseFromArgv(["node", "x", "--base", "https://www.krizaka.com"]), "https://www.krizaka.com");
});

test("every check of the rendered site visits its pages through the shared loop and owns no browser of its own", () => {
  for (const file of CHECKS) {
    const src = read(file);
    assert.match(src, /import \{ baseFromArgv, report, visitPages \} from "\.\/site-pages\.mjs"/, file);
    assert.match(src, /await visitPages\(/, file);
    assert.doesNotMatch(src, /chromium|newContext|addInitScript|kz-theme/, `${file} carries a loop of its own`);
  }
  const loop = read("scripts/site-pages.mjs");
  assert.match(loop, /localStorage\.setItem\("kz-theme", theme\)/, "the theme is persisted before the first paint");
  assert.match(loop, /sessionStorage\.setItem\("kz-intro", "done"\)/, "the intro is skipped");
  assert.match(loop, /waitUntil: "load"/, "load, never network-idle (a live page may keep polling)");
});
