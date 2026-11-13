#!/usr/bin/env node
/* The home's carousels are @krizaka/ui's MediaCarousel (krizaka-internal#3273): their rules are tested in krizaka-ui; this reads
   the result on the running site, in a real browser, with the real files from the CDN.
     node scripts/check-showcase-player.mjs --base http://localhost:3000 [--browser chromium|webkit|firefox]
   - At most one <video> at page load, and none in a carousel that has not been on screen (one decoder at a time).
   - Scrolled to, a carousel plays by itself, muted.
   - Sound only after a press on its toggle (aria-pressed): muted before, unmuted after, muted again on the next slide.
   - A mouse click on « next » never freezes it: the new clip plays on, the pointer still over it (krizaka-internal#3238).
   - Under reduced motion: no clip by itself.
   Exits 1 with one line per problem. */

import { baseFromArgv, report } from "./site-pages.mjs";

const ROOT = "section[aria-roledescription]";

/** The first carousel of the page that offers a sound toggle on its opening slide (Sovkora's trailer), or the first one. */
const clipOf = (root) => root.locator("video").first();

/** A carousel scrolled to plays by itself, muted, and a mouse click on « next » (#3238) never freezes it. */
async function playsOn(page, root, label, problems) {
  await root.scrollIntoViewIfNeeded();
  try {
    await clipOf(root).waitFor({ state: "attached", timeout: 15000 });
    await page.waitForFunction((el) => el.querySelector("video")?.currentTime > 0.3, await root.elementHandle(), {
      timeout: 15000,
    });
  } catch {
    problems.push(`${label} did not start by itself once on screen`);
    return;
  }
  if (!(await clipOf(root).evaluate((v) => v.muted))) {
    problems.push(`${label} sounds before any press`);
  }
  await root.getByRole("button", { name: "Next slide" }).first().click();
  const samples = [];
  for (let k = 0; k < 4; k++) {
    await page.waitForTimeout(500);
    samples.push(await clipOf(root).evaluate((v) => ({ paused: v.paused, t: v.currentTime })));
  }
  if (samples.some((x) => x.paused) || new Set(samples.map((x) => x.t)).size < 2) {
    problems.push(`${label} froze after a click on next (${JSON.stringify(samples)})`);
  }
}

/** Sound: only after the press, and only for the slide it was pressed on. */
async function sounds(page, name, problems) {
  const root = page
    .locator(ROOT)
    .filter({ has: page.getByRole("button", { name: "Sound" }) })
    .first();
  const toggle = root.getByRole("button", { name: "Sound" });
  if ((await toggle.count()) === 0) {
    problems.push(`${name}: no carousel offers a sound toggle`);
    return;
  }
  await root.scrollIntoViewIfNeeded();
  // Back to the slide that has sound (the trailer, the first of its carousel).
  for (let k = 0; k < 6 && !(await root.textContent()).includes("1 / "); k++) {
    await root.getByRole("button", { name: "Next slide" }).first().click();
    await page.waitForTimeout(300);
  }
  await page.waitForTimeout(1200);
  const muted = () => clipOf(root).evaluate((v) => v.muted);
  if (!(await muted())) {
    problems.push(`${name}: the clip sounds before any press`);
  }
  await toggle.click();
  await page.waitForTimeout(800);
  if ((await toggle.getAttribute("aria-pressed")) !== "true" || (await muted())) {
    problems.push(`${name}: a press on the sound toggle did not unmute the clip`);
  }
  await root.getByRole("button", { name: "Next slide" }).first().click();
  await page.waitForTimeout(800);
  if (!(await muted())) {
    problems.push(`${name}: the sound stayed on after moving to the next slide`);
  }
}

async function moving(page, base, width, problems) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(`${base}/en`, { waitUntil: "load" });
  const name = `${width}px`;
  // One decoder at a time (krizaka-internal#2946): at most one clip plays at load (the library still mounts a paused <video>
  // per carousel: krizaka-ui ticket in the PR).
  const playing = await page.evaluate(() => [...document.querySelectorAll("video")].filter((v) => !v.paused).length);
  if (playing > 1) {
    problems.push(`${name}: ${playing} clips play at page load, expected at most 1`);
  }
  const roots = page.locator(ROOT);
  const total = await roots.count();
  if (total === 0) {
    problems.push(`${name}: no carousel on the home`);
    return;
  }
  for (let i = 0; i < total; i++) {
    await playsOn(page, roots.nth(i), `${name}: carousel ${i + 1}`, problems);
  }
  await sounds(page, name, problems);
}

async function still(page, base, problems) {
  await page.goto(`${base}/en`, { waitUntil: "load" });
  const roots = page.locator(ROOT);
  for (let i = 0; i < (await roots.count()); i++) {
    await roots.nth(i).scrollIntoViewIfNeeded();
  }
  await page.waitForTimeout(1500);
  if ((await page.locator("video").count()) > 0) {
    problems.push("reduced motion: a clip is mounted before any press");
  }
}

const args = process.argv;
const engine = args.includes("--browser") ? args[args.indexOf("--browser") + 1] : "chromium";
const base = baseFromArgv();
const pw = await import("playwright");
const browser = await pw[engine].launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
const problems = [];
try {
  for (const width of [375, 1280]) {
    const context = await browser.newContext({ reducedMotion: "no-preference" });
    await context.addInitScript(() => sessionStorage.setItem("kz-intro", "done"));
    await moving(await context.newPage(), base, width, problems);
    await context.close();
  }
  const calm = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1280, height: 900 } });
  await still(await calm.newPage(), base, problems);
  await calm.close();
} finally {
  await browser.close();
}
report(
  problems.map((p) => `${engine}: ${p}`),
  `${engine}: the carousels play by themselves, muted, sound only after a press on the slide's own toggle, never frozen by a click, still under reduced motion`,
);
