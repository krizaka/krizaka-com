import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  absolutizeLinks, describeStandard, extractIntro, orderStandards, parseInline, resolveSnapshot, STANDARDS_BLOB, STANDARDS_ORDER,
} from "../lib/standards.ts";

const doc = `# CI and deploy — one pipeline (epic [#113](https://x/113))

<!-- intro:start -->
First paragraph with \`code\`
on two lines.

Second paragraph.

- one
- two
<!-- intro:end -->

## Body
`;

test("the intro is what sits between the markers: paragraphs, then the list", () => {
  assert.deepEqual(extractIntro(doc), { paragraphs: ["First paragraph with `code` on two lines.", "Second paragraph."], bullets: ["one", "two"] });
});

test("no markers, reversed markers or an empty block give null, never an empty intro", () => {
  assert.equal(extractIntro("# T\n\nno markers"), null);
  assert.equal(extractIntro("<!-- intro:end --> x <!-- intro:start -->"), null);
  assert.equal(extractIntro("<!-- intro:start -->\n\n<!-- intro:end -->"), null);
});

test("a standard's card: first heading, then the summary marker or else the first paragraph's first sentence", () => {
  assert.deepEqual(describeStandard("# Guards: the registry\n\nThis page lists the guards that catch each lesson. It has more.\n"), { title: "Guards: the registry", summary: "This page lists the guards that catch each lesson." });
  assert.deepEqual(describeStandard("# A title (epic #4)\n\n<!-- summary: The marker wins. -->\n\nParagraph here that is long enough."), { title: "A title", summary: "The marker wins." });
  assert.equal(describeStandard("no heading\n\ntext"), null);
});

test("a quote, a table, a list or a code fence is not a summary", () => {
  const md = "# T\n\n> quote\n\n```\ncode line here\n```\n\n| a | b |\n\nThe real first paragraph of the file.";
  assert.equal(describeStandard(md)?.summary, "The real first paragraph of the file.");
});

test("order: the ordering list first, unknown standards after it, alphabetically", () => {
  const ids = ["zeta", "guards", "alpha", "ci-and-deploy", "repo-layout"].map((id) => ({ id }));
  assert.deepEqual(orderStandards(ids).map((s) => s.id), ["ci-and-deploy", "guards", "repo-layout", "alpha", "zeta"]);
  assert.equal(STANDARDS_ORDER[0], "ci-and-deploy");
});

test("relative links of the intro point at the file on GitHub, absolute ones stay", () => {
  assert.equal(absolutizeLinks("[g](guards.md) [x](https://a.b/c) [h](#h)"), `[g](${STANDARDS_BLOB}/guards.md) [x](https://a.b/c) [h](#h)`);
});

const snap = (n) => ({ fetchedAt: "t", intro: { paragraphs: ["p"], bullets: [] }, standards: Array.from({ length: n }, (_, i) => ({ id: `s${i}`, title: "t", summary: "s", url: "u" })) });

test("fallback: fresh wins, else the last good copy, else it fails loudly", () => {
  const good = snap(2);
  const fresh = snap(1);
  assert.equal(resolveSnapshot(fresh, good), fresh);
  assert.equal(resolveSnapshot(null, good, "offline"), good);
  assert.equal(resolveSnapshot({ ...snap(1), intro: { paragraphs: [], bullets: [] } }, good), good);
  assert.throws(() => resolveSnapshot(null, null, "offline"), /no earlier copy: offline/);
  assert.throws(() => resolveSnapshot(snap(0), snap(0)), /no earlier copy/);
});

test("inline markdown: code, bold, links; anything else stays text", () => {
  assert.deepEqual(parseInline("a `b` **c** [d](https://e.f) g"), [
    { kind: "text", text: "a " }, { kind: "code", text: "b" }, { kind: "text", text: " " }, { kind: "bold", text: "c" },
    { kind: "text", text: " " }, { kind: "link", text: "d", href: "https://e.f" }, { kind: "text", text: " g" },
  ]);
  assert.deepEqual(parseInline("[rel](x.md)"), [{ kind: "text", text: "[rel](x.md)" }]);
});

test("/open-source opens with the CI intro, then the standards, before the stack; both are read from the snapshot", () => {
  const page = readFileSync(new URL("../app/[locale]/open-source/page.tsx", import.meta.url), "utf8");
  const at = (s) => page.indexOf(s);
  assert.ok(at("<CiIntroSection") > at("</PageHero>"));
  assert.ok(at("<CiIntroSection") < at("<StandardsSection"));
  assert.ok(at("<StandardsSection") < at('<Section id="stack"'));
  assert.match(page, /@\/lib\/standards\.json/);
  const view = readFileSync(new URL("../app/[locale]/open-source/Standards.tsx", import.meta.url), "utf8");
  assert.match(view, /LinkCard/);
  assert.match(view, /CI_STANDARD/);
});

test("the build generates the snapshot, git-ignores it and the words exist in both languages", () => {
  const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  assert.match(pkg.scripts.build, /gen-standards\.mjs/);
  assert.match(readFileSync(new URL("../.gitignore", import.meta.url), "utf8"), /^lib\/standards\.json$/m);
  for (const l of ["en", "fr"]) {
    const m = JSON.parse(readFileSync(new URL(`../messages/${l}.json`, import.meta.url), "utf8")).site.openSource;
    for (const k of ["eyebrow", "title", "source", "full"]) assert.ok(m.ci[k], `${l} ci.${k}`);
    for (const k of ["eyebrow", "title", "lead", "open"]) assert.ok(m.standards[k], `${l} standards.${k}`);
  }
  const fr = JSON.parse(readFileSync(new URL("../messages/fr.json", import.meta.url), "utf8")).site.openSource;
  assert.match(fr.ci.source, /en anglais/);
});
