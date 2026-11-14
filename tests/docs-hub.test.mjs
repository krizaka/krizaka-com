import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { START_PATHS, CONTRIBUTING_URL, hrefIn } from "../lib/docs-start.ts";
import { PRODUCTS } from "../lib/products.ts";
import { uiRedirects } from "../lib/ui-redirects.ts";

// 2026-10-30 (founder): « Services first, then Docs » — the old /open-source page was a page of stats; /docs answers
// « where do I start? » and /open-source answers 308 there.
const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const messages = (l) => JSON.parse(read(`messages/${l}.json`));

test("the bar ends on Docs (served at /docs), after Products and Enterprise; Open source is no entry any more", () => {
  const nav = read("lib/nav.ts");
  assert.match(nav, /NAV_BAR_LINKS[^=]*= \(\["products", "services", "repos"\] as const\)/);
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
    // The products' path has one link per product (Kridoc joined on 2026-11-14), the others 2-3 first pages.
    const most = p.id === "products" ? PRODUCTS.length : 3;
    assert.ok(p.links.length >= 2 && p.links.length <= most, `${p.id}: 2-${most} links`);
    for (const l of p.links) assert.match(l.href, /^https:\/\//, `${p.id}/${l.id}`);
    for (const lang of ["en", "fr"]) {
      const w = messages(lang).site.openSource.hub.paths[p.id];
      assert.ok(w.title && w.text, `${lang} ${p.id}`);
      // A product's link is its own name; every other link has its words.
      for (const l of p.links.filter((x) => !x.name)) assert.ok(w.links[l.id], `${lang} ${p.id}.${l.id}`);
    }
  }
  assert.equal(START_PATHS.find((p) => p.id === "contribute").href, CONTRIBUTING_URL);
});

// Founder, 2026-11-05 (krizaka-internal#2645): « il reste juste cette page à revoir ».
test("the products row lists the products in the home's order, each with its status in words, to its public page", () => {
  const row = START_PATHS.find((p) => p.id === "products");
  assert.deepEqual(
    row.links.map((l) => l.name),
    ["Sovkora", "Verikora", "Folioviv", "Kridoc"],
  );
  for (const l of row.links) {
    assert.match(l.href, /^https:\/\/www\.(verikora|sovkora|folioviv|kridoc)\.com/, l.name);
    assert.ok(l.status, `${l.name}: a status`);
  }
  // The status is the home's word for it (site.nav.status), written as a note after the name.
  assert.match(read("app/[locale]/docs/page.tsx"), /note: l\.status \? site\.nav\.status\[l\.status\]\.label/);
  for (const lang of ["en", "fr"])
    assert.equal(messages(lang).site.openSource.hub.paths.products.links, undefined, lang);
});

test("a path's address is in the reader's language: the home's anchor gets the locale, a site's address is unchanged", () => {
  assert.equal(hrefIn("/#products", "fr"), "/fr#products");
  assert.equal(hrefIn("/#products", "en"), "/en#products");
  assert.equal(hrefIn("https://ui.krizaka.com", "fr"), "https://ui.krizaka.com");
});

// Founder, 2026-11-06 (krizaka-internal#2799): « simplifie le design de doc aussi, quelque chose d'autre que des cards ».
test("the hub is the notebook's sommaire, not cards: one row per path, its § in the margin, plain links", () => {
  const page = read("app/[locale]/docs/page.tsx");
  assert.doesNotMatch(
    page,
    /<(DocsHubPage|CardGrid|LinkCard|ChipLink|ChipRow)\b|ui\/docs-hub-page|collections=/,
    "no card grid, no pills",
  );
  assert.match(page, /<ContentsIndex[\s\S]*entries=\{START_PATHS\.map\(/, "the paths are the sommaire's entries");
  assert.match(page, /number: format\(h\.number, \{ n: i \+ 1 \}\)/, "the § numbers follow the order, never typed");
  assert.match(
    page,
    /<PageHero eyebrow=\{h\.eyebrow\} title=\{h\.title\} lead=\{h\.lead\} \/>/,
    "the hero is PageHero's own",
  );
  for (const lang of ["en", "fr"]) {
    const h = messages(lang).site.openSource.hub;
    assert.equal(h.number, "§ {n}", lang);
    for (const p of START_PATHS) assert.ok(h.paths[p.id].text.length <= 90, `${lang} ${p.id}: one short line`);
  }
  const component = read("app/components/lists/ContentsIndex.tsx");
  assert.match(component, /data-paper="lines"/, "on the Seyès lines of @krizaka/ui");
  assert.match(component, /data-margin=""/, "the red margin of @krizaka/ui");
  const css = read("app/components/lists/lists.css");
  const block = css.slice(css.indexOf("/* ---- ContentsIndex ---- */"));
  assert.ok(block.length > 30, "the sommaire's styles");
  assert.doesNotMatch(
    block,
    /border(-[a-z]+)*:|box-shadow|border-radius|background(-color)?:/,
    "type and spacing, no box",
  );
  assert.match(block, /grid-template-columns: var\(--kz-margin-x\) minmax\(0, 1fr\)/, "one column beside the margin");
  // The card grid's frame fix and the hero's un-centring are gone with the cards.
  const os = read("app/[locale]/docs/open-source.css");
  assert.doesNotMatch(os, /kz-tpl-collections|kz-hero\[data-align="center"\]/);
});

test("CI reads the hub in a real browser: the sommaire, its links, no box, no overflow at the founder's widths", () => {
  const smoke = read("scripts/ci-container-smoke.sh");
  assert.match(smoke, /node --experimental-strip-types scripts\/check-docs-hub\.mjs --base http:\/\/localhost:3000/);
});
