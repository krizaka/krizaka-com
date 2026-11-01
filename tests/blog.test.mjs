import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { misplaced, SITE_AREA_NAMES } from "../scripts/bunny-layout.mjs";

const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const messages = (l) => JSON.parse(read(`messages/${l}.json`));

test("only the footer links to the blog (founder, 2026-11-01): not the bar, not the mobile panel", () => {
  assert.match(read("lib/site.ts"), /BLOG_URL = "https:\/\/blog\.krizaka\.com"/);
  for (const f of ["app/components/SiteBar.tsx", "app/components/MobilePanel.tsx", "lib/nav.ts"])
    assert.doesNotMatch(read(f).replace(/\/\*[\s\S]*?\*\//g, ""), /BLOG_URL|m\.blog|menu\.blog/, f);
  // The footer's blog link is its « Krizaka » column, in the footer's settings (lib/footer.ts), never in the component.
  assert.doesNotMatch(read("app/components/SiteFooter.tsx"), /BLOG_URL|f\.story|f\.contact/);
  assert.match(read("lib/footer.ts"), /href: BLOG_URL/);
  for (const l of ["en", "fr"]) {
    const m = messages(l).site;
    assert.equal(m.menu.blog, undefined, `${l}: menu.blog`);
    assert.ok(m.footer.blog, l);
  }
});

test("the home has no blog section any more (two views, 2026-10-17): the blog is reached from the bar, the panel and the footer", () => {
  assert.doesNotMatch(read("app/[locale]/page.tsx"), /LatestPosts/);
  for (const f of ["app/components/home/LatestPosts.tsx", "lib/blog-posts.ts", "lib/blog-feed.ts"])
    assert.ok(!existsSync(new URL(`../${f}`, import.meta.url)), `${f} came back`);
  for (const l of ["en", "fr"]) assert.equal(messages(l).site.home.blog, undefined, `${l}: site.home.blog`);
});

test("the blog's images live under site/blog/<post>/ of the Bunny zone", () => {
  assert.ok(SITE_AREA_NAMES.includes("blog"));
  assert.equal(misplaced("site/blog/measured-not-promised/cover.3f2a9c1b7e.webp"), null);
  assert.ok(misplaced("site/blog/cover.png"));
});
