import { test } from "node:test";
import assert from "node:assert/strict";
import { siteById } from "@krizaka/ui/sites";
import { existsSync, readFileSync } from "node:fs";

// The bar of every Krizaka site (NAV-SYS, 2026-10-14): on www, the centre holds this site's sections only, and every
// other Krizaka site is reached from the family switcher.
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const messages = (lang) => JSON.parse(read(`messages/${lang}.json`));
const nav = read("lib/nav.ts");
const products = [...read("lib/products.ts").matchAll(/\{ id: "(\w+)", name: "\w+",(?: status: "(\w+)",)? devUrl: ([^,]+),/g)].map(([, id, status, devUrl]) => ({ id, status, devUrl }));
const stack = [...read("lib/stack.ts").matchAll(/\{ id: "(\w+)", name: "([^"]+)", url: "([^"]+)"/g)].map(([, id, name, url]) => ({ id, name, url }));

test("the centre of the bar is Products · Open source · Our story, all pages of this site", () => {
  assert.match(nav, /NAV_BAR_LINKS[^=]*= \(\["products", "repos", "story"\] as const\)/);
  assert.match(nav, /\{ href: "\/open-source", icon: "repos", match: \["\/open-source\/"\] \}/, "a building block lights Open source");
});

test("the family: every product on its own site, the stack on its subdomains, and GitHub", () => {
  assert.deepEqual(products.map((p) => p.id), ["orazaka", "orochia", "yasakia", "yororis"]);
  for (const p of products) assert.match(p.devUrl, /^("https:\/\/dev\.[a-z]+\.com"|OROCHIA_APP_URL)$/, p.id);
  assert.deepEqual(stack, [
    { id: "ui", name: "Krizaka UI", url: "https://ui.krizaka.com" },
    { id: "java", name: "Krizaka Java", url: "https://java.krizaka.com" },
  ]);
  // the family's own list is @krizaka/ui's: the site's stack must agree with it
  for (const s of stack) assert.equal(siteById(s.id).url, s.url, `@krizaka/ui/sites: ${s.id}`);
  assert.equal(siteById("krizaka").url, "https://www.krizaka.com");
});

test("the products' statuses: Yasakia is coming soon, Yororis under construction, the others released", () => {
  const status = Object.fromEntries(products.map((p) => [p.id, p.status ?? "released"]));
  assert.deepEqual(status, { orazaka: "released", orochia: "released", yasakia: "upcoming", yororis: "construction" });
});

test("the bar has no Docs entry and no search outside /docs; the footer has no Docs column", () => {
  const bar = read("app/components/TopNavBar.tsx");
  assert.doesNotMatch(bar, /NAV_DOCS_HUB/, "no Docs link in the bar");
  assert.match(bar, /\{docs && \(\s*<Button/, "the search button only under /docs");
  assert.doesNotMatch(read("app/components/SiteFooter.tsx"), /NAV_DOCS|f\.docs/);
  assert.doesNotMatch(read("app/components/MobilePanel.tsx"), /NAV_DOCS/);
});

test("the family is @krizaka/ui's: NavBar.Family in the bar and the panel, SiteFooter in the footer, no copy here", () => {
  const bar = read("app/components/TopNavBar.tsx");
  assert.match(bar, /<NavBar\.Family current="krizaka"/);
  assert.match(bar, /<NavBar\.Repo /);
  assert.match(read("app/components/MobilePanel.tsx"), /<NavBar\.Family current="krizaka"/);
  assert.match(read("app/components/SiteFooter.tsx"), /@krizaka\/ui\/site-footer/);
  assert.ok(!existsSync(new URL("../app/components/FamilySwitcher.tsx", import.meta.url)), "FamilySwitcher came back");
  for (const lang of ["en", "fr"]) assert.equal(messages(lang).site.nav.family, undefined, `${lang}: site.nav.family`);
});
