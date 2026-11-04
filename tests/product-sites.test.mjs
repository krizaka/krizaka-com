import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { siteHostOf, siteUrlOf, PRODUCT_IDS } from "../lib/product-hosts.ts";
import { hasCode } from "./helpers/source.mjs";

// Founder, 2026-11-04 (krizaka-internal#2373): the products' public addresses are their commercial www domains, which show a
// « coming soon » page until each product opens there. A coming-soon page runs no app: the card reads no version from it.
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");

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

test("the card says « Coming soon » for the site and reads no version (no healthz at build)", () => {
  const showcase = "app/components/home/ProductShowcase.tsx";
  assert.ok(hasCode(showcase, "s.comingSoon"));
  assert.ok(!read(showcase).includes("devVersion"));
  for (const gone of ["lib/dev-versions.ts", "scripts/gen-dev-versions.mjs", "scripts/dev-versions-lib.mjs"])
    assert.ok(!existsSync(new URL(`../${gone}`, import.meta.url)), gone);
  const scripts = JSON.parse(read("package.json")).scripts;
  for (const s of ["dev", "build"]) assert.doesNotMatch(scripts[s], /gen-dev-versions/);
  assert.equal(JSON.parse(read("messages/fr.json")).site.home.products.comingSoon, "Arrive bientôt");
  assert.equal(JSON.parse(read("messages/en.json")).site.home.products.comingSoon, "Coming soon");
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
