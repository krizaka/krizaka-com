import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { anchorOf, changeFromTitle, changelogRss, changesFor, cleanText, draftFromTitles, parseChangesets, parseReleaseBodies, parseReleaseBody, releaseLabel, releaseProblems, tagOf, textProblems } from "../lib/changelog.ts";
import { filterHref, filterOf, visibleEntries, visibleFilters } from "../lib/changelog-filter.ts";
import { changelogProblems } from "../scripts/check-changelog-build.mjs";

const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const messages = (lang) => JSON.parse(read(`messages/${lang}.json`));

const CHANGESETS = `# @krizaka/ui

## 3.22.0

### Minor Changes

- [#293](https://github.com/krizaka/krizaka-ui/pull/293) [\`9c804b3\`](https://github.com/krizaka/krizaka-ui/commit/9c804b3) Thanks [@x](https://github.com/x)! - Two blocks for product landing pages. \`ComparisonTable\` is a fair grid.

### Patch Changes

- [#308](https://github.com/krizaka/krizaka-ui/pull/308) [\`284468a\`](https://github.com/krizaka/krizaka-ui/commit/284468a) Thanks [@x](https://github.com/x)! - Focus rings only for the keyboard.
- Updated dependencies [[\`284468a\`](https://github.com/x)]:
  - @krizaka/tailwind@3.22.0

## 3.21.0

### Major Changes

- [#1](https://github.com/krizaka/krizaka-ui/pull/1) [\`a\`](https://github.com/x) Thanks [@x](https://github.com/x)! - BREAKING: Button drops its legacy prop.

## 3.0.0

### Patch Changes

- Updated dependencies []:
  - @krizaka/tokens@3.0.0
`;
const dates = { "3.22.0": "2026-10-17", "3.21.0": "2026-10-17", "3.0.0": "2026-09-01" };

test("changesets: versions, dates, tags from the level, PR links, plain text, no dependency plumbing", () => {
  const releases = parseChangesets(CHANGESETS, "@krizaka/ui", (v) => dates[v]);
  assert.deepEqual(releases.map((r) => r.version), ["3.22.0", "3.21.0"], "3.0.0 only updated dependencies");
  const [r] = releases;
  assert.equal(r.date, "2026-10-17");
  assert.deepEqual(r.changes.map((c) => c.tag), ["feature", "fix"]);
  assert.equal(r.changes[0].text, "Two blocks for product landing pages.");
  assert.deepEqual(r.changes[0].pr, { number: 293, url: "https://github.com/krizaka/krizaka-ui/pull/293" });
  assert.equal(releases[1].changes[0].tag, "breaking");
});

test("a version without a publish date is not invented", () => {
  assert.deepEqual(parseChangesets(CHANGESETS, "x", () => undefined), []);
});

test("tags: breaking and security words win over the level", () => {
  assert.equal(tagOf("BREAKING: drops a prop", "fix"), "breaking");
  assert.equal(tagOf("Fixes a XSS in the login", "fix"), "security");
  assert.equal(tagOf("Faster lists", "feature"), "feature");
});

test("release bodies: conventional titles tagged, housekeeping dropped, PR from the URL", () => {
  const body = [
    "## What's Changed",
    "* feat(chat): voice replies by @oussamaABID in https://github.com/krizaka/orazaka/pull/12",
    "* fix: the export no longer hangs by @oussamaABID in https://github.com/krizaka/orazaka/pull/13",
    "* chore(deps): bump zod by @dependabot in https://github.com/krizaka/orazaka/pull/14",
    "* feat!: new session API by @x in https://github.com/krizaka/orazaka/pull/15",
    "**Full Changelog**: https://github.com/krizaka/orazaka/compare/a...b",
  ].join("\n");
  const items = parseReleaseBody(body);
  assert.deepEqual(items.map((i) => [i.tag, i.pr?.number]), [["feature", 12], ["fix", 13], ["breaking", 15]]);
  assert.equal(items[0].text, "Voice replies.");
});

