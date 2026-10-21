import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { misplaced, SITE_AREA_NAMES } from "../scripts/bunny-layout.mjs";

const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const messages = (l) => JSON.parse(read(`messages/${l}.json`));

test("the bar, the mobile panel and the footer link to the blog (a link to another site, absolute)", () => {
  assert.match(read("lib/site.ts"), /BLOG_URL = "https:\/\/blog\.krizaka\.com"/);
  assert.match(read("app/components/TopNavBar.tsx"), /href=\{BLOG_URL\}[^>]*>\{m\.blog\}/);
  assert.match(read("app/components/MobilePanel.tsx"), /href=\{BLOG_URL\}/);
  // The footer's blog link is the family's « Krizaka » column (@krizaka/ui/sites companyLinks), not a column of www's own.
  assert.doesNotMatch(read("app/components/SiteFooter.tsx"), /BLOG_URL|f\.story|f\.contact/);
  for (const l of ["en", "fr"]) {
    const m = messages(l).site;
    assert.ok(m.menu.blog && m.footer.blog, l);
  }
});

test("the home has no blog section any more (two views, 2026-10-17): the blog is reached from the bar, the panel and the footer", () => {
  assert.doesNotMatch(read("app/[locale]/page.tsx"), /LatestPosts/);
  for (const f of ["app/components/home/LatestPosts.tsx", "lib/blog-posts.ts", "lib/blog-feed.ts"]) assert.ok(!existsSync(new URL(`../${f}`, import.meta.url)), `${f} came back`);
  for (const l of ["en", "fr"]) assert.equal(messages(l).site.home.blog, undefined, `${l}: site.home.blog`);
});

test("the blog's images live under site/blog/<post>/ of the Bunny zone", () => {
  assert.ok(SITE_AREA_NAMES.includes("blog"));
  assert.equal(misplaced("site/blog/measured-not-promised/cover.3f2a9c1b7e.webp"), null);
  assert.ok(misplaced("site/blog/cover.png"));
});

