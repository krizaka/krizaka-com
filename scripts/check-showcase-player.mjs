#!/usr/bin/env node
/* The home's carousels play their films in a real browser (krizaka-internal#2837): the rules are pure and unit-tested
   (lib/showcase-player.ts); this reads them on the running site, with the real files from the CDN.
     node scripts/check-showcase-player.mjs --base http://localhost:3000 [--browser chromium|webkit|firefox]
   - The hero opens on the Sovkora trailer: its poster first, then the clip muted, inline, never looping, playing by itself;
     a phone gets the 720p cut, a wide screen the full cut (chosen on the client: `<source media>` is ignored by Chrome and
     Firefox before 120).
   - Its end moves the carousel on (the clip is sought to its last second): no last frame held.
   - Sound only after a click on the « Sound » control (aria-pressed), and off again when the hero leaves the screen.
   - Under reduced motion: no clip, the poster and a play button; the button plays the film, still muted.
   - Sovkora's carousel opens on the trailer too, and mounts no clip before it is on screen.
   Exits 1 with one line per problem. */

import { baseFromArgv, report } from "./site-pages.mjs";

const HERO = "#fig-1 .kz-show";
const SOVKORA = "#product-sovkora .kz-show";

/** The state of a carousel's clip and controls, read in the page. */
const read = (root) => {
  const el = document.querySelector(root);
  const v = el?.querySelector("video");
  const sound = el?.querySelector(".kz-show-sound");
  return {
    found: Boolean(el),
    poster: el?.querySelector(".kz-show-slide[data-active] img")?.getAttribute("src") ?? "",
    video: v
      ? {
          src: v.currentSrc,
          loop: v.loop,
          muted: v.muted,
          inline: v.hasAttribute("playsinline"),
          paused: v.paused,
          time: v.currentTime,
          duration: v.duration,
        }
      : undefined,
    count: el?.querySelector(".kz-show-count")?.textContent.replace(/\s+/g, " ").trim() ?? "",
    sound: sound ? sound.getAttribute("aria-pressed") : undefined,
    play: Boolean(el?.querySelector(".kz-show-play")),
  };
};

/** Waits until `test(the carousel)` holds in the page (false after `ms`). */
async function settle(page, root, test, ms = 15000) {
  try {
    await page.waitForFunction(([r, t]) => CHECKS[t](document.querySelector(r)), [root, test], { timeout: ms });
    return true;
  } catch {
    return false;
  }
}

/** The page-side predicates `settle` waits for, installed before the page's scripts. */
const installChecks = () => {
  const video = (el) => el?.querySelector("video");
  globalThis.CHECKS = {
    started: (el) => video(el)?.currentTime > 0.5,
    playing: (el) => video(el) !== null && video(el) !== undefined && !video(el).paused,
    silent: (el) => video(el)?.paused && video(el)?.muted,
    second: (el) => el?.querySelector(".kz-show-count")?.textContent.trim().startsWith("2 /"),
  };
};

const TRAILER_POSTER = /trailer-poster\.[0-9a-f]+\.webp$/;

/** The hero on load: the trailer's poster, Sovkora's carousel not mounted yet, then the clip by itself in the right cut. */
async function opening(page, name, width, problems) {
  const first = await page.evaluate(read, HERO);
  const sovkora = await page.evaluate(read, SOVKORA);
  if (!first.found) {
    return false;
  }
  if (!TRAILER_POSTER.test(first.poster)) {
    problems.push(`${name}: the hero opens on ${first.poster || "nothing"}, not the trailer's poster`);
  }
  if (!TRAILER_POSTER.test(sovkora.poster)) {
    problems.push(`${name}: Sovkora's carousel opens on ${sovkora.poster || "nothing"}, not the trailer`);
  }
  if (sovkora.video) {
    problems.push(`${name}: Sovkora's carousel mounted a clip before it was on screen`);
  }
  if (!(await settle(page, HERO, "started"))) {
    problems.push(`${name}: the trailer did not start by itself`);
    return false;
  }
  const { video, sound } = await page.evaluate(read, HERO);
  const phone = width < 768;
  const cut = phone ? /trailer-720\.[0-9a-f]+\.mp4$/ : /trailer\.[0-9a-f]+\.mp4$/;
  if (!cut.test(video.src)) {
    problems.push(`${name}: plays ${video.src}, expected the ${phone ? "720p" : "full"} cut`);
  }
  if (video.loop || !video.muted || !video.inline) {
    problems.push(`${name}: the clip must be muted, inline and never loop (${JSON.stringify(video)})`);
  }
  if (sound !== "false") {
    problems.push(`${name}: the sound control is missing or on before any click (${sound})`);
  }
  return true;
}

