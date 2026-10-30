import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { weeklySeriesTotal } from "../lib/package-catalogue.ts";
import { STACK } from "../lib/stack.ts";

// 2026-10-30 (founder: « trois boîtes de stats et deux cartes avec des aperçus jouets, ça fait amateur »): /open-source
// shows the stack at a glance (every part, honest status), real install code with the read versions, live figures.
const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");

test("the downloads sparkline sums the twelve weeks of every package that reports them, and is absent otherwise", () => {
  const a = Array.from({ length: 12 }, (_, i) => i);
  const b = Array.from({ length: 12 }, () => 10);
  assert.deepEqual(
    weeklySeriesTotal([{ weeklySeries: a }, { weeklySeries: b }, {}, { weeklySeries: [1, 2] }]),
    a.map((x) => x + 10),
  );
  assert.equal(weeklySeriesTotal([{}, { weeklySeries: [1] }]), undefined);
});

test("Krizaka Skills is in the stack, public and honestly in development (nothing published, no install command)", () => {
  const skills = STACK.find((p) => p.id === "skills");
  assert.ok(skills);
  assert.equal(skills.repoUrl, "https://github.com/krizaka/krizaka-skills");
  assert.deepEqual([skills.registry, skills.status], ["none", "development"]);
  assert.doesNotMatch(read("app/[locale]/open-source/StackGlance.tsx"), /plugin (marketplace )?add|krizaka-skills/);
});

test("the page draws the stack at a glance and the real install code — no toy preview, no plain figure boxes", () => {
  const page = read("app/[locale]/open-source/page.tsx");
  assert.match(page, /<StackGlance/);
  assert.match(page, /<InstallTabs/);
  assert.match(page, /variant="strip"/);
  assert.doesNotMatch(page, /StackTiles|FigureTiles|UiShowcase|MotionPlayground/);
  const glance = read("app/[locale]/open-source/StackGlance.tsx");
  assert.match(glance, /mavenVersion\("krizaka-bom"\)/, "versions read at build, never typed");
  assert.doesNotMatch(glance, /\d+\.\d+\.\d+/, "no version typed in the module");
});
