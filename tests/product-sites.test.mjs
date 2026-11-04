import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { siteHostOf, siteUrlOf, PRODUCT_IDS } from "../lib/product-hosts.ts";
import { strings } from "./helpers/source.mjs";
import { latestRelease } from "../lib/latest-release.ts";
import { PRODUCTS } from "../lib/products.ts";

// Founder, 2026-11-04 (krizaka-internal#2373): the products' public addresses are their commercial www domains, which show a
// « coming soon » page until each product opens there. A coming-soon page runs no app: the card reads no version from it.
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");

test("lib/product-sites.json equals @krizaka/org (run scripts/gen-product-sites.mjs when the package changes)", async () => {
  const { productSites } = await import("../scripts/gen-product-sites.mjs");
  assert.deepEqual(JSON.parse(read("lib/product-sites.json")), productSites());
  assert.doesNotMatch(
    read("lib/product-hosts.ts"),
    /from "@krizaka\/org"/,
    "next.config.ts loads it: no ESM-only import",
  );
});

test("each product's public address is its commercial www domain, from @krizaka/org", () => {
  assert.deepEqual(
    PRODUCT_IDS.map((id) => [id, siteUrlOf(id), siteHostOf(id)]),
    [
      ["orazaka", "https://www.sovkora.com", "www.sovkora.com"],
      ["yomizaka", "https://www.verikora.com", "www.verikora.com"],
      ["akinaza", "https://www.folioviv.com", "www.folioviv.com"],
    ],
  );
});

test("the card reads no version from a product's host (no healthz at build): the generator is gone", () => {
  const showcase = "app/components/home/ProductShowcase.tsx";
  assert.ok(!read(showcase).includes("devVersion"));
  for (const gone of ["lib/dev-versions.ts", "scripts/gen-dev-versions.mjs", "scripts/dev-versions-lib.mjs"])
    assert.ok(!existsSync(new URL(`../${gone}`, import.meta.url)), gone);
  const scripts = JSON.parse(read("package.json")).scripts;
  for (const s of ["dev", "build"]) assert.doesNotMatch(scripts[s], /gen-dev-versions/);
});

test("the latest release comes from the changelog data: the newest of the product, none when it has none", () => {
  const r = (product, version, date) => ({ product, version, date });
  const releases = [
    r("yomizaka", "2026.11.03.7", "2026-11-03"),
    r("yomizaka", "2026.11.03.10", "2026-11-03"),
    r("yomizaka", "2026.11.02.1", "2026-11-02"),
    r("orazaka", "2026.11.04.1", "2026-11-04"),
  ];
  assert.deepEqual(latestRelease("yomizaka", releases), { version: "2026.11.03.10", date: "2026-11-03" });
  assert.equal(latestRelease("akinaza", releases), undefined);
  const showcase = read("app/components/home/ProductShowcase.tsx");
  assert.match(showcase, /latestRelease\(p\.id, RELEASES\)/, "the card reads it from the build's changelog data");
  assert.doesNotMatch(
    strings("app/components/home/ProductShowcase.tsx").join("\n"),
    /\d{4}\.\d{2}\.\d{2}\.\d+/,
    "no version typed",
  );
});

test("a product card: the name is plain text, one link per destination, each accessible name unique and naming the product", () => {
  const showcase = read("app/components/home/ProductShowcase.tsx");
  const tag = showcase.slice(showcase.indexOf("function tagProps"), showcase.indexOf("function EngineEntry"));
  assert.match(
    tag,
    /title: <span className="kz-entry-name">\{p\.name\}<\/span>/,
    "the name is no second link to the site",
  );
  const foot = showcase.slice(showcase.indexOf("function Foot"), showcase.indexOf("function tagProps"));
  const destinations = ["href={p.siteUrl}", "href={p.repoUrl}", "href={`/${locale}/changelog?produit=${p.id}`}"];
  for (const d of destinations) assert.equal(foot.split(d).length - 1, 1, d);
  assert.equal((foot.match(/href=/g) ?? []).length, destinations.length, "no other link on the card's foot");
  assert.equal((foot.match(/<ButtonLink\b/g) ?? []).length, 1, "one primary action");
  for (const lang of ["fr", "en"]) {
    const m = JSON.parse(read(`messages/${lang}.json`)).site.products;
    const labels = PRODUCTS.flatMap((p) =>
      ["visitSiteAria", "sourceAria", "releaseNotesAria"].map((k) => m[k].replace("{name}", p.name)),
    );
    assert.equal(new Set(labels).size, labels.length, `${lang}: unique accessible names`);
    assert.match(m.visitSiteAria, lang === "fr" ? /nouvel onglet/ : /new tab/);
  }
  assert.equal(JSON.parse(read("messages/fr.json")).site.products.releaseNotes, "Journal des versions");
  assert.equal(JSON.parse(read("messages/en.json")).site.products.releaseNotes, "Release notes");
});

test("no page, message or llms file links a code-name host of a product (www.<code>.com, dev.<code>.com)", () => {
  const files = [
    "messages/en.json",
    "messages/fr.json",
    "content/llms.txt",
    "content/llms-full.txt",
    "lib/products.ts",
  ];
  for (const f of files) assert.doesNotMatch(read(f), /(?:www|dev)\.(?:orazaka|yomizaka|akinaza)\.com/, f);
});
