#!/usr/bin/env node
// The home's carousels, rendered from their storyboard (content/films/home-showcase.json, krizaka-internal#2450).
//
//   node scripts/home-showcase.mjs plan                        what each shot costs at most, nothing sent
//   node scripts/home-showcase.mjs render <shot|carousel|all> --env-file <path> [--take <n>] [--out <dir>]
//   node scripts/home-showcase.mjs encode <shot|carousel|all> [--out <dir>]
//   then: node scripts/cdn-assets.mjs upload <out>/upload/<carousel> --to home/showcase/<carousel> --env-file <path>
//
// render: each shot is cut from its reel on one continuous take (vertical, 720x1280, no audio), sent to Runway's video to
// video model named by the storyboard (Aleph 2.0, targetAspectRatio 16:9) with the shared look prompt and the shot's own,
// and the result is kept as <out>/raw/<carousel>-<shot>-t<take>.mp4. Every run is appended to
// content/films/home-showcase.log.json (model, seconds sent, credits charged, task id), credits read before and after.
// The key is AI_VIDEO_API_KEY, from the environment or --env-file: never printed.
// encode: the chosen take becomes the wide rendition (1280x720, H.264 + VP9, poster) and the reel's own vertical cut the
// tall one (a 4:5 frame, 544x680, lighter, poster); a 16:9 clip of « clips » is encoded the same way, its tall a 4:5 crop on its focus: <out>/upload/<carousel>/<shot>-wide.* and <shot>-tall.*.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs, parseEnvFile } from "./pr-assets.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BOARD = path.join(ROOT, "content/films/home-showcase.json");
const LOG = path.join(ROOT, "content/films/home-showcase.log.json");
const API = "https://api.dev.runwayml.com/v1";
// @fixed: Runway's published price of Aleph 2.0, per second of input, and its minimum per generation (docs, 2026-11-05).
const ALEPH_CREDITS_PER_SECOND = 28;
// @fixed: the minimum charge of one Aleph 2.0 generation, in credits.
const ALEPH_MIN_CREDITS = 56;
// @fixed: a take that is not back after 15 minutes is reported, not waited for forever (its task id is in the output).
const TASK_TIMEOUT_MS = 15 * 60 * 1000;
// @fixed: Runway refuses a video shorter than 2 s; the cut of a shot is at least that.
const MIN_SECONDS = 2;
// @fixed: the inline upload limit of the API (a data URI), in bytes.
const INLINE_LIMIT = 5 * 1024 * 1024;

/** Every shot of the storyboard, with its carousel. */
export function shotsOf(board) {
  return Object.entries(board.carousels).flatMap(([carousel, c]) => c.shots.map((s) => ({ ...s, carousel })));
}

/** Every 16:9 clip of the storyboard (no generation: only encoded), with its carousel. */
export function clipsOf(board) {
  return Object.entries(board.carousels).flatMap(([carousel, c]) => (c.clips ?? []).map((s) => ({ ...s, carousel })));
}

/** The shots a selector names: a shot id (`carousel/shot` or a unique `shot`), a carousel, or `all`. */
export function select(board, selector) {
  const all = shotsOf(board);
  if (selector === "all") {
    return all;
  }
  if (board.carousels[selector]) {
    return all.filter((s) => s.carousel === selector);
  }
  const hit = all.filter((s) => `${s.carousel}/${s.id}` === selector || s.id === selector);
  if (hit.length !== 1) {
    throw new Error(`${selector}: no single shot or carousel of that name`);
  }
  return hit;
}

/** The most a shot may cost, in credits: Aleph 2.0 bills each second sent, with a minimum. */
export const maxCredits = (shot) =>
  Math.max(ALEPH_MIN_CREDITS, Math.ceil((shot.to - shot.from) * ALEPH_CREDITS_PER_SECOND));

