import { test } from "node:test";
import assert from "node:assert/strict";
import { siteById } from "@krizaka/ui/sites";
import { existsSync, readFileSync } from "node:fs";
import { PRODUCT_RECORDS, constString, records } from "./helpers/source.mjs";

// The bar of every Krizaka site (NAV-SYS, 2026-10-14): on www, the centre holds this site's sections only, and every
// other Krizaka site is reached from the family switcher.
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const messages = (lang) => JSON.parse(read(`messages/${lang}.json`));
const nav = read("lib/nav.ts");
const products = PRODUCT_RECORDS();
const motionSite = constString("lib/stack.ts", "LAB_SITE");
const stack = records("lib/stack.ts", "STACK")
  .filter((p) => p.url)
  .map(({ id, name, url }) => ({ id, name, url: url === "LAB_SITE" ? motionSite : url }));

test("two views (2026-10-17): the mark and the word Krizaka lead home, the centre of the bar is Services then Docs (2026-10-30); Our story is not in the bar", () => {
  assert.match(nav, /NAV_BAR_LINKS[^=]*= \(\["services", "repos"\] as const\)/);
  assert.doesNotMatch(nav, /href: "\/products"/, "no /products page: the products are a section of the home");
  assert.match(nav, /PRODUCTS_ANCHOR = "\/#products"/);
  assert.match(
    nav,
    /\{ href: "\/docs", icon: "repos", match: \["\/open-source\/"\] \}/,
    "a building block lights Docs",
  );
  const bar = read("app/components/SiteBar.tsx");
  assert.match(
    bar,
    /<Link href="\/" aria-label=\{m\.homeAria\}[^>]*>\s*<KrizakaLogo size=\{26\} \/>\s*<span className="kz-site-brand-word">Krizaka<\/span>/,
  );
  for (const l of ["en", "fr"])
    assert.match(messages(l).site.menu.homeAria, /^Krizaka/, `${l}: the accessible name starts with the visible word`);
  // the bar and the mobile panel both read NAV_BAR_LINKS: neither names the story directly
  for (const file of ["app/components/SiteBar.tsx", "app/components/MobilePanel.tsx"]) {
    assert.doesNotMatch(read(file), /"story"|\/story/, `${file}: no story link`);
  }
  // right: GitHub (the blog is in the footer only, 2026-11-01) · · theme · language · Contact us, the one primary action
  assert.doesNotMatch(bar, /BLOG_URL/);
  assert.equal(bar.match(/variant="primary"/g)?.length, 1);
  assert.match(bar, /variant="primary"[^>]*>\s*<Link href=\{contactHref\}>/);
});

test("every link to the products leads to the home's section, never to /products", () => {
  for (const file of [
    "app/components/SiteFooter.tsx",
    "app/components/SearchCommand.tsx",
    "app/[locale]/story/page.tsx",
  ]) {
    assert.doesNotMatch(read(file), /["']\/products["']/, file);
  }
  assert.match(read("app/components/SiteFooter.tsx"), /href=\{to\(PRODUCTS_ANCHOR\)\}/);
  const sitemap = read("app/sitemap.ts");
  assert.doesNotMatch(sitemap, /"\/products"/);
  assert.doesNotMatch(read("lib/page-templates.ts"), /"\/products"/);
  for (const f of ["content/llms.txt", "content/llms-full.txt"]) assert.doesNotMatch(read(f), /\/en\/products/, f);
});

test("the family: every product on its own site, the stack on its subdomains, and GitHub", () => {
  assert.deepEqual(
    products.map((p) => p.id),
    ["orazaka", "yomizaka", "akinaza"],
  );
  // A product is reached at its public address, www.<product>.com — never at its dev host (not indexed, it sends its pages to www).
  for (const p of products) {
    assert.equal(p.siteUrl, `wwwUrl("${p.id}")`, p.id);
  }
  assert.deepEqual(stack, [
    { id: "ui", name: "Krizaka UI", url: "https://ui.krizaka.com" },
    { id: "motion", name: "Krizaka Lab", url: "https://lab.krizaka.com" },
    { id: "java", name: "Krizaka Java", url: "https://java.krizaka.com" },
    { id: "ts", name: "Krizaka TypeScript", url: "https://ts.krizaka.com" },
  ]);
  // the family's own list is @krizaka/ui's: the site's stack must agree with it
  for (const s of stack.filter((x) => siteById(x.id)))
    assert.equal(siteById(s.id).url, s.url, `@krizaka/ui/sites: ${s.id}`);
  assert.equal(siteById("krizaka").url, "https://www.krizaka.com");
});

test("the products' statuses: all three in development (Orazaka left Dev preview on 2026-10-25; the checklists gate it: tests/dev-preview.test.mjs)", () => {
  const status = Object.fromEntries(products.map((p) => [p.id, p.status]));
  assert.deepEqual(status, { orazaka: "development", yomizaka: "development", akinaza: "development" });
});

test("the bar has no Docs entry and no search outside /docs; the footer has no Docs column", () => {
  const bar = read("app/components/SiteBar.tsx");
  assert.doesNotMatch(bar, /NAV_DOCS_HUB/, "no Docs link in the bar");
  assert.match(bar, /\{docs && \(\s*<Button/, "the search button only under /docs");
  assert.doesNotMatch(read("app/components/SiteFooter.tsx"), /NAV_DOCS|f\.docs/);
  assert.doesNotMatch(read("app/components/MobilePanel.tsx"), /NAV_DOCS/);
});

test("no family switcher on www.krizaka.com (it duplicated Products); the footer is @krizaka/ui's SiteFooter, no copy here", () => {
  const bar = read("app/components/SiteBar.tsx");
  assert.doesNotMatch(bar, /NavBar\.Family/);
  assert.match(bar, /<NavBar\.Repo /);
  assert.doesNotMatch(read("app/components/MobilePanel.tsx"), /NavBar\.Family/);
  assert.match(read("app/components/SiteFooter.tsx"), /@krizaka\/ui\/site-footer/);
  assert.ok(!existsSync(new URL("../app/components/FamilySwitcher.tsx", import.meta.url)), "FamilySwitcher came back");
  for (const lang of ["en", "fr"]) assert.equal(messages(lang).site.nav.family, undefined, `${lang}: site.nav.family`);
});
