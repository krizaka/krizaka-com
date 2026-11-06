#!/usr/bin/env node
// The home's carousels, checked on the REAL files (founder, 2026-11-05: no vertical, no black or white artefact), with the
// rules of @krizaka/ui's media guard (krizaka-ui ADR-010 §4, krizaka-internal#2658) — never a copy of them here.
//
//   node scripts/check-showcase-media.mjs [--only <carousel>]
//
// For every slide of every carousel: the poster, the webm and the mp4 answer 200 with their type; the video is a real
// 16:9 by its pixels; the mp4 is H.264 yuv420p with its index first (Safari), the webm VP9 (Chrome); no frame is a picture
// between black bars (pillarbox or letterbox); the last frame is not a black end card; a slide's `audio` tells the truth.
// Needs ffmpeg and ffprobe and the network.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { ffmpegPort, guardSlides } from "@krizaka/ui/media-guard";
import { manifestObject } from "./bunny-layout.mjs";
import { showcaseSlides, SHOWCASES } from "../lib/home-showcase.ts";

export { blackEndCard, isSixteenNine, letterboxed, pillarboxed } from "@krizaka/ui/media-guard";

const ROOT = new URL("..", import.meta.url);
const CDN = (process.env.NEXT_PUBLIC_MEDIA_CDN_URL || "https://krizaka-assets.b-cdn.net").replace(/\/$/, "");
// @fixed: ffmpeg and ffprobe read a remote clip; a stalled one is reported after two minutes.
const TOOL_TIMEOUT_MS = 120000;

const manifest = JSON.parse(readFileSync(new URL("lib/cdn-manifest.json", ROOT), "utf8"));
const versioned = (p, h) => `${p.slice(0, p.lastIndexOf("."))}.${h}${p.slice(p.lastIndexOf("."))}`;
export const urlOf = (logical) =>
  `${CDN}/${manifestObject(manifest.root, logical, manifest.files[logical], versioned)}`;

const run = (cmd, args) =>
  execFileSync(cmd, args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: TOOL_TIMEOUT_MS,
    maxBuffer: 1 << 26,
  });

/** One carousel's slides as the guard reads them: their real URLs and what they claim. */
export const guardedSlides = (carousel) =>
  showcaseSlides(carousel).map((s) => ({
    id: `${carousel}/${s.id}`,
    src: urlOf(`${s.wide}.jpg`),
    video: { webm: urlOf(`${s.wide}.webm`), mp4: urlOf(`${s.wide}.mp4`) },
    audio: s.audio,
  }));

/** What is wrong with the files of one carousel, as sentences (empty: fine). */
export async function problemsOf(carousel) {
  return (await guardSlides(guardedSlides(carousel), ffmpegPort(run))).problems;
}

async function main() {
  const flag = process.argv.indexOf("--only");
  const only = flag === -1 ? undefined : process.argv[flag + 1];
  const all = [];
  for (const c of SHOWCASES.filter((x) => !only || x === only)) {
    all.push(...(await problemsOf(c)));
  }
  if (all.length > 0) {
    console.error(all.join("\n"));
    process.exitCode = 1;
  } else {
    console.log(
      "showcase media: every file answers with its type, a clean 16:9, Safari and Chrome encodes, no bars, no black end card",
    );
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
