import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// The answer pages (search plan 2026-10): two guides that answer what people search — on-premise AI in Montréal, and AI
// under Québec's Law 25 — in the words of what really runs. Words are messages (EN/FR); structure is lib/guides.ts.
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const messages = (lang) => JSON.parse(read(`messages/${lang}.json`));
const SLUGS = ["on-premise-ai-montreal", "law-25-ai"];

test("lib/guides.ts lists the two guides, each sitting on a published product", () => {
  const guides = read("lib/guides.ts");
  for (const slug of SLUGS) assert.ok(guides.includes(`"${slug}"`), slug);
});

for (const lang of ["en", "fr"]) {
  test(`${lang}: each guide has a search-sized title and description, 3+ sections, 3+ questions and a call`, () => {
    const g = messages(lang).site.guides;
    for (const slug of SLUGS) {
      const p = g.pages[slug];
      assert.ok(p, slug);
      assert.ok(p.metaTitle.length <= 70, `${lang}/${slug} title is ${p.metaTitle.length} long`);
      assert.ok(p.metaDescription.length >= 90 && p.metaDescription.length <= 165, `${lang}/${slug} description is ${p.metaDescription.length} long`);
      assert.ok(p.sections.length >= 3, `${slug} sections`);
      assert.ok(p.faq.length >= 3, `${slug} faq`);
      for (const s of p.sections) assert.ok(s.id && s.title && s.body.length >= 1, `${slug}/${s.id}`);
      assert.ok(p.cta.title && p.cta.action, `${slug} cta`);
    }
  });

  test(`${lang}: the guides claim no legal conformity and no pack that does not exist`, () => {
    const text = JSON.stringify(messages(lang).site.guides);
    assert.doesNotMatch(text, /compliant|conforme à la loi|garanti[st]? la conformité|guarantee[sd]? compliance/i);
    assert.doesNotMatch(text, /d[ée]centrali[sz]/i);
  });
}

test("the Law 25 guide says plainly what the law still asks of the reader and that no Law 25 pack exists", () => {
  const p = messages("en").site.guides.pages["law-25-ai"];
  const text = JSON.stringify(p);
  assert.match(text, /no Law 25 pack/i);
  assert.match(text, /privacy impact assessment/i);
  assert.match(text, /not legal advice/i);
});

test("the guides are routed, templated, in the sitemap, the footer and llms.txt", () => {
  assert.match(read("lib/page-templates.ts"), /"\/guides\/\[slug\]": "longform"/);
  assert.match(read("app/sitemap.ts"), /GUIDES\.map/);
  assert.match(read("app/components/SiteFooter.tsx"), /GUIDES\.map/);
  const llms = read("content/llms.txt");
  for (const slug of SLUGS) assert.ok(llms.includes(`/en/guides/${slug}`), `llms.txt links ${slug}`);
  assert.match(read("app/[locale]/guides/[slug]/page.tsx"), /generateStaticParams/);
  assert.match(read("app/[locale]/guides/[slug]/page.tsx"), /buildFaqJsonLd/);
});

test("llms-full.txt and the Organization claim no Law 25 conformity by architecture", () => {
  assert.doesNotMatch(read("content/llms-full.txt"), /by architecture/i);
  assert.doesNotMatch(read("lib/structured-data.ts"), /GDPR compliance/);
});
