#!/usr/bin/env node
/* A sound control is shown exactly when the video file has an audio track (krizaka-internal#3243, founder 2026-11-13).
     node --experimental-strip-types scripts/check-sound-control.mjs --base http://localhost:3000
   On the watch pages and /story, in a real browser with motion allowed: for every <video> the page mounts, ffprobe reads the
   served file's tracks and the page is read for a sound control (the player's mute / unmute / volume button) in that video's
   own player. Fails on a sound control on a silent file, and on a file with sound and no control. A silent clip says nothing
   about sound. Needs ffprobe and the network. Exits 1 with one line per problem. */

import { tool } from "./check-showcase-media.mjs";
import { baseFromArgv, report } from "./site-pages.mjs";
import { audioTracksOf, soundControlProblems } from "./sound-control-lib.mjs";

// The player's sound control, in both languages (messages site.story.world.labels.mute / unmute / volume).
const SOUND_LABEL = /^(mute|unmute|volume|sound|son|couper le son|activer le son|rétablir le son)\b/i;

const probed = new Map();
const tracksOf = (url) => {
  if (!probed.has(url)) {
    probed.set(url, audioTracksOf(JSON.parse(tool("ffprobe", ["-show_streams", "-of", "json", url]))));
  }
  return probed.get(url);
};

/** The pages that play a video: the watch pages (their addresses come from the sitemap) and /story. */
async function pagesOf(base) {
  const xml = await (await fetch(`${base}/sitemap.xml`)).text();
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => new URL(m[1]).pathname)
    .filter((p) => /^\/(en|fr)\/(films\/[^/]+|story)$/.test(p));
  return [...new Set(paths)];
}

/** In the page: each <video>, its file and whether its own player (the nearest ancestor holding no other video) draws a sound control. */
const readVideos = (labelSource) => {
  const label = new RegExp(labelSource, "i");
  const named = (el) => label.test((el.getAttribute("aria-label") ?? el.textContent ?? "").trim());
  const controlsOf = (video) => {
    for (let node = video.parentElement; node && node !== document.body; node = node.parentElement) {
      if ([...node.querySelectorAll("video")].some((v) => v !== video)) {
        return false;
      }
      if ([...node.querySelectorAll("button, [role=slider], input[type=range]")].some(named)) {
        return true;
      }
    }
    return false;
  };
  return [...document.querySelectorAll("video")].map((video) => ({
    file: video.currentSrc || video.src || video.querySelector("source")?.src || "",
    control: controlsOf(video),
  }));
};

/** A page loaded and scrolled to its end, then every video it mounted. */
async function videosOf(browser, base, path) {
  const context = await browser.newContext({ reducedMotion: "no-preference", viewport: { width: 1280, height: 900 } });
  await context.addInitScript(() => sessionStorage.setItem("kz-intro", "done"));
  const page = await context.newPage();
  await page.goto(base + path, { waitUntil: "load", timeout: 60_000 });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight / 2) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  });
  await page.waitForTimeout(2000);
  const found = await page.evaluate(readVideos, SOUND_LABEL.source);
  await context.close();
  return found.filter((v) => v.file).map((v) => ({ page: path, ...v, audioTracks: tracksOf(v.file) }));
}

const base = baseFromArgv();
const { chromium } = await import("playwright");
const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
const videos = [];
const paths = await pagesOf(base);
try {
  for (const path of paths) {
    videos.push(...(await videosOf(browser, base, path)));
  }
} finally {
  await browser.close();
}
const problems = soundControlProblems(videos);
if (videos.length === 0) {
  problems.push("no <video> found on the watch pages or /story: the check reads nothing");
}
report(
  problems,
  `${videos.length} videos on ${paths.length} pages: a sound control exactly where the file has an audio track`,
);
