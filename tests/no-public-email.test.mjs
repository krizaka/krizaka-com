// The founder's rule (2026-11-06): no Krizaka e-mail address on any public page. « Contact » is the contact form, which carries the
// kind (support, business, other) and the product. One written exception here: the privacy officer's line (Quebec Law 25).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const ADDRESS = /[A-Za-z0-9._+-]+@(?:[a-z0-9-]+\.)*(?:krizaka|verikora|folioviv|sovkora|kridoc)\.com/g;
const PRIVACY_OFFICER = "confidentialite@krizaka.com";

test("the messages show no address but the privacy officer's", () => {
  for (const l of ["en", "fr"]) {
    const found = read(`messages/${l}.json`).match(ADDRESS) ?? [];
    assert.deepEqual([...new Set(found)], [PRIVACY_OFFICER], l);
  }
});

test("the machine-read surfaces show no address: llms files, JSON-LD", () => {
  for (const f of ["content/llms.txt", "content/llms-full.txt"]) assert.deepEqual(read(f).match(ADDRESS) ?? [], [], f);
  const ld = read("lib/structured-data.ts");
  assert.doesNotMatch(ld, /\bemail:/, "the Organization node carries no e-mail");
  assert.deepEqual(ld.match(ADDRESS) ?? [], []);
});

test("the site keeps no contact address constant and no page links a mailto:", () => {
  assert.doesNotMatch(read("lib/site.ts"), /CONTACT_EMAIL/);
  for (const f of ["app/components/SiteFooter.tsx", "app/components/SiteBar.tsx", "app/components/ContactForm.tsx"])
    assert.doesNotMatch(read(f), /mailto:/, f);
});