/** « Sound »: on after a click, the film plays on under the pointer, off again once the hero leaves the screen. */
async function sounding(page, name, problems) {
  await page.locator(`${HERO} .kz-show-sound`).click();
  const loud = await page.evaluate(read, HERO);
  if (loud.sound !== "true" || loud.video?.muted !== false) {
    problems.push(`${name}: a click on « Sound » did not turn the sound on`);
  }
  if (!(await settle(page, HERO, "playing", 5000))) {
    problems.push(`${name}: with its sound on, the film stops under the pointer`);
  }
  await page.mouse.move(1, 899);
  await page.evaluate(() => document.querySelector("#products")?.scrollIntoView());
  if (!(await settle(page, HERO, "silent", 5000))) {
    problems.push(`${name}: scrolled away, the hero's film still plays or sounds`);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await settle(page, HERO, "playing", 5000);
}

/** The end: seek to the last second and wait for the next slide. */
async function ending(page, name, problems) {
  await page.evaluate((r) => {
    const v = document.querySelector(r).querySelector("video");
    v.currentTime = Math.max(0, v.duration - 0.8);
  }, HERO);
  if (!(await settle(page, HERO, "second", 10000))) {
    problems.push(`${name}: the trailer's end did not move the carousel on`);
  }
}

async function moving(page, base, width, problems) {
  const name = `${width}px`;
  await page.setViewportSize({ width, height: 900 });
  await page.goto(`${base}/en`, { waitUntil: "load", timeout: 60_000 });
  if (!(await opening(page, name, width, problems))) {
    return problems.push(`${name}: no hero carousel playing`);
  }
  await sounding(page, name, problems);
  await ending(page, name, problems);
  await page.evaluate((r) => document.querySelector(r).scrollIntoView({ block: "center" }), SOVKORA);
  if (!(await settle(page, SOVKORA, "started"))) {
    problems.push(`${name}: Sovkora's trailer did not start on screen`);
  }
}

async function still(page, base, problems) {
  await page.goto(`${base}/fr`, { waitUntil: "load", timeout: 60_000 });
  await page.waitForTimeout(1500);
  const rest = await page.evaluate(read, HERO);
  if (rest.video || !rest.play) {
    problems.push(`reduced motion: expected the poster and a play button, got ${JSON.stringify(rest)}`);
    return;
  }
  await page.locator(`${HERO} .kz-show-play`).click();
  if (!(await settle(page, HERO, "started"))) {
    problems.push("reduced motion: the play button did not play the film");
  }
  const watching = await page.evaluate(read, HERO);
  if (watching.video && !watching.video.muted) {
    problems.push("reduced motion: the film sounds before a click on « Son »");
  }
  if (watching.count !== rest.count) {
    problems.push("reduced motion: the carousel moved on by itself");
  }
}

const args = process.argv;
const engine = args.includes("--browser") ? args[args.indexOf("--browser") + 1] : "chromium";
const base = baseFromArgv();
const pw = await import("playwright");
const browser = await pw[engine].launch();
const problems = [];
try {
  for (const width of [375, 1280]) {
    const context = await browser.newContext({ reducedMotion: "no-preference" });
    await context.addInitScript(() => sessionStorage.setItem("kz-intro", "done"));
    await context.addInitScript(installChecks);
    await moving(await context.newPage(), base, width, problems);
    await context.close();
  }
  const calm = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1280, height: 900 } });
  await calm.addInitScript(installChecks);
  await still(await calm.newPage(), base, problems);
  await calm.close();
} finally {
  await browser.close();
}
report(
  problems.map((p) => `${engine}: ${p}`),
  `${engine}: the trailer opens the hero and Sovkora's carousel, the right cut per screen, muted until « Sound », moves on at its end, still under reduced motion`,
);
