import { test } from "node:test";
import assert from "node:assert/strict";
import { findCodeNames } from "@krizaka/org";
import { existsSync, readFileSync } from "node:fs";
import { siteHostOf, siteUrlOf, PRODUCT_IDS } from "../lib/product-hosts.ts";
import { cssDecls, strings } from "./helpers/source.mjs";
import { PRODUCTS } from "../lib/products.ts";

// Founder, 2026-11-04 (krizaka-internal#2373): the products' public addresses are their commercial www domains, which show a
// « coming soon » page until each product opens there. A coming-soon page runs no app: the card reads no version from it.
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");

test("lib/retired-product-ids.json equals the org package's historic table, for the presented products", async () => {
  const { retiredProductIds } = await import("../scripts/gen-product-sites.mjs");
  assert.deepEqual(JSON.parse(read("lib/retired-product-ids.json")), retiredProductIds());
  assert.deepEqual(Object.values(retiredProductIds()).sort(), ["folioviv", "sovkora", "verikora"]);
});

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
      ["sovkora", "https://www.sovkora.com", "www.sovkora.com"],
      ["verikora", "https://www.verikora.com", "www.verikora.com"],
      ["folioviv", "https://www.folioviv.com", "www.folioviv.com"],
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

// The tag's foot styles its links as ink (@krizaka/ui blocks.css `.kz-tag-foot a { color: inherit }`, unlayered), which beat the
// Button's `text-on-accent`: the « See the site » label drew the tag's ink on the brand fill, under 4.5:1 on Sovkora's orange
// (ci / Container image, a11y color-contrast, #606). The action wears `kz-tag-action`, whose colours are the Button's again.
test("the card's action keeps the Button's colours inside the tag's foot (contrast on every brand fill)", () => {
  const foot = read("app/components/home/ProductShowcase.tsx");
  const action = foot.slice(foot.indexOf("<ButtonLink"), foot.indexOf("</ButtonLink>"));
  assert.match(action, /className="kz-tag-action"/, "the action carries its class");
  const decls = cssDecls("app/components/home/home.css", ".kz-tag-foot a.kz-tag-action");
  assert.equal(decls.color, "var(--kz-on-accent)", "the label is the Button's on-accent colour");
  assert.equal(decls["text-decoration"], "none", "a button is not underlined like the quiet links");
});

test("no page, message or llms file links a development host (dev.<name>.com) or a retired code-name host of a product", () => {
  const files = [
    "messages/en.json",
    "messages/fr.json",
    "content/llms.txt",
    "content/llms-full.txt",
    "lib/products.ts",
  ];
  for (const f of files) {
    assert.doesNotMatch(read(f), /dev\.(?:sovkora|verikora|folioviv)\.com/, f);
    assert.deepEqual(findCodeNames(read(f)), [], f);
  }
});
