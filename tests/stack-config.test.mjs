import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { ROWS } from "../scripts/home-stack-lib.mjs";
import { STACK, STACK_VISUALS, hostOf, stackActionUrl, stackCode } from "../lib/stack.ts";

// krizaka-com#392: every publication is ONE entry of lib/stack.ts — Krizaka Motion included — and the home maps over the list.
// Adding one is an entry and its messages: this test is what makes a missing message or an unknown visual a failure.
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const messages = (lang) => JSON.parse(read(`messages/${lang}.json`));

test("the list: four publications, Krizaka Motion among them, with their registry, status and a known visual", () => {
  assert.deepEqual(STACK.map((p) => p.id), ["ui", "motion", "java", "ts"]);
  for (const p of STACK) {
    assert.ok(p.name && p.url.startsWith("https://") && p.repoUrl.startsWith("https://github.com/krizaka/"), p.id);
    assert.ok(["npm", "maven", "none"].includes(p.registry), `${p.id}: registry`);
    assert.ok(["released", "development"].includes(p.status), `${p.id}: status`);
    assert.ok(STACK_VISUALS.includes(p.visual), `${p.id}: visual "${p.visual}" is not one of ${STACK_VISUALS.join(", ")}`);
    assert.ok(["docs", "lab"].includes(p.action), `${p.id}: action`);
  }
  assert.deepEqual(STACK_VISUALS, ["ui-showcase", "engine-flow", "package-cloud", "code"]);
  const motion = STACK.find((p) => p.id === "motion");
  assert.deepEqual([motion.registry, motion.status, motion.visual, motion.action], ["none", "development", "engine-flow", "lab"], "the lab is not a package and is still in development");
  assert.equal(new Set(STACK.map((p) => p.id)).size, STACK.length);
  assert.equal(ROWS, STACK.length, "the browser check expects one row per publication");
});

test("every entry has its messages in English and French (site.home.stack.<id>.line) and the row words exist", () => {
  for (const lang of ["en", "fr"]) {
    const s = messages(lang).site.home.stack;
    for (const p of STACK) assert.ok(s[p.id]?.line, `${lang}: site.home.stack.${p.id}.line`);
    const r = s.row;
    for (const k of ["listLabel", "docs", "lab", "source", "docsAria", "labAria", "sourceAria", "packages"]) assert.ok(r[k], `${lang}: row.${k}`);
    for (const k of ["released", "development"]) assert.ok(r.stamps[k], `${lang}: row.stamps.${k}`);
    for (const k of ["site", "registry", "licence"]) assert.ok(r.fields[k], `${lang}: row.fields.${k}`);
    for (const p of STACK) assert.ok(r.registries[p.registry], `${lang}: row.registries.${p.registry}`);
  }
});

test("every visual of the config is drawn by the visuals chunk — and nothing else is", () => {
  const chunk = read("app/components/home/stack/StackVisuals.tsx");
  const cases = [...chunk.matchAll(/case "([a-z-]+)":/g)].map((m) => m[1]);
  assert.deepEqual(cases.sort(), [...STACK_VISUALS].sort());
});

test("the code is the library series from the order of the list; the first action goes to the site, the lab to its scene", () => {
  assert.deepEqual(STACK.map(stackCode), ["KZ-L01", "KZ-L02", "KZ-L03", "KZ-L04"]);
  for (const p of STACK) assert.match(stackCode(p), /^KZ-L\d{2}$/);
  assert.equal(stackActionUrl(STACK[0]), "https://ui.krizaka.com");
  assert.equal(stackActionUrl(STACK[1]), "https://motion.krizaka.com/orazaka");
  assert.equal(hostOf(STACK[1].url), "motion.krizaka.com");
});

test("Krizaka Motion is served over HTTPS at motion.krizaka.com, one value in the data (MOTION_SITE)", () => {
  const data = read("lib/stack.ts");
  assert.match(data, /const MOTION_SITE = "https:\/\/motion\.krizaka\.com";/);
  assert.doesNotMatch(data, /github\.io/);
  for (const file of ["app/components/home/OpenStack.tsx", ...readdirSync(new URL("../app/components/home/stack", import.meta.url)).map((f) => `app/components/home/stack/${f}`)]) {
    assert.doesNotMatch(read(file), /github\.io|motion\.krizaka\.com/, `${file}: no host typed in a component`);
  }
});

test("the home maps over the list: no tile written by hand, the visual lazy and inert, the rows alternate and stack on a phone", () => {
  const home = read("app/components/home/OpenStack.tsx");
  assert.match(home, /\{STACK\.map\(\(p\) => \(\s*<StackRow key=\{p\.id\} part=\{p\}/);
  assert.match(home, /<SpecimenTag[^>]*className="kz-stack-tag"/s);
  assert.match(home, /code=\{stackCode\(part\)\}/, "the code is derived, never typed");
  assert.match(home, /\{ label: r\.fields\.site[\s\S]*r\.fields\.registry[\s\S]*r\.fields\.licence/, "fields instead of a bird");
  assert.doesNotMatch(home.slice(home.indexOf("function StackRow"), home.indexOf("function Tile")), /Mascot|Bird/, "libraries carry no bird");
  const visual = read("app/components/home/stack/StackVisual.tsx");
  assert.match(visual, /dynamic\(\(\) => import\("\.\/StackVisuals"\), \{ ssr: false \}\)/, "a lazy chunk");
  assert.match(visual, /IntersectionObserver/);
  assert.match(visual, /className="kz-stack-visual"[^>]*inert aria-hidden/);
  const css = read("app/components/home/stack-tiles.css");
  assert.match(css, /\.kz-stack-visual \{[^}]*height: 20rem/, "a fixed box: no layout shift");
  assert.match(css, /\.kz-stack-row:nth-child\(even\) \.kz-stack-plate \{ order: 2; \}/, "the rows alternate");
  assert.match(css, /@media \(min-width: 640px\)[\s\S]*\.kz-stack-row \{ grid-template-columns/, "one column below 640px");
  assert.match(read("app/components/home/stack/StackVisuals.tsx"), /<MotionPlayground calm /, "Motion plays at the calm level of EngineFlow, not a still");
});