test("the draft generator: plain sentences grouped by tag, housekeeping left out", () => {
  const draft = draftFromTitles(["feat(nav): Our story leaves the top bar (#196)", "chore: bump", "fix(contact): XSS in the form (#201)", "docs: readme"], "1.1.0");
  assert.match(draft, /^## 1\.1\.0\n/);
  assert.match(draft, /### Security\n- XSS in the form\. \(#201\)/);
  assert.match(draft, /### New\n- Our story leaves the top bar\. \(#196\)/);
  assert.doesNotMatch(draft, /bump|readme/);
  assert.equal(changeFromTitle("ci: cache"), null);
});

test("the feed is RSS 2.0 with one item per release, anchored on the page", () => {
  const release = { source: "@krizaka/ui", version: "3.22.0", date: "2026-10-17", changes: [{ tag: "feature", text: "A & B" }] };
  const xml = changelogRss({ releases: [release], title: "t", description: "d", siteUrl: "https://s", pageUrl: "https://s/en/changelog", feedUrl: "https://s/en/changelog/feed.xml", language: "en", lang: "en", tagLabel: { feature: "New", fix: "Fixed", security: "Security", breaking: "Breaking", change: "Changed" } });
  assert.match(xml, /<rss version="2\.0"/);
  assert.match(xml, /<link>https:\/\/s\/en\/changelog#krizaka-ui-3-22-0<\/link>/);
  assert.match(xml, /A &amp;amp; B/);
  assert.equal(anchorOf(release), "krizaka-ui-3-22-0");
});

test("the changelog route, its feed and its template exist; the page is in the sitemap", () => {
  assert.ok(existsSync(new URL("../app/[locale]/changelog/page.tsx", import.meta.url)));
  assert.ok(existsSync(new URL("../app/[locale]/changelog/feed.xml/route.ts", import.meta.url)));
  assert.match(read("lib/page-templates.ts"), /"\/changelog": "changelog"/);
  assert.match(read("app/sitemap.ts"), /"\/changelog"/);
  assert.match(read("app/components/ChangelogView.tsx"), /<ChangelogPage\b/);
  assert.match(read("app/[locale]/changelog/page.tsx"), /RELEASES\.map/, "the entries come from the release data");
});

test("the footer shows the version and the UI version and links /changelog#<version>; the page owns that anchor", () => {
  const footer = read("app/components/SiteFooter.tsx");
  assert.match(footer, /href=\{to\(changelogHref\(\)\)\}/);
  assert.match(footer, /PLATFORM\.ui/);
  assert.match(read("lib/changelog-data.ts"), /`\/changelog#\$\{version\}`/);
  assert.match(read("app/[locale]/changelog/page.tsx"), /<span id=\{PLATFORM\.site\}>/);
});

test("the build check demands the latest release and the footer's anchor on the page", () => {
  const latest = { source: "@krizaka/ui", version: "3.22.0" };
  const html = '<h1>What shipped</h1><a>@krizaka/ui 3.22.0</a><span id="0.1.0">x</span>';
  assert.deepEqual(changelogProblems(html, { latest, siteVersion: "0.1.0" }), []);
  assert.equal(changelogProblems(html.replace("3.22.0", "3.21.0"), { latest, siteVersion: "0.1.0" }).length, 1);
  assert.equal(changelogProblems(html.replace('id="0.1.0"', ""), { latest, siteVersion: "0.1.0" }).length, 1);
});

test("every changelog word exists in English and French", () => {
  for (const lang of ["en", "fr"]) {
    const c = messages(lang).site.changelog;
    for (const k of ["metaTitle", "title", "lead", "runs", "feed", "empty"]) assert.ok(c[k], `${lang}: ${k}`);
    for (const k of ["added", "changed", "fixed", "removed"]) assert.ok(c.kinds[k], `${lang}: kinds.${k}`);
    for (const k of ["feature", "fix", "security", "breaking", "change"]) assert.ok(c.tags[k], `${lang}: tags.${k}`);
    assert.ok(messages(lang).site.footer.version.includes("{version}"));
  }
});

const WORKFLOW_BODY = `## English

New: 1. Fixed: 1.

- feat: Reads a lease. https://github.com/krizaka/yomizaka/pull/12
- fix: Stops the crash. https://github.com/krizaka/yomizaka/pull/13

## Français

Nouveautés : 1. Corrections : 1.

- feat: Lit un bail. https://github.com/krizaka/yomizaka/pull/12
- fix: Corrige le plantage. https://github.com/krizaka/yomizaka/pull/13
`;

test("a release written by the shared workflow keeps both languages, tags and PRs; any other body is English alone", () => {
  const { en, fr } = parseReleaseBodies(WORKFLOW_BODY);
  assert.deepEqual(en.map((c) => [c.tag, c.text, c.pr?.number]), [["feature", "Reads a lease.", 12], ["fix", "Stops the crash.", 13]]);
  assert.deepEqual(fr.map((c) => [c.tag, c.text, c.pr?.number]), [["feature", "Lit un bail.", 12], ["fix", "Corrige le plantage.", 13]]);
  const plainBody = parseReleaseBodies("* feat: Hello world by @x in https://github.com/krizaka/a/pull/1");
  assert.equal(plainBody.en.length, 1);
  assert.equal(plainBody.fr, undefined);
});

test("the French reader gets the French lines when the release wrote them, else the English ones", () => {
  const both = { changes: [{ tag: "fix", text: "a" }], fr: [{ tag: "fix", text: "b" }] };
  assert.equal(changesFor(both, "fr")[0].text, "b");
  assert.equal(changesFor(both, "en")[0].text, "a");
  assert.equal(changesFor({ changes: both.changes }, "fr")[0].text, "a");
});

test("a release of a product made of several repositories says which one, and its anchor differs", () => {
  const a = { source: "Orazaka", part: "edge", version: "2026.10.22.1" };
  const b = { source: "Orazaka", part: "studio", version: "2026.10.22.1" };
  assert.equal(releaseLabel(a), "Orazaka edge 2026.10.22.1");
  assert.notEqual(anchorOf(a), anchorOf(b));
  assert.equal(releaseLabel({ source: "Yomizaka", version: "2026.10.22.1" }), "Yomizaka 2026.10.22.1");
});

test("public text: an aside naming a person goes, an em dash becomes a colon, and the lint refuses what is left", () => {
  assert.equal(cleanText("Navigation standard (Oussama, 2026-10-17)."), "Navigation standard.");
  assert.equal(cleanText("AccountMenu — the menu under the avatar"), "AccountMenu: the menu under the avatar");
  assert.deepEqual(textProblems("Thanks Oussama"), ["a personal name (Oussama)"]);
  assert.deepEqual(textProblems("a — b"), ["an em dash"]);
  assert.deepEqual(textProblems("Reads a lease."), []);
  const release = { source: "Yomizaka", part: undefined, version: "1", changes: [{ tag: "fix", text: "Fixed by Abid." }], fr: [] };
  assert.equal(releaseProblems([release]).length, 1);
  // the parsers clean first: nothing a source writes reaches the page with a dash or an aside
  assert.equal(changeFromTitle("feat: sign in (Oussama's QA) — faster")?.text, "Sign in: faster.");
});

test("no em dash in the changelog's words, in either language", () => {
  for (const lang of ["en", "fr"]) assert.deepEqual(textProblems(JSON.stringify(messages(lang).site.changelog)), [], lang);
});

test("the product filter: the address is the state, the focus applies, an unknown value means everything", () => {
  assert.equal(filterOf("yomizaka"), "yomizaka");
  assert.equal(filterOf("nope"), undefined);
  assert.equal(filterOf(null), undefined);
  assert.equal(filterHref("", "yomizaka"), "?produit=yomizaka");
  assert.equal(filterHref("?carnet=complet&produit=ui", undefined), "?carnet=complet");
  assert.equal(filterHref("?produit=ui", undefined), "?");
  assert.ok(!visibleFilters(false).includes("orochia") && visibleFilters(true).includes("orochia"));
  assert.deepEqual(visibleFilters(false), ["orazaka", "yomizaka", "akinaza", "ui", "java"]);
  const entries = [{ product: "yomizaka" }, { product: "orochia" }, { product: "ui" }];
  assert.equal(visibleEntries(entries, undefined, false).length, 2);
  assert.equal(visibleEntries(entries, undefined, true).length, 3);
  assert.deepEqual(visibleEntries(entries, "ui", false), [{ product: "ui" }]);
  assert.deepEqual(visibleEntries(entries, "orochia", false), []);
});

test("the page filters through the address and reads both languages", () => {
  assert.match(read("app/[locale]/changelog/page.tsx"), /ChangelogView/);
  assert.match(read("app/components/ChangelogView.tsx"), /useSearchParam\(FILTER_PARAM\)/);
  const generator = read("scripts/gen-changelog.mjs");
  assert.match(generator, /release-repos\.json/);
  assert.match(generator, /releaseProblems/);
});
