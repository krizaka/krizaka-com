import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { GOOD_FIRST_URL, issuesUrl, releasesUrl, roadmapLinks } from "../lib/library-links.ts";
import { STACK } from "../lib/stack.ts";
import { packageRows } from "../lib/package-catalogue.ts";

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const REPO = "https://github.com/krizaka/krizaka-ui";

test("releases and issues are GitHub's: the site never copies release notes (#467)", () => {
  assert.equal(releasesUrl(REPO), `${REPO}/releases`);
  assert.equal(issuesUrl(`${REPO}/`), `${REPO}/issues`);
  assert.equal(releasesUrl("https://example.com/x"), undefined);
  assert.match(GOOD_FIRST_URL, /^https:\/\/github\.com\/search\?/);
  assert.match(decodeURIComponent(GOOD_FIRST_URL), /org:krizaka/);
  assert.match(decodeURIComponent(GOOD_FIRST_URL), /label:"good first issue"/);
});

test("the roadmap of the libraries is one row per stack part with a repository, from lib/stack.ts", () => {
  const rows = roadmapLinks(STACK);
  assert.deepEqual(rows.map((r) => r.id), STACK.map((p) => p.id));
  for (const r of rows) {
    assert.ok(r.issues.endsWith("/issues") && r.releases.endsWith("/releases"), r.id);
  }
});

test("a package row carries its release notes link when its repository is known", () => {
  const rows = packageRows(
    { npm: { "@krizaka/ui": "1.0.0" }, npmMeta: { "@krizaka/ui": { repository: REPO, description: "UI" } } },
    ["krizaka-ui"],
    "https://java.krizaka.com",
  );
  assert.equal(rows[0].releasesUrl, `${REPO}/releases`);
});

test("/open-source: the packages table links the releases, the page has a roadmap and the good-first-issue entry", () => {
  const page = read("app/[locale]/open-source/page.tsx");
  const table = read("app/[locale]/open-source/OpenSourceTables.tsx");
  assert.match(page, /id="roadmap"/);
  assert.match(page, /GOOD_FIRST_URL/);
  assert.match(table, /releasesUrl/);
  for (const lang of ["en", "fr"]) {
    const m = JSON.parse(read(`messages/${lang}.json`)).site.openSource;
    for (const k of ["title", "lead", "issues", "releases", "note"]) assert.ok(m.roadmap[k], `${lang} roadmap.${k}`);
    assert.ok(m.contribute.goodFirst && m.packages.releases && m.packages.releasesAria, lang);
  }
});
