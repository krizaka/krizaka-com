import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import {
  anchorOf,
  changeFromTitle,
  changelogRss,
  changesFor,
  cleanText,
  draftFromTitles,
  parseChangesets,
  parseReleaseBodies,
  parseReleaseBody,
  releaseLabel,
  releaseProblems,
  SITE_REPO,
  siteReleaseUrl,
  tagOf,
  textProblems,
} from "../lib/changelog.ts";
import { CODE_NAMES, findCodeNames } from "@krizaka/org";
import { commercialWords } from "../lib/commercial-words.ts";
import { ownPrs, prOf, urlsIn } from "../lib/changelog.ts";
import { lastModified } from "../lib/lastmod.ts";
import { FILTER_IDS, filterHref, filterOf, visibleEntries } from "../lib/changelog-filter.ts";
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
  assert.deepEqual(
    releases.map((r) => r.version),
    ["3.22.0", "3.21.0"],
    "3.0.0 only updated dependencies",
  );
  const [r] = releases;
  assert.equal(r.date, "2026-10-17");
  assert.deepEqual(
    r.changes.map((c) => c.tag),
    ["feature", "fix"],
  );
  assert.equal(r.changes[0].text, "Two blocks for product landing pages.");
  assert.deepEqual(r.changes[0].pr, { number: 293, url: "https://github.com/krizaka/krizaka-ui/pull/293" });
  assert.equal(releases[1].changes[0].tag, "breaking");
});

test("an identifier in backticks stays code: the page shows it as code, never as a code name in the words", () => {
  // krizaka-com#561: a krizaka-ui note named `.brand-sovkora`; stripped of its backticks it read as a code name on /changelog.
  const md = `# @krizaka/ui

## 3.82.0

### Minor Changes

- [#492](https://github.com/krizaka/krizaka-ui/pull/492) [\`f032b3b\`](https://github.com/x) Thanks [@x](https://github.com/x)! - Under a product brand (\`.brand-sovkora\`, \`-verikora\`) the margin ink is the accent of Sovkora.
`;
  const [r] = parseChangesets(md, "@krizaka/ui", () => "2026-11-01");
  const text = commercialWords(r.changes[0].text);
  assert.equal(text, "Under a product brand (`.brand-sovkora`, `-verikora`) the margin ink is the accent of Sovkora.");
  assert.deepEqual(findCodeNames(text), [], "a code span is code, the guard's own rule");
  assert.match(
    read("app/[locale]/changelog/page.tsx"),
    /<Ticks>\{ch\.text\}<\/Ticks>/,
    "the page draws the backticks as code",
  );
});

test("the feed draws a code span as code", () => {
  const xml = changelogRss({
    releases: [
      { source: "@krizaka/ui", version: "1.0.0", date: "2026-11-01", changes: [{ tag: "fix", text: "A `<b>` tag" }] },
    ],
    title: "t",
    description: "d",
    siteUrl: "https://s",
    pageUrl: "https://s/en/changelog",
    feedUrl: "https://s/en/changelog/feed.xml",
    language: "en",
    lang: "en",
    tagLabel: { feature: "New", fix: "Fixed", security: "Security", breaking: "Breaking", change: "Changed" },
  });
  assert.match(xml, /A &lt;code&gt;&amp;lt;b&amp;gt;&lt;\/code&gt; tag/);
});

test("a version without a publish date is not invented", () => {
  assert.deepEqual(
    parseChangesets(CHANGESETS, "x", () => undefined),
    [],
  );
});

test("tags: breaking and security words win over the level", () => {
  assert.equal(tagOf("BREAKING: drops a prop", "fix"), "breaking");
  assert.equal(tagOf("Fixes a XSS in the login", "fix"), "security");
  assert.equal(tagOf("Faster lists", "feature"), "feature");
});

test("release bodies: conventional titles tagged, housekeeping dropped, PR from the URL", () => {
  const body = [
    "## What's Changed",
    "* feat(chat): voice replies by @oussamaABID in https://github.com/krizaka/sovkora/pull/12",
    "* fix: the export no longer hangs by @oussamaABID in https://github.com/krizaka/sovkora/pull/13",
    "* chore(deps): bump zod by @dependabot in https://github.com/krizaka/sovkora/pull/14",
    "* feat!: new session API by @x in https://github.com/krizaka/sovkora/pull/15",
    "**Full Changelog**: https://github.com/krizaka/sovkora/compare/a...b",
  ].join("\n");
  const items = parseReleaseBody(body);
  assert.deepEqual(
    items.map((i) => [i.tag, i.pr?.number]),
    [
      ["feature", 12],
      ["fix", 13],
      ["breaking", 15],
    ],
  );
  assert.equal(items[0].text, "Voice replies.");
});

