#!/usr/bin/env node
// The home's carousels, checked on the REAL files (founder, 2026-11-05: no vertical, no black or white artefact).
//
//   node scripts/check-showcase-media.mjs [--only <carousel>]
//
// For every slide of every carousel: each of its videos (mp4 and webm for a rendered clip; the phone cut and the full cut
// for a film, krizaka-internal#2837) and its poster answer 200 with the right content-type; each video is a real 16:9
// (ffprobe width and height, not just a « wide » key), H.264 (mp4) or VP9 (webm); no frame is a vertical picture
// pillarboxed in black bars; the last frame is not a black end card; the audio track and the slide's `audio` agree. The still of a product in conception (krizaka-internal#2802): its photo answers
// 200 as a JPEG and is a 16:9 picture. Needs ffmpeg and ffprobe and the network.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { manifestObject } from "./bunny-layout.mjs";
import { showcaseSlides, showcaseStill, SHOWCASES, STILLS } from "../lib/home-showcase.ts";

const ROOT = new URL("..", import.meta.url);
const CDN = (process.env.NEXT_PUBLIC_MEDIA_CDN_URL || "https://krizaka-assets.b-cdn.net").replace(/\/$/, "");
const TYPES = { mp4: "video/mp4", webm: "video/webm", jpg: "image/jpeg", webp: "image/webp" };
const CODECS = { "video/mp4": "h264", "video/webm": "vp9" };
const extOf = (path) => path.slice(path.lastIndexOf(".") + 1);
// @fixed: a side band is « black » under this peak luma (0-255); the centre is « picture » over the other one.
const BLACK_PEAK = 24;
// @fixed: the centre of a frame is a picture over this peak luma.
const PICTURE_PEAK = 60;
// @fixed: a last frame whose average luma is under this is a black end card, not a picture.
const DARK_LAST_FRAME = 6;
// @fixed: a frame's width and height may be off 16:9 by this many pixels (encoder rounding).
const RATIO_TOLERANCE = 16;
// @fixed: ffmpeg and ffprobe read a remote clip; a stalled one is reported after two minutes.
const TOOL_TIMEOUT_MS = 120000;

/** Is a width and height a 16:9 (within the encoder's rounding)? */
export const isSixteenNine = (w, h) => Math.abs(w * 9 - h * 16) <= RATIO_TOLERANCE;

/** The frames (rows of [left, right, centre] peaks) that are a picture between two black bars. */
export const pillarboxed = (rows) => rows.filter(([l, r, c]) => l < BLACK_PEAK && r < BLACK_PEAK && c > PICTURE_PEAK);

/** Is the average luma of a last frame a black end card? */
export const blackEndCard = (yavg) => yavg < DARK_LAST_FRAME;

const manifest = JSON.parse(readFileSync(new URL("lib/cdn-manifest.json", ROOT), "utf8"));
const versioned = (p, h) => `${p.slice(0, p.lastIndexOf("."))}.${h}${p.slice(p.lastIndexOf("."))}`;
export const urlOf = (logical) =>
  `${CDN}/${manifestObject(manifest.root, logical, manifest.files[logical], versioned)}`;

const tool = (cmd, args) =>
  execFileSync(cmd, ["-v", "error", ...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: TOOL_TIMEOUT_MS,
    maxBuffer: 1 << 26,
  });

const stat = (url, crop, key) =>
  tool("ffmpeg", [
    "-i",
    url,
    "-vf",
    `fps=5,crop=${crop},signalstats,metadata=print:key=lavfi.signalstats.${key}:file=-`,
    "-f",
    "null",
    "-",
  ])
    .split(`${key}=`)
    .slice(1)
    .map((chunk) => Number.parseFloat(chunk));