/** What is wrong with the storyboard, as sentences (empty: fine). */
export function boardProblems(board) {
  const problems = [];
  const ids = new Set();
  for (const s of shotsOf(board)) {
    const key = `${s.carousel}/${s.id}`;
    if (ids.has(key)) {
      problems.push(`${key}: the id is used twice`);
    }
    ids.add(key);
    if (s.to <= s.from) {
      problems.push(`${key}: « to » must come after « from »`);
    } else if (s.to - s.from < MIN_SECONDS - 1e-6) {
      problems.push(`${key}: at least ${MIN_SECONDS} s (the model's minimum)`);
    }
    if (s.to - s.from > 6) {
      problems.push(`${key}: one take, at most 6 s`);
    }
    if (!s.idea?.trim()) {
      problems.push(`${key}: a shot carries one idea`);
    }
    if (!s.prompt?.trim()) {
      problems.push(`${key}: a shot has its prompt`);
    }
    if (s.trim && s.trim[1] <= s.trim[0]) {
      problems.push(`${key}: the trim must be [in, out]`);
    }
  }
  return problems;
}

/** The absolute path of a tool (ffmpeg, ffprobe, curl), looked up once in the directories of PATH. */
const tools = new Map();
function tool(name) {
  if (!tools.has(name)) {
    const dir = (process.env.PATH ?? "").split(path.delimiter).find((d) => d && fs.existsSync(path.join(d, name)));
    if (!dir) {
      throw new Error(`${name} is not installed`);
    }
    tools.set(name, path.join(dir, name));
  }
  return tools.get(name);
}
const run = (cmd, args) => execFileSync(tool(cmd), args, { stdio: ["ignore", "ignore", "pipe"] });
const expand = (p) => p.replace(/^~(?=$|\/)/, os.homedir());
const sourceOf = (board, shot) => path.join(expand(board.sources), shot.reel);
const readLog = () => (fs.existsSync(LOG) ? JSON.parse(fs.readFileSync(LOG, "utf8")) : { runs: [], chosen: {} });

function keyFrom(args) {
  const env = args.envFile ? parseEnvFile(fs.readFileSync(args.envFile, "utf8")) : {};
  const key = process.env.AI_VIDEO_API_KEY || env.AI_VIDEO_API_KEY;
  if (!key) {
    throw new Error("AI_VIDEO_API_KEY is not set (environment or --env-file)");
  }
  return key;
}

async function api(key, method, route, body) {
  const res = await fetch(API + route, {
    method,
    headers: { Authorization: `Bearer ${key}`, "X-Runway-Version": "2024-11-06", "Content-Type": "application/json" },
    body: body && JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`${method} ${route}: HTTP ${res.status} ${(await res.text()).slice(0, 400)}`);
  }
  return res.json();
}

const balance = async (key) => (await api(key, "GET", "/organization")).creditBalance;

