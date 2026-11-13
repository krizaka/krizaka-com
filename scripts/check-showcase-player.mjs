#!/usr/bin/env node
/* The home mounts no video before the visitor asks (krizaka-internal#3243; was the carousels' smoke test, retired with them).
     node scripts/check-showcase-player.mjs --base http://localhost:3000 [--browser chromium|webkit|firefox]
   A real browser, motion allowed, the page loaded then scrolled to its end, in French and English, on a phone and a desktop:
   - no <video> element, no carousel, no sound control, no pause control;
   - no video file requested (the network sees none).
   Exits 1 with one line per problem. */

import { baseFromArgv, report } from "./site-pages.mjs";
import { emptySnapshot, homeMediaProblems } from "./home-media-lib.mjs";

const SIZES = [
  { width: 360, height: 800 },
  { width: 1440, height: 900 },
];
const LOCALES = ["fr", "en"];
// @fixed: how long the page settles after its last scroll, long enough for any timer or lazy mount to show itself.
const SETTLE_MS = 2500;

/** The home's media, after the page is loaded and scrolled to its end. */
async function snapshotOf(page, base, locale) {
  const snapshot = emptySnapshot();
  page.on("request", (r) => {
    if (r.resourceType() === "media" || /\.(mp4|webm|m4v|mov)(\?|$)/i.test(r.url())) {
      snapshot.mediaRequests.push(r.url());
    }
  });
  await page.goto(`${base}/${locale}`, { waitUntil: "load", timeout: 60_000 });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight / 2) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForTimeout(SETTLE_MS);
  const dom = await page.evaluate(() => ({
    videos: document.querySelectorAll("video").length,
    carousels: document.querySelectorAll('[aria-roledescription="carousel"], section[aria-roledescription]').length,
    soundControls: [...document.querySelectorAll("button")].filter((b) =>
      /^(sound|son|mute|unmute|couper le son|activer le son)\b/i.test(
        b.getAttribute("aria-label") ?? b.textContent ?? "",
      ),
    ).length,
    pauseControls: [...document.querySelectorAll("button")].filter((b) =>
      /^(pause|play|lecture|mettre en pause|arr[eê]ter|stop the|turn the)\b/i.test(b.getAttribute("aria-label") ?? ""),
    ).length,
  }));
  return { ...snapshot, ...dom };
}

const engine = process.argv.includes("--browser") ? process.argv[process.argv.indexOf("--browser") + 1] : "chromium";
const base = baseFromArgv();
const pw = await import("playwright");
const browser = await pw[engine].launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
const cases = SIZES.flatMap((viewport) => LOCALES.map((locale) => ({ viewport, locale })));
const problems = [];
try {
  for (const { viewport, locale } of cases) {
    const context = await browser.newContext({ reducedMotion: "no-preference", viewport });
    await context.addInitScript(() => sessionStorage.setItem("kz-intro", "done"));
    const page = await context.newPage();
    problems.push(
      ...homeMediaProblems(await snapshotOf(page, base, locale), `${engine} /${locale} ${viewport.width}px`),
    );
    await context.close();
  }
} finally {
  await browser.close();
}
report(
  problems,
  `${engine}: the home mounts no video, no carousel, no sound or pause control, and requests no video file (fr and en, 360 and 1440 px)`,
);
