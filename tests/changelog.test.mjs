import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { anchorOf, changeFromTitle, changelogRss, draftFromTitles, parseChangesets, parseReleaseBody, tagOf } from "../lib/changelog.ts";
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
  const xml = changelogRss({ releases: [release], title: "t", description: "d", siteUrl: "https://s", pageUrl: "https://s/en/changelog", feedUrl: "https://s/en/changelog/feed.xml", language: "en", tagLabel: { feature: "New", fix: "Fixed", security: "Security", breaking: "Breaking", change: "Changed" } });
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
  assert.match(read("app/[locale]/changelog/page.tsx"), /<ChangelogPage\b/);
  assert.match(read("app/[locale]/changelog/page.tsx"), /RELEASES\.map/, "the entries come from the release data");
});

test("the footer shows the version and the UI version and links /changelog#<version>; the page owns that anchor", () => {
  const footer = read("app/components/SiteFooter.tsx");
  assert.match(footer, /href=\{changelogHref\(\)\}/);
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