test("the draft generator: plain sentences grouped by tag, housekeeping left out", () => {
  const draft = draftFromTitles(
    [
      "feat(nav): Our story leaves the top bar (#196)",
      "chore: bump",
      "fix(contact): XSS in the form (#201)",
      "docs: readme",
    ],
    "1.1.0",
  );
  assert.match(draft, /^## 1\.1\.0\n/);
  assert.match(draft, /### Security\n- XSS in the form\. \(#201\)/);
  assert.match(draft, /### New\n- Our story leaves the top bar\. \(#196\)/);
  assert.doesNotMatch(draft, /bump|readme/);
  assert.equal(changeFromTitle("ci: cache"), null);
});

test("the feed is RSS 2.0 with one item per release, anchored on the page", () => {
  const release = {
    source: "@krizaka/ui",
    version: "3.22.0",
    date: "2026-10-17",
    changes: [{ tag: "feature", text: "A & B" }],
  };
  const xml = changelogRss({
    releases: [release],
    title: "t",
    description: "d",
    siteUrl: "https://s",
    pageUrl: "https://s/en/changelog",
    feedUrl: "https://s/en/changelog/feed.xml",
    language: "en",
    lang: "en",
    tagLabel: { feature: "New", fix: "Fixed", security: "Security", breaking: "Breaking", change: "Changed" },
  });
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

test("the footer shows krizaka.com's own version only, on its GitHub release; no package version on the page", () => {
  const footer = read("app/components/SiteFooter.tsx");
  // The configured footer (lib/footer.ts, showVersion) draws vX.Y.Z, linked to its release by versionHref.
  assert.match(footer, /version=\{PLATFORM\.site \|\| undefined\}/);
  assert.match(footer, /versionHref: PLATFORM\.release/);
  assert.match(read("lib/footer.ts"), /showVersion: true/);
  assert.doesNotMatch(footer, /PLATFORM\.(ui|tokens)|Krizaka UI|@krizaka\/ui \$/);
  for (const lang of ["en", "fr"]) {
    const m = messages(lang).site;
    assert.equal(m.footer.version, "v{version}", `${lang}: the footer says vX.Y.Z and nothing else`);
    assert.doesNotMatch(m.changelog.runs, /\{ui\}|Krizaka UI/, `${lang}: /changelog names no package version`);
  }
  assert.doesNotMatch(read("lib/changelog-data.ts"), /\bui:|tokens:/, "PLATFORM carries the site's version only");
  assert.doesNotMatch(
    read("scripts/gen-changelog.mjs"),
    /node_modules\/@krizaka/,
    "the generator reads no installed package's version",
  );
  assert.match(read("app/[locale]/changelog/page.tsx"), /<span id=\{PLATFORM\.site\}>/);
});

test("the site's release link: its GitHub release once published, the releases list before (never a dead link)", () => {
  assert.equal(SITE_REPO, "krizaka/krizaka-com");
  assert.equal(siteReleaseUrl("0.2.0", true), "https://github.com/krizaka/krizaka-com/releases/tag/v0.2.0");
  assert.equal(siteReleaseUrl("0.2.0", false), "https://github.com/krizaka/krizaka-com/releases");
  assert.equal(siteReleaseUrl("", true), "https://github.com/krizaka/krizaka-com/releases");
});

test("the site's version is release-please's: package.json and the manifest agree", () => {
  const pkg = JSON.parse(read("package.json"));
  const manifest = JSON.parse(read(".release-please-manifest.json"));
  const config = JSON.parse(read("release-please-config.json"));
  assert.equal(manifest["."], pkg.version);
  assert.equal(config.packages["."]["release-type"] ?? config["release-type"], "node");
  assert.match(pkg.version, /^\d+\.\d+\.\d+$/);
});

test("the build check demands the latest release and the footer's anchor on the page", () => {
  const latest = { source: "@krizaka/ui", version: "3.22.0" };
  const html = '<h1>What shipped</h1><li id="krizaka-ui-3-22-0"><a>3.22.0</a></li><span id="0.1.0">x</span>';
  assert.deepEqual(changelogProblems(html, { latest, siteVersion: "0.1.0" }), []);
  assert.equal(changelogProblems(html.replace("krizaka-ui-3-22-0", "x"), { latest, siteVersion: "0.1.0" }).length, 1);
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

- feat: Reads a lease. https://github.com/krizaka/verikora/pull/12
- fix: Stops the crash. https://github.com/krizaka/verikora/pull/13

## Français

Nouveautés : 1. Corrections : 1.

- feat: Lit un bail. https://github.com/krizaka/verikora/pull/12
- fix: Corrige le plantage. https://github.com/krizaka/verikora/pull/13
`;

test("a release written by the shared workflow keeps both languages, tags and PRs; any other body is English alone", () => {
  const { en, fr } = parseReleaseBodies(WORKFLOW_BODY);
  assert.deepEqual(
    en.map((c) => [c.tag, c.text, c.pr?.number]),
    [
      ["feature", "Reads a lease.", 12],
      ["fix", "Stops the crash.", 13],
    ],
  );
  assert.deepEqual(
    fr.map((c) => [c.tag, c.text, c.pr?.number]),
    [
      ["feature", "Lit un bail.", 12],
      ["fix", "Corrige le plantage.", 13],
    ],
  );
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
  const a = { source: "Sovkora", part: "edge", version: "2026.10.22.1" };
  const b = { source: "Sovkora", part: "studio", version: "2026.10.22.1" };
  assert.equal(releaseLabel(a), "Sovkora edge 2026.10.22.1");
  assert.notEqual(anchorOf(a), anchorOf(b));
  assert.equal(releaseLabel({ source: "Verikora", version: "2026.10.22.1" }), "Verikora 2026.10.22.1");
});

test("public text: an aside naming a person goes, an em dash becomes a colon, and the lint refuses what is left", () => {
  assert.equal(cleanText("Navigation standard (Oussama, 2026-10-17)."), "Navigation standard.");
  assert.equal(cleanText("AccountMenu — the menu under the avatar"), "AccountMenu: the menu under the avatar");
  assert.deepEqual(textProblems("Thanks Oussama"), ["a personal name (Oussama)"]);
  assert.deepEqual(textProblems("a — b"), ["an em dash"]);
  assert.deepEqual(textProblems("Reads a lease."), []);
  const release = {
    source: "Verikora",
    part: undefined,
    version: "1",
    changes: [{ tag: "fix", text: "Fixed by Abid." }],
    fr: [],
  };
  assert.equal(releaseProblems([release]).length, 1);
  // the parsers clean first: nothing a source writes reaches the page with a dash or an aside
  assert.equal(changeFromTitle("feat: sign in (Oussama's QA) — faster")?.text, "Sign in: faster.");
});

test("no em dash in the changelog's words, in either language", () => {
  for (const lang of ["en", "fr"])
    assert.deepEqual(textProblems(JSON.stringify(messages(lang).site.changelog)), [], lang);
});

test("the product filter: the address is the state, a paused product is not listed, an unknown value means everything", () => {
  assert.equal(filterOf("verikora"), "verikora");
  // The products' waiting pages link by the commercial name (réunion 6, krizaka-internal#2629): no code name in their address.
  assert.equal(filterOf("verikora"), "verikora");
  assert.equal(filterOf("sovkora"), "sovkora");
  assert.equal(filterOf("folioviv"), "folioviv");
  // An old shared link keeps working: the retired ids (read from the org package) mean the product they became.
  for (const [old, id] of Object.entries(CODE_NAMES)) {
    assert.equal(filterOf(old), FILTER_IDS.includes(id) ? id : undefined, old);
    assert.equal(filterOf(old.toUpperCase()), FILTER_IDS.includes(id) ? id : undefined, old);
  }
  assert.equal(filterOf("nope"), undefined);
  assert.equal(filterOf(null), undefined);
  assert.equal(filterHref("", "verikora"), "?produit=verikora");
  assert.equal(filterHref("?lang=fr&produit=ui", undefined), "?lang=fr");
  assert.equal(filterHref("?produit=ui", undefined), "?");
  assert.deepEqual([...FILTER_IDS], ["sovkora", "verikora", "folioviv", "ui", "java"]);
  const entries = [{ product: "verikora" }, { product: "paused" }, { product: "ui" }];
  assert.equal(visibleEntries(entries, undefined).length, 2);
  assert.deepEqual(visibleEntries(entries, "ui"), [{ product: "ui" }]);
});

test("the page filters through the address and reads both languages", () => {
  assert.match(read("app/[locale]/changelog/page.tsx"), /ChangelogView/);
  assert.match(read("app/components/ChangelogView.tsx"), /useSearchParam\(FILTER_PARAM\)/);
  const generator = read("scripts/gen-changelog.mjs");
  assert.match(generator, /release-repos\.json/);
  assert.match(generator, /releaseProblems/);
});

test("krizaka-com#357: the changelog's row is one size — the filters and the RSS feed are md chips, no larger button beside them", () => {
  const view = read("app/components/ChangelogView.tsx");
  assert.doesNotMatch(view, /size="sm"/);
  assert.equal((view.match(/<ChipLink\b[^>]*size="md"/g) ?? []).length, 2);
  assert.match(view, /type="application\/rss\+xml"/);
  assert.doesNotMatch(read("app/[locale]/changelog/page.tsx"), /feed=\{<ButtonLink/);
});

test("a release's pull requests link the repository's current address, not the name it had when the note was written", () => {
  const changes = [
    { text: "a", pr: { number: 12, url: "https://github.com/krizaka/former-name/pull/12" } },
    { text: "b" },
  ];
  assert.deepEqual(ownPrs(changes, "current-name"), [
    { text: "a", pr: { number: 12, url: "https://github.com/krizaka/current-name/pull/12" } },
    { text: "b" },
  ]);
});

test("a pull request is read from a markdown link or a bare address, and only from a pull request address", () => {
  const pr = { number: 293, url: "https://github.com/krizaka/repo/pull/293" };
  assert.deepEqual(prOf("[#293](https://github.com/krizaka/repo/pull/293) fixes it"), pr);
  assert.deepEqual(prOf("fix: x https://github.com/krizaka/repo/pull/293"), pr);
  assert.equal(prOf("see https://github.com/krizaka/repo/issues/293"), undefined);
  assert.equal(prOf("see https://example.com/krizaka/repo/pull/293"), undefined);
  assert.equal(prOf("no address"), undefined);
  assert.deepEqual(urlsIn('a (https://x.example/a) and "https://y.example/b" c'), [
    "https://x.example/a",
    "https://y.example/b",
  ]);
});

test("the sitemap's date: a route without a page of its own still gets a date, the clock being the caller's", () => {
  const now = new Date("2026-11-06T12:00:00Z");
  assert.ok(lastModified("/no-such-page", now) instanceof Date);
});

/* krizaka-internal#2814: « Sovkora conversation-service 2026.11.04.2 » was wider than the date column and covered the change's
   tag, and it repeated the product its heading already names. The chip says the part and the version; the anchor and the feed
   keep the full label, so no link breaks; the chip may wrap inside its column. */
test("a changelog chip never repeats its entry's heading, and the anchor keeps the full label", async () => {
  const { chipLabel } = await import("../lib/changelog.ts");
  const a = { source: "Sovkora", part: "conversation-service", version: "2026.11.04.2" };
  assert.equal(chipLabel(a), "conversation-service 2026.11.04.2");
  assert.equal(chipLabel({ source: "@krizaka/ui", version: "4.0.0" }), "4.0.0");
  assert.equal(anchorOf(a), "sovkora-conversation-service-2026-11-04-2", "the anchor is unchanged");
  const releases = JSON.parse(readFileSync(new URL("../lib/changelog.json", import.meta.url), "utf8")).releases ?? [];
  for (const r of releases)
    assert.ok(!chipLabel(r).includes(r.source), `${releaseLabel(r)}: the chip repeats « ${r.source} »`);
  const page = readFileSync(new URL("../app/[locale]/changelog/page.tsx", import.meta.url), "utf8");
  assert.match(page, /\{chipLabel\(r\)\}/, "the page draws the chip label");
  assert.match(page, /import "\.\/changelog\.css";/);
  const css = readFileSync(new URL("../app/[locale]/changelog/changelog.css", import.meta.url), "utf8");
  assert.match(
    css,
    /\.kz-tpl-log-when \.kz-fact\s*\{[^}]*max-width:\s*100%[^}]*white-space:\s*normal/s,
    "the chip wraps inside its column",
  );
});
