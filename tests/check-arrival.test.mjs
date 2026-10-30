import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { PAGES, VIEWPORTS, arrivalProblems, footerProblems } from "../scripts/arrival-lib.mjs";

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");

// Peer review of /story (2026-10-21): « from the footer, Our story doesn't go to the top, so they don't know they're on
// the page ». Root cause: the footer's links were unprefixed (/story), answered by a 307 from proxy.ts, and Next.js skips
// its scroll-to-top for a navigation that went through a redirect. check-arrival.mjs clicks every footer link in a real
// browser; the judgement is pure and tested here.
const c = { vp: "desktop", from: "/en", label: "Our story", href: "/en/story" };
const landed = {
  scrollY: 0,
  h1: "One studio.",
  h1Visible: true,
  h1Focused: true,
  focus: "h1",
  hasFooterLink: true,
  current: "page",
};

test("an arrival at the top, heading in view and focused, footer link current, passes", () => {
  assert.deepEqual(arrivalProblems(c, landed), []);
});

test("the bug of 2026-10-21 fails: landing mid-page with the heading out of view", () => {
  const lines = arrivalProblems(c, {
    ...landed,
    scrollY: 4890,
    h1Visible: false,
    h1Focused: false,
    focus: "a",
    current: null,
  });
  assert.equal(lines.length, 4);
  assert.match(lines.join("\n"), /lands at scrollY 4890/);
  assert.match(lines.join("\n"), /h1 is not in view/);
  assert.match(lines.join("\n"), /focus is not on the h1/);
  assert.match(lines.join("\n"), /aria-current="page"/);
});

test("a link to an anchor lands on its section, not at the top", () => {
  const a = { ...c, href: "/en#products" };
  assert.deepEqual(arrivalProblems(a, { scrollY: 900, targetInView: true }), []);
  assert.match(arrivalProblems(a, { scrollY: 0, targetInView: false })[0], /section #products is not in view/);
});

test("a click that never arrives is a failure, not a pass", () => {
  assert.match(arrivalProblems(c, { error: "Timeout" })[0], /Timeout/);
});

test("one footer landmark per page; two or none fail", () => {
  assert.deepEqual(footerProblems("/en/story", { contentinfo: 1, footer: 1 }), []);
  assert.match(footerProblems("/en/story", { contentinfo: 2, footer: 2 }).join("\n"), /2 contentinfo/);
  assert.match(footerProblems("/en/story", { contentinfo: 0, footer: 1 })[0], /0 contentinfo/);
  assert.ok(PAGES.includes("/en/story") && PAGES.includes("/fr/story") && VIEWPORTS.length === 2);
});

test("the footer's internal links carry the locale, and its own page is aria-current", () => {
  const footer = read("app/components/SiteFooter.tsx");
  assert.match(footer, /const to = \(path: string\) => `\/\$\{locale\}/);
  // The story, the blog and contact are the family's « Krizaka » column now (@krizaka/ui 3.39, one-band footer): not here.
  for (const href of [
    'to("/open-source")',
    'to("/changelog")',
    'to("/privacy")',
    'to("/terms")',
    "to(PRODUCTS_ANCHOR)",
  ]) {
    assert.ok(footer.includes(`href={${href}}`), `${href} is prefixed`);
  }
  assert.doesNotMatch(footer, /<Link href="\//, "no unprefixed footer link: it would go through proxy.ts's 307");
  // the version links off-site (its GitHub release, #389): the four pages of the site are aria-current
  assert.equal(footer.match(/aria-current=\{here\(/g).length >= 4, true);
});

test("the locale layout mounts RouteArrival: scroll to 0 and focus on the h1, when the page (not the language, not an anchor) changes", () => {
  const layout = read("app/[locale]/layout.tsx");
  assert.match(layout, /<RouteArrival \/>/);
  const arrival = read("app/components/RouteArrival.tsx");
  assert.match(arrival, /window\.scrollTo\(0, 0\)/);
  assert.match(arrival, /heading\.focus\(\{ preventScroll: true \}\)/);
  assert.match(arrival, /window\.location\.hash/);
  assert.match(arrival, /withoutLocale\(before\) === withoutLocale\(pathname\)/);
});

// One footer, one contentinfo (rule « one SiteFooter, no double footer »): /story closes with its one primary action,
// then the layout's SiteFooter — no second call-to-action band and no footer of its own.
test("/story ends on one primary action, then the SiteFooter of the layout", () => {
  const page = read("app/[locale]/story/page.tsx");
  const next = page.slice(page.indexOf('id="next"'));
  assert.equal(next.match(/<ButtonLink/g).length, 1, "the closing chapter has one action");
  assert.match(next, /<ButtonLink href=\{contactHref\("story"\)\} variant="primary"/);
  assert.doesNotMatch(page, /<SiteFooter|<footer|FamilyFooter/);
  for (const l of ["en", "fr"])
    assert.equal(
      JSON.parse(read(`messages/${l}.json`)).site.story.next.ctaProducts,
      undefined,
      `${l}: no orphan message`,
    );
});

test("no page renders a footer of its own, whatever its folder", () => {
  const walk = (dir) =>
    readdirSync(new URL(`../${dir}/`, import.meta.url)).flatMap((name) => {
      const rel = `${dir}/${name}`;
      return statSync(new URL(`../${rel}`, import.meta.url)).isDirectory() ? walk(rel) : [rel];
    });
  const offenders = walk("app").filter(
    (f) =>
      f.endsWith(".tsx") &&
      !["app/components/SiteFooter.tsx", "app/[locale]/layout.tsx"].includes(f) &&
      /<footer\b|<SiteFooter\b/.test(read(f)),
  );
  assert.deepEqual(offenders, []);
});

test("CI runs the arrival check against the container", () => {
  // The pipeline is the org's node-ci.yml; the container job runs this repository's smoke script against the image.
  assert.match(read(".github/workflows/ci.yml"), /container-smoke: scripts\/ci-container-smoke\.sh/);
  assert.match(
    read("scripts/ci-container-smoke.sh"),
    /node scripts\/check-arrival\.mjs --base http:\/\/localhost:3000/,
  );
});
