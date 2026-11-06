import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// The story lives in the footer's « Krizaka » column — the family's (@krizaka/ui 3.39, krizaka-ui#438, one calm band):
// our story, the blog and contact, in the reader's language. www no longer repeats them in a column of its own.
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const messages = (lang) => JSON.parse(read(`messages/${lang}.json`));
const footer = read("app/components/SiteFooter.tsx");

// The footer as the admin configures it (founder, 2026-11-01): lib/footer.ts in the settings shape of the apps
// (@krizaka/ui FooterSettings), valid by the same rules the admin form applies; three columns, the company named once.
test("the footer's settings pass the admin's validation: products, open source, Krizaka, then the legal line", async () => {
  const { footerSettingsProblems } = await import("@krizaka/ui/site-footer");
  const { footerSettings } = await import("../lib/footer.ts");
  assert.deepEqual(footerSettingsProblems(footerSettings), []);
  assert.deepEqual(
    footerSettings.columns.map((c) => c.id),
    ["products", "open-source", "company"],
  );
  // The legal identity, once: the registered name and the NEQ, as the law asks (lib/site.ts COMPANY), never an address.
  assert.equal(footerSettings.legal.legalName, "Technologies Krizaka Inc.");
  assert.match(footerSettings.legal.neq, /^\d{10}$/);
  // Products by their commercial name (@krizaka/org displayName), on their www address, never a dev host.
  const products = footerSettings.columns[0];
  assert.equal(products.status, undefined, "the products differ (one is paused): no single status on the heading");
  for (const l of products.links) assert.match(l.href, /^https:\/\/www\./);
});

test("every message key of the footer's settings exists in both languages, the company is named once", () => {
  const keys = [...read("lib/footer.ts").matchAll(/(?:labelKey|titleKey): "([\w.]+)"/g)].map((m) => m[1]);
  assert.ok(keys.length >= 8);
  for (const l of ["en", "fr"]) {
    const m = messages(l);
    for (const key of keys) assert.equal(typeof key.split(".").reduce((n, p) => n?.[p], m), "string", `${l}: ${key}`);
    // No « A Technologies Krizaka company » line beside the legal identity: the company is named once.
    assert.equal(m.site.footer.signature, undefined, `${l}: site.footer.signature`);
    assert.equal(m.site.footer.company, undefined, `${l}: site.footer.company`);
  }
  assert.doesNotMatch(footer, /signature|org\.footer\.line|COMPANY/);
});

test("the footer's story label exists in both languages", () => {
  assert.equal(messages("en").site.footer.story, "Our story");
  assert.ok(messages("fr").site.footer.story, "fr: site.footer.story");
});

// One footer, one contentinfo: the locale layout renders it once, outside every page's <main>; no page, template or
// component renders a second one (a footer inside <main> is not a landmark, and a page footer under the layout's doubles it).
import { readdirSync, statSync } from "node:fs";

const walk = (dir) =>
  readdirSync(new URL(`../${dir}/`, import.meta.url)).flatMap((name) => {
    const rel = `${dir}/${name}`;
    return statSync(new URL(`../${rel}`, import.meta.url)).isDirectory() ? walk(rel) : [rel];
  });

test("the locale layout renders the footer once, after the page and outside any <main>", () => {
  const layout = read("app/[locale]/layout.tsx");
  assert.equal(layout.match(/<SiteFooter \/>/g)?.length, 1);
  assert.ok(layout.indexOf("{children}") < layout.indexOf("<SiteFooter />"));
  assert.doesNotMatch(layout, /<main/);
});

test("no page renders a footer of its own", () => {
  const offenders = walk("app")
    .filter(
      (file) => /\.tsx$/.test(file) && file !== "app/components/SiteFooter.tsx" && file !== "app/[locale]/layout.tsx",
    )
    .filter((file) => /<SiteFooter\b|<FamilyFooter\b|<footer\b/.test(read(file)));
  assert.deepEqual(offenders, []);
});

// One SiteFooter, the « site » variant, drawn from the settings (never columns typed in the component).
test("the footer is @krizaka/ui's one SiteFooter, the site variant, drawn from lib/footer.ts", () => {
  assert.match(footer, /variant="site"/);
  assert.equal(footer.match(/<FamilyFooter(?=[\s>])/g)?.length, 1);
  assert.match(footer, /config=\{config\}/);
  assert.doesNotMatch(footer, /<FamilyFooter\.Column/);
});

// check-arrival.mjs clicks every internal footer link and waits for its path: a link whose address answers 308 never
// arrives (com#561: « All of open source » pointed at /open-source, which goes to /docs).
test("no internal footer link is the source of a redirect", async () => {
  const { footerSettings } = await import("../lib/footer.ts");
  const { uiRedirects } = await import("../lib/ui-redirects.ts");
  const sources = new Set(uiRedirects().map((r) => r.source.replace(":locale(en)?", "en")));
  const internal = footerSettings.columns
    .flatMap((c) => c.links)
    .filter((l) => !l.external)
    .map((l) => l.href);
  internal.push(
    ...[footerSettings.legal.links ?? []]
      .flat()
      .map((l) => l.href)
      .filter((h) => h?.startsWith("/")),
  );
  assert.ok(internal.includes("/docs"));
  for (const href of internal) assert.ok(!sources.has(`/en${href}`) && !sources.has(`/fr${href}`), `${href} redirects`);
});

// Krizaka's Instagram (founder, 2026-11-06, krizaka-internal#365): the footer's last line shows the accounts the settings
// choose by id; the address is @krizaka/org's (`org.links.social`), never typed in this site.
test("the footer shows Instagram on its last line, the address read from @krizaka/org", async () => {
  const { resolveFooterSettings } = await import("@krizaka/ui/site-footer");
  const { org } = await import("@krizaka/org");
  const { footerSettings } = await import("../lib/footer.ts");
  assert.deepEqual(footerSettings.social, ["instagram"]);
  const config = resolveFooterSettings(footerSettings, (key) => key, org.links.social);
  assert.deepEqual(config.social, [
    { id: "instagram", label: "Instagram", href: "https://www.instagram.com/krizakahq/" },
  ]);
  assert.match(footer, /org\.links\.social/);
  assert.doesNotMatch(read("lib/footer.ts"), /instagram\.com|No social link yet/);
});