async function render(board, shot, key, out, take) {
  const raw = path.join(out, "raw", `${shot.carousel}-${shot.id}-t${take}.mp4`);
  if (fs.existsSync(raw)) {
    return console.log(`${shot.carousel}/${shot.id} take ${take}: already rendered`);
  }
  fs.mkdirSync(path.dirname(raw), { recursive: true });
  const cut = path.join(out, "cut", `${shot.carousel}-${shot.id}.mp4`);
  fs.mkdirSync(path.dirname(cut), { recursive: true });
  // The data URI (base64, a third larger) must stay under the inline limit: a lighter encode when the take is long.
  const uriBytes = (n) => Math.ceil(n / 3) * 4 + 32;
  let bytes = Buffer.alloc(0);
  for (const crf of ["22", "26", "30", "34"]) {
    run("ffmpeg", [
      "-v",
      "error",
      "-y",
      "-ss",
      String(shot.from),
      "-to",
      String(shot.to),
      "-i",
      sourceOf(board, shot),
      "-an",
      "-vf",
      "scale=720:1280",
      "-c:v",
      "libx264",
      "-crf",
      crf,
      "-preset",
      "slow",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      cut,
    ]);
    bytes = fs.readFileSync(cut);
    if (uriBytes(bytes.length) < INLINE_LIMIT) {
      break;
    }
  }
  if (uriBytes(bytes.length) >= INLINE_LIMIT) {
    throw new Error(`${cut}: over the 5 MB inline limit`);
  }
  const before = await balance(key);
  const started = Date.now();
  const task = await api(key, "POST", "/video_to_video", {
    model: board.model,
    videoUri: `data:video/mp4;base64,${bytes.toString("base64")}`,
    promptText: `${board.look} ${shot.prompt}`,
    targetAspectRatio: "16:9",
    seed: 1000 * take + 7,
  });
  console.log(
    `${shot.carousel}/${shot.id} take ${take}: task ${task.id}, at most ${task.estimatedCost?.credits} credits`,
  );
  let state;
  const deadline = Date.now() + TASK_TIMEOUT_MS;
  do {
    if (Date.now() > deadline) {
      throw new Error(`${shot.carousel}/${shot.id}: task ${task.id} still ${state?.status} after 15 min`);
    }
    await new Promise((r) => setTimeout(r, 8000));
    state = await api(key, "GET", `/tasks/${task.id}`);
  } while (!["SUCCEEDED", "FAILED", "CANCELLED"].includes(state.status));
  if (state.status === "SUCCEEDED") {
    fs.writeFileSync(raw, Buffer.from(await (await fetch(state.output[0])).arrayBuffer()));
  }
  const after = await balance(key);
  const entry = {
    shot: `${shot.carousel}/${shot.id}`,
    take,
    model: board.model,
    secondsSent: +(shot.to - shot.from).toFixed(2),
    // What Runway bills for the task (its estimate, the charge for a whole take); the balance moved by `balanceDelta`,
    // which counts any other run of the same key at the same time.
    credits: task.estimatedCost?.credits ?? before - after,
    usd: (task.estimatedCost?.credits ?? before - after) / 100,
    balanceDelta: before - after,
    wallSeconds: Math.round((Date.now() - started) / 1000),
    task: task.id,
    status: state.status,
    at: new Date(started).toISOString(),
  };
  const log = readLog();
  log.runs.push(entry);
  fs.writeFileSync(LOG, `${JSON.stringify(log, null, 2)}\n`);
  console.log(JSON.stringify(entry));
}

/** The ffmpeg filter of a phone rendition: a 4:5 frame (544x680) cut from the source, centred on its subject. */
export function tallFilter(width, height, focus = 0.5) {
  const w = Math.min(width, Math.round((height * 4) / 5 / 2) * 2);
  const h = Math.min(height, Math.round((w * 5) / 4 / 2) * 2);
  const x = Math.round(Math.max(0, Math.min(width - w, focus * width - w / 2)));
  const y = Math.round((height - h) / 2);
  return `crop=${w}:${h}:${x}:${y},scale=544:680:flags=lanczos,setsar=1`;
}

const probe = (file) => {
  const [w, h] = execFileSync(
    tool("ffprobe"),
    ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", file],
    { encoding: "utf8" },
  )
    .trim()
    .split(",")
    .map(Number);
  return { w, h };
};

/** Writes `<base>.mp4`, `<base>.webm` and `<base>.jpg` (its poster, at 85 % of the take) from `input` between `from` and `to`. */
function rendition(input, from, to, filter, base, light) {
  const cut = ["-ss", String(from), "-to", String(to), "-i", input, "-an", "-vf", filter];
  const crf = light ? ["27", "42"] : ["23", "36"];
  run("ffmpeg", [
    "-v",
    "error",
    "-y",
    ...cut,
    "-c:v",
    "libx264",
    "-crf",
    crf[0],
    "-preset",
    "slow",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    `${base}.mp4`,
  ]);
  run("ffmpeg", [
    "-v",
    "error",
    "-y",
    ...cut,
    "-c:v",
    "libvpx-vp9",
    "-crf",
    crf[1],
    "-b:v",
    "0",
    "-row-mt",
    "1",
    `${base}.webm`,
  ]);
  const at = (from + (to - from) * 0.85).toFixed(2);
  run("ffmpeg", [
    "-v",
    "error",
    "-y",
    "-ss",
    at,
    "-i",
    input,
    "-frames:v",
    "1",
    "-vf",
    filter,
    "-q:v",
    "4",
    `${base}.jpg`,
  ]);
}

