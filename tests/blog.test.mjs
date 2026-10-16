import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { misplaced, SITE_AREA_NAMES } from "../scripts/bunny-layout.mjs";

const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const messages = (l) => JSON.parse(read(`messages/${l}.json`));

test("the bar, the mobile panel and the footer link to the blog (a link to another site, absolute)", () => {
  assert.match(read("lib/site.ts"), /BLOG_URL = "https:\/\/blog\.krizaka\.com"/);
  assert.match(read("app/components/TopNavBar.tsx"), /href=\{BLOG_URL\}[^>]*>\{m\.blog\}/);
  assert.match(read("app/components/MobilePanel.tsx"), /href=\{BLOG_URL\}/);
  assert.match(read("app/components/SiteFooter.tsx"), /href=\{BLOG_URL\}[^>]*>\{f\.blog\}/);
  for (const l of ["en", "fr"]) {
    const m = messages(l).site;
    assert.ok(m.menu.blog && m.footer.blog && m.home.blog.title, l);
  }
});

test("the home reads the blog's feed at build, in a server component (no client fetch)", () => {
  const c = read("app/components/home/LatestPosts.tsx");
  assert.doesNotMatch(c, /"use client"/);
  assert.match(read("app/[locale]/page.tsx"), /<LatestPosts locale=\{locale\} \/>/);
  assert.match(read("lib/blog-posts.ts"), /feed\.xml/);
});

test("the blog's images live under site/blog/<post>/ of the Bunny zone", () => {
  assert.ok(SITE_AREA_NAMES.includes("blog"));
  assert.equal(misplaced("site/blog/measured-not-promised/cover.3f2a9c1b7e.webp"), null);
  assert.ok(misplaced("site/blog/cover.png"));
});

test("parseFeed keeps the newest three posts on the blog's host, in order", async () => {
  const { parseFeed } = await import("../lib/blog-feed.ts");
  const item = (t, d, link = `https://blog.krizaka.com/posts/${t}/`) => `<item><title>${t} &amp; co</title><link>${link}</link><pubDate>${new Date(d).toUTCString()}</pubDate><description>d ${t}</description></item>`;
  const xml = `<rss><channel>${item("a", "2026-10-01")}${item("b", "2026-10-03")}${item("evil", "2026-10-04", "https://evil.example/x")}${item("c", "2026-10-02")}${item("d", "2026-09-01")}</channel></rss>`;
  const posts = parseFeed(xml, "https://blog.krizaka.com");
  assert.deepEqual(posts.map((p) => p.title), ["b & co", "c & co", "a & co"]);
  assert.equal(posts[0].date, "2026-10-03");
  assert.deepEqual(parseFeed("<rss><channel></channel></rss>", "https://blog.krizaka.com"), []);
});
