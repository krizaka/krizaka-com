import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { START_PATHS, CONTRIBUTING_URL } from "../lib/docs-start.ts";
import { uiRedirects } from "../lib/ui-redirects.ts";

// 2026-10-30 (founder): « Services first, then Docs » — the old /open-source page was a page of stats; /docs answers
// « where do I start? » and /open-source answers 308 there.
const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const messages = (l) => JSON.parse(read(`messages/${l}.json`));

test("the bar: Services first, then Docs (served at /docs); Open source is no entry any more", () => {
  const nav = read("lib/nav.ts");
  assert.match(nav, /NAV_BAR_LINKS[^=]*= \(\["services", "repos"\] as const\)/);
  assert.match(nav, /\{ href: "\/docs", icon: "repos", match: \["\/open-source\/"\] \}/);
  assert.equal(messages("en").site.nav.company.repos.label, "Docs");
  assert.equal(messages("fr").site.nav.company.repos.label, "Documentation");
});

test("/open-source and /<locale>/open-source answer 308 to /docs in the reader's language", () => {
  const rules = uiRedirects();
  const rule = (source) => rules.find((r) => r.source === source);
  assert.deepEqual(rule("/fr/open-source"), { source: "/fr/open-source", destination: "/fr/docs", statusCode: 308 });
  assert.deepEqual(rule("/:locale(en)?/open-source"), {
    source: "/:locale(en)?/open-source",
    destination: "/en/docs",
    statusCode: 308,
  });
  assert.ok(!rules.some((r) => r.destination.endsWith("/open-source")), "nothing leads to /open-source any more");
});

test("every path of the hub has its words in both languages and 2-3 links, absolute on its own site", () => {
  assert.deepEqual(
    START_PATHS.map((p) => p.id),
    ["ui", "java", "products", "contribute"],
  );
  for (const p of START_PATHS) {
    assert.ok(p.links.length >= 2 && p.links.length <= 3, `${p.id}: 2-3 links`);
    for (const l of p.links) assert.match(l.href, /^https:\/\//, `${p.id}/${l.id}`);
    for (const lang of ["en", "fr"]) {
      const w = messages(lang).site.openSource.hub.paths[p.id];
      assert.ok(w.title && w.text, `${lang} ${p.id}`);
      for (const l of p.links) assert.ok(w.links[l.id], `${lang} ${p.id}.${l.id}`);
    }
  }
  assert.equal(START_PATHS.find((p) => p.id === "contribute").href, CONTRIBUTING_URL);
});