const WIDE = "scale=1280:720:flags=lanczos:force_original_aspect_ratio=increase,crop=1280:720,setsar=1";

function encodeShot(board, shot, out, chosenTake) {
  const take = chosenTake ?? readLog().chosen[`${shot.carousel}/${shot.id}`]?.take ?? 1;
  const raw = path.join(out, "raw", `${shot.carousel}-${shot.id}-t${take}.mp4`);
  if (!fs.existsSync(raw)) {
    throw new Error(`${raw}: render it first`);
  }
  const dir = path.join(out, "upload", shot.carousel);
  fs.mkdirSync(dir, { recursive: true });
  const [tin, tout] = shot.trim ?? [0, shot.to - shot.from];
  rendition(raw, tin, tout, WIDE, path.join(dir, `${shot.id}-wide`), false);
  // The phone's rendition is the reel's own vertical take, the same moment, in a 4:5 frame.
  const source = sourceOf(board, shot);
  const { w, h } = probe(source);
  rendition(source, shot.from + tin, shot.from + tout, tallFilter(w, h), path.join(dir, `${shot.id}-tall`), true);
  console.log(`${shot.carousel}/${shot.id}: encoded take ${take}`);
}

function encodeClip(board, clip, out) {
  const dir = path.join(out, "upload", clip.carousel);
  fs.mkdirSync(dir, { recursive: true });
  let source = clip.src;
  const [lib, file] = clip.src.split(/:(?!\/\/)/);
  if (file && board.libraries[lib]) {
    source = path.join(expand(board.libraries[lib]), file);
  } else if (clip.src.startsWith("https:")) {
    source = path.join(out, "src", path.basename(new URL(clip.src).pathname));
    if (!fs.existsSync(source)) {
      fs.mkdirSync(path.dirname(source), { recursive: true });
      run("curl", ["-sfL", "-o", source, clip.src]);
    }
  }
  rendition(source, clip.from, clip.to, WIDE, path.join(dir, `${clip.id}-wide`), false);
  const { w, h } = probe(source);
  rendition(source, clip.from, clip.to, tallFilter(w, h, clip.focus), path.join(dir, `${clip.id}-tall`), true);
  console.log(`${clip.carousel}/${clip.id}: encoded`);
}

function encode(board, item, out, take) {
  if (item.reel) {
    encodeShot(board, item, out, take);
  } else {
    encodeClip(board, item, out);
  }
}

/** Whether an item of the storyboard is the one (or among the ones) a selector names. */
const named = (selector) => (x) =>
  selector === "all" || x.carousel === selector || `${x.carousel}/${x.id}` === selector;

const COMMANDS = {
  plan: async ({ board, selector }) => {
    const shots = select(board, selector);
    for (const s of shots) {
      console.log(`${s.carousel}/${s.id}\t${(s.to - s.from).toFixed(1)} s\t≤ ${maxCredits(s)} credits`);
    }
    console.log(`total ≤ ${shots.reduce((n, s) => n + maxCredits(s), 0)} credits per take`);
  },
  render: async ({ board, selector, args, out }) => {
    const key = keyFrom(args);
    for (const s of select(board, selector)) {
      await render(board, s, key, out, Number(args.take ?? 1));
    }
  },
  encode: async ({ board, selector, args, out }) => {
    const take = args.take ? Number(args.take) : undefined;
    for (const s of [...shotsOf(board), ...clipsOf(board)].filter(named(selector))) {
      encode(board, s, out, take);
    }
  },
};

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const [command, selector = "all"] = args._;
  const board = JSON.parse(fs.readFileSync(BOARD, "utf8"));
  const problems = boardProblems(board);
  if (problems.length) {
    throw new Error(problems.join("\n"));
  }
  const out = path.resolve(args.out ?? path.join(os.tmpdir(), "krizaka-home-showcase"));
  const run = COMMANDS[command];
  if (!run) {
    console.log(
      "usage: node scripts/home-showcase.mjs plan|render|encode <shot|carousel|all> [--env-file <path>] [--take <n>] [--out <dir>]",
    );
    process.exitCode = command ? 1 : 0;
    return;
  }
  await run({ board, selector, args, out });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
