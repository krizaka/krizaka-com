import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { weeklySeriesTotal } from "../lib/package-catalogue.ts";
import { STACK } from "../lib/stack.ts";
import { uiCatalogue } from "../lib/ui-catalogue.ts";
import { cataloguePageUrl, matchCatalogue } from "../lib/catalogue-match.ts";
import { BENCH_SHAPES, BENCH_VARIANTS, benchCode } from "../lib/bench-code.ts";
import { SKILLS_MARKETPLACE, SKILLS_PLUGINS, skillsInstall } from "../lib/skills-plugins.ts";

// 2026-10-30 (the CTO's direction, redesigned with krizaka-skills): /open-source is a living showcase on its declared
// template — the docs hub of @krizaka/ui with the catalogue's search first, real components the visitor drives, the
// Lab's engine flow, one-line installs with live versions, Krizaka Skills — and no band of counters under the hero.
const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const page = () => read("app/[locale]/open-source/page.tsx");

test("the downloads sparkline sums the twelve weeks of every package that reports them, and is absent otherwise", () => {
  const a = Array.from({ length: 12 }, (_, i) => i);
  const b = Array.from({ length: 12 }, () => 10);
  assert.deepEqual(
    weeklySeriesTotal([{ weeklySeries: a }, { weeklySeries: b }, {}, { weeklySeries: [1, 2] }]),
    a.map((x) => x + 10),
  );
  assert.equal(weeklySeriesTotal([{}, { weeklySeries: [1] }]), undefined);
});

test("the page is its template: DocsHubPage of @krizaka/ui, the search first, no counter band, no hand-made hero", () => {
  const p = page();
  assert.match(p, /from "@krizaka\/ui\/docs-hub-page"/);
  assert.match(p, /<DocsHubPage/);
  assert.match(p, /search=\{/);
  assert.doesNotMatch(
    p,
    /<PageHero|variant="strip"|StatGrid|style=\{\{/,
    "the hero is the template's; figures are a line of facts",
  );
  assert.match(read("lib/page-templates.ts"), /"\/open-source": "docs-hub"/);
});

test("the catalogue search reads the published registries, drops deprecated entries, and links ui.krizaka.com", async () => {
  const items = (pkg) =>
    pkg === "@krizaka/ui"
      ? [
          { name: "button", title: "Button", category: "actions" },
          { name: "terminal-replay", title: "Terminal replay", category: "media", status: "deprecated" },
          { name: "data-table", title: "Data table", category: "data-display" },
        ]
      : [
          { name: "sparkline", title: "Sparkline", category: "charts" },
          { name: "button", title: "Dup" },
        ];
  const entries = await uiCatalogue(items);
  assert.deepEqual(
    entries.map((e) => e.name),
    ["button", "data-table", "sparkline"],
  );
  assert.deepEqual(
    matchCatalogue(entries, "tab").map((e) => e.name),
    ["data-table"],
  );
  assert.deepEqual(matchCatalogue(entries, "  "), []);
  assert.deepEqual(
    matchCatalogue(entries, "chart").map((e) => e.name),
    ["sparkline"],
    "the category is searched last",
  );
  assert.equal(cataloguePageUrl("button", "en"), "https://ui.krizaka.com/components/button");
  assert.equal(cataloguePageUrl("button", "fr"), "https://ui.krizaka.com/fr/components/button");
  // The real registry, installed: the search has entries and none is deprecated.
  const real = await uiCatalogue();
  assert.ok(real.length > 50, `${real.length} entries`);
  assert.ok(
    !real.some((e) => e.name === "terminal-replay" || e.name === "showcase"),
    "deprecated pieces are not offered",
  );
});

test("the bench's code is what it draws: every variant and shape of the kit, the state written into the JSX", () => {
  const code = benchCode({
    variant: "ghost",
    shape: "pill",
    progress: 42,
    disabled: true,
    action: "Go",
    meter: "Setup",
  });
  assert.match(code, /import \{ Button \} from "@krizaka\/ui\/button";/);
  assert.match(code, /<Button variant="ghost" shape="pill" size="lg" disabled>Go<\/Button>/);
  assert.match(code, /<Meter label="Setup" value=\{42\} showLabel \/>/);
  assert.doesNotMatch(
    benchCode({ variant: "primary", shape: "cut", progress: 0, disabled: false, action: "a", meter: "b" }),
    /disabled/,
  );
  const dts = read("node_modules/@krizaka/ui/dist/button.d.ts");
  for (const v of BENCH_VARIANTS) assert.match(dts, new RegExp(`readonly ${v}:`), `variant ${v} exists in @krizaka/ui`);
  for (const s of BENCH_SHAPES) assert.match(dts, new RegExp(`readonly ${s}:`), `shape ${s} exists in @krizaka/ui`);
  const bench = read("app/[locale]/open-source/ComponentBench.tsx");
  assert.match(bench, /^"use client";/);
  assert.doesNotMatch(
    bench,
    /\binert\b|useEffect|fetch\(/,
    "a live bench: no inert picture, no effect, nothing fetched",
  );
});

test("Play with it: the bench and the Lab's engine flow, each a framed figure with its caption", () => {
  const p = page();
  assert.match(p, /<ComponentBench/);
  assert.match(p, /<MotionPlayground w=\{site\.home\.stack\.motion\} \/>/);
  assert.equal((p.match(/<figure className="os-figure">/g) ?? []).length, 2);
  assert.equal((p.match(/<figcaption>/g) ?? []).length, 2);
});

test("Krizaka Skills: the marketplace's real commands, one tab per plugin", () => {
  const skills = STACK.find((s) => s.id === "skills");
  assert.equal(skills.repoUrl, "https://github.com/krizaka/krizaka-skills");
  assert.equal(SKILLS_MARKETPLACE, "krizaka-skills");
  assert.deepEqual(
    SKILLS_PLUGINS.map((p) => p.name),
    ["krizaka-design", "krizaka-engineering", "krizaka-growth"],
  );
  assert.equal(
    skillsInstall(SKILLS_PLUGINS[0]),
    "/plugin marketplace add krizaka/krizaka-skills\n/plugin install krizaka-design@krizaka-skills",
  );
  assert.match(page(), /SKILLS_PLUGINS\.map/);
});

test("the quick start's versions are read at build, never typed; every new word exists in both languages", () => {
  const p = page();
  assert.match(p, /publishedVersion\("@krizaka\/ui"\)/);
  assert.doesNotMatch(p + read("app/[locale]/open-source/StackGlance.tsx"), /@\d+\.\d+\.\d+|\b\d+\.\d+\.\d+\b/);
  const en = JSON.parse(read("messages/en.json")).site.openSource.hub;
  const fr = JSON.parse(read("messages/fr.json")).site.openSource.hub;
  const keys = (o, pre = "") =>
    Object.entries(o).flatMap(([k, v]) => (typeof v === "object" ? keys(v, `${pre}${k}.`) : [`${pre}${k}`]));
  assert.deepEqual(keys(fr).sort(), keys(en).sort());
  assert.equal(en.eyebrow, en.eyebrow.toLowerCase(), "Cahier: a lower-case note, never a tracked uppercase eyebrow");
});