async function head(url) {
  for (let i = 0; i < 4; i++) {
    try {
      return await fetch(url, { method: "HEAD" });
    } catch {
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
  throw new Error(`${url}: unreachable`);
}

async function httpProblems(name, s) {
  const problems = [];
  for (const path of [...s.videos.map((v) => v.path), s.poster]) {
    const expected = TYPES[extOf(path)];
    const r = await head(urlOf(path));
    const type = r.headers.get("content-type") ?? "";
    if (r.status !== 200) {
      problems.push(`${name} ${path}: HTTP ${r.status}`);
    } else if (!type.startsWith(expected)) {
      problems.push(`${name} ${path}: content-type ${type}, expected ${expected}`);
    }
  }
  return problems;
}

function streamProblems(name, s) {
  const problems = [];
  for (const v of s.videos) {
    const rows = tool("ffprobe", [
      "-show_entries",
      "stream=codec_type,codec_name,width,height",
      "-of",
      "csv=p=0",
      urlOf(v.path),
    ])
      .trim()
      .split("\n")
      .map((l) => l.split(","));
    const video = rows.find((r) => r[1] === "video");
    if (!video) {
      problems.push(`${name} ${v.path}: no video stream`);
      continue;
    }
    if (video[0] !== CODECS[v.type]) {
      problems.push(`${name} ${v.path}: codec ${video[0]}, expected ${CODECS[v.type]}`);
    }
    if (!isSixteenNine(Number(video[2]), Number(video[3]))) {
      problems.push(`${name} ${v.path}: ${video[2]}x${video[3]} is not 16:9`);
    }
    if (rows.some((r) => r[1] === "audio") !== s.audio) {
      problems.push(`${name} ${v.path}: the audio track and the slide's audio flag disagree`);
    }
  }
  return problems;
}

function pictureProblems(name, s) {
  const problems = [];
  // The lightest H.264 file: a rendered clip's mp4, a film's phone cut.
  const url = urlOf(s.videos.find((v) => v.type === "video/mp4").path);
  const left = stat(url, "iw*0.2:ih:0:0", "YMAX");
  const right = stat(url, "iw*0.2:ih:iw*0.8:0", "YMAX");
  const centre = stat(url, "iw*0.3:ih:iw*0.35:0", "YMAX");
  const bars = pillarboxed(left.map((v, i) => [v, right[i], centre[i]]));
  if (bars.length > 0) {
    problems.push(`${name}: ${bars.length} frame(s) are a vertical picture between black bars (pillarbox)`);
  }
  const last = tool("ffmpeg", [
    "-sseof",
    "-0.1",
    "-i",
    url,
    "-frames:v",
    "1",
    "-vf",
    "signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=-",
    "-f",
    "null",
    "-",
  ]);
  if (blackEndCard(Number.parseFloat(last.split("YAVG=")[1] ?? "0"))) {
    problems.push(`${name}: the last frame (held on screen) is a black end card`);
  }
  return problems;
}

/** What is wrong with the files of one carousel, as sentences (empty: fine). */
export async function problemsOf(carousel) {
  const problems = [];
  for (const s of showcaseSlides(carousel)) {
    const name = `${carousel}/${s.id}`;
    problems.push(...(await httpProblems(name, s)), ...streamProblems(name, s), ...pictureProblems(name, s));
  }
  return problems;
}

/** What is wrong with the photo of a product in conception, as sentences (empty: fine). */
export async function stillProblems(product) {
  const { id, poster } = showcaseStill(product);
  const name = `${product}/${id}`;
  const r = await head(urlOf(poster));
  const type = r.headers.get("content-type") ?? "";
  if (r.status !== 200) {
    return [`${name}.jpg: HTTP ${r.status}`];
  }
  if (!type.startsWith(TYPES.jpg)) {
    return [`${name}.jpg: content-type ${type}, expected ${TYPES.jpg}`];
  }
  const [w, h] = tool("ffprobe", ["-show_entries", "stream=width,height", "-of", "csv=p=0", urlOf(poster)])
    .trim()
    .split(",")
    .map(Number);
  return isSixteenNine(w, h) ? [] : [`${name}.jpg: ${w}x${h} is not 16:9`];
}

async function main() {
  const flag = process.argv.indexOf("--only");
  const only = flag === -1 ? undefined : process.argv[flag + 1];
  const all = [];
  for (const c of SHOWCASES.filter((x) => !only || x === only)) {
    all.push(...(await problemsOf(c)));
  }
  for (const p of STILLS.filter((x) => !only || x === only)) {
    all.push(...(await stillProblems(p)));
  }
  if (all.length > 0) {
    console.error(all.join("\n"));
    process.exitCode = 1;
  } else {
    console.log(
      "showcase media: every file answers 200 with its type, a clean 16:9, no pillarbox, no black end card; every still a 16:9 JPEG",
    );
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
