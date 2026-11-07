#!/usr/bin/env node
// One command adds a finished film to a home carousel (krizaka-internal#2876).
//
//   node scripts/showcase-add.mjs <carousel> <id> <source.mp4> [--teaser <start>-<end> [--keep-audio]] [--poster file.jpg]
//                                 [--after <id> | --no-order] [--replace] [--idea "…"] [--product <product>]
//                                 [--secrets @dev] [--dry-run]
//
// From ONE source file (16:9, with or without sound) it
//   1. renders what a carousel plays (krizaka-internal#2837's split): `<id>.mp4` 1280x720 H.264 for ≥768 px,
//      `<id>-720.mp4` the lighter cut for phones (480p: the name is #666's, kept so lib/home-showcase.ts reads every film
//      the same way) and `<id>-poster.webp` (the given poster, else a frame of the film); no webm (VP9 was no smaller at
//      equal quality, #2837);
//   2. uploads them with scripts/cdn-assets.mjs under `products/<product>/films/` (layout v2, ADR-014), which records
//      them in lib/cdn-manifest.json (the credentials come from `secret.sh`, are handed to cdn-assets in memory and are
//      never printed);
//   3. adds the film to `films` of content/films/home-showcase.json and its id to the carousel's `order` (the end, or
//      right after `--after <id>`; `--no-order` leaves every order alone; to move a film later, move its id in that
//      array: nothing else holds the order);
//   4. writes empty `caption` and `alt` stubs in messages/en.json and messages/fr.json (`site.home.films.<id>`): the build
//      (`krizaka-i18n check`) refuses them while they are empty, so the words must be written before the PR can pass.
//
// **No full-length film plays inside a carousel** (a slide lasts as long as its video, #2837: an 85 s slide would hold the
// carousel). A source longer than 12 s needs `--teaser <start>-<end>` (seconds, at most 10 s): the carousel plays that loop
// (`<id>.mp4`, `<id>-720.mp4`; silent unless `--keep-audio`), and the FULL film (1280x720, with its sound) goes up as
// `<id>-full.mp4` to the film's watch page `/<locale>/films/<id>` (the storyboard's `watch`, lib/watch-films.ts). The words
// then also hold `watchLabel` (the slide's one action) and `transcript` (the text version of the film's titles).
// `--replace` re-renders a film already in `films` (its order stays); `--dry-run` renders nothing, uploads nothing,
// writes nothing: it prints the files, manifest keys, storyboard entry and message stubs it would produce.
// The product defaults to the carousel's; the hero's films are Sovkora's.
// Needs ffmpeg, ffprobe and cwebp (brew install ffmpeg webp).
// Tests: tests/showcase-add.test.mjs.

import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { main as cdnMain } from "./cdn-assets.mjs";
import { parseArgs } from "./pr-assets.mjs";

export const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// @fixed: the cuts, in the family's web budget: a ~70-85 s film is ~12 MB at 720p, not tens; a loop is a few hundred KB.
export const CUTS = {
  full: { width: 1280, height: 720, crf: 27, maxrate: "1400k", audio: "96k" },
  phone: { width: 854, height: 480, crf: 29, maxrate: "650k", audio: "64k" },
  watch: { width: 1280, height: 720, crf: 28, maxrate: "1300k", audio: "96k" },
};
// @fixed: the poster's size (16:9) and quality.
export const POSTER = { width: 1280, height: 720, quality: 80 };
// @fixed: the longest teaser a carousel plays, and the longest film it plays without one (a slide lasts as long as its video).
export const MAX_TEASER_SECONDS = 10;
export const MAX_LOOP_SECONDS = 12;
// @fixed: a width and a height may be off 16:9 by this many pixels (encoder rounding), as in check-showcase-media.mjs.
const RATIO_TOLERANCE = 16;

const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export const isSixteenNine = (w, h) => Math.abs(w * 9 - h * 16) <= RATIO_TOLERANCE;

/** `46-54` → { start: 46, end: 54 }; undefined when it is not a range of seconds. */
export function parseTeaser(value) {
  const m = /^(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)$/.exec(String(value ?? ""));
  return m ? { start: Number(m[1]), end: Number(m[2]) } : undefined;
}

/** The files of a film, by role: its object name and its logical path (the manifest's key). */
export function plan({ id, carousel, product }) {
  const to = `products/${product ?? (carousel === "hero" ? "sovkora" : carousel)}/films`;
  const named = (suffix, ext) => ({ name: `${id}${suffix}.${ext}`, logical: `${to}/${id}${suffix}.${ext}` });
  return {
    to,
    base: `${to}/${id}`,
    full: named("", "mp4"),
    phone: named("-720", "mp4"),
    poster: named("-poster", "webp"),
    watch: named("-full", "mp4"),
  };
}

function teaserProblems(teaser) {
  const t = parseTeaser(teaser);
  if (!t || t.end <= t.start) {
    return [`--teaser "${teaser}" must be <start>-<end> in seconds, like 46-54`];
  }
  const length = t.end - t.start;
  return length > MAX_TEASER_SECONDS ? [`--teaser is ${length} s: at most ${MAX_TEASER_SECONDS} s`] : [];
}

/** What is wrong with the arguments, against the storyboard (empty: fine). Pure. */
export function argProblems({ carousel, id, source, after, teaser, noOrder, replace }, board) {
  const problems = teaser === undefined ? [] : teaserProblems(teaser);
  const c = board.carousels?.[carousel];
  if (!c) {
    problems.push(`carousel "${carousel}" is not one of ${Object.keys(board.carousels).join(", ")}`);
  }
  if (!ID.test(id ?? "")) {
    problems.push(`id "${id}" must be lower-case words joined by "-"`);
  }
  if (!source) {
    problems.push("a source .mp4 is needed");
  }
  if (after && noOrder) {
    problems.push("--after and --no-order do not go together");
  }
  if (c && ID.test(id ?? "")) {
    const slide = [c.shots, c.clips].some((l) => l.some((x) => x.id === id));
    if (replace && !board.films[id]) {
      problems.push(`--replace: "${id}" is not a film of the storyboard`);
    } else if (!replace && (slide || board.films[id])) {
      problems.push(`"${id}" is already in the storyboard (--replace re-renders a film)`);
    }
  }
  if (c && after && !c.order.includes(after)) {
    problems.push(`--after "${after}" is not in the order of ${carousel}`);
  }
  return problems;
}

/** The storyboard with the film added: `films[id]` and its id in the carousel's order. Pure (returns a copy). */
export function withFilm(board, { carousel, id, entry, after, noOrder }) {
  const next = structuredClone(board);
  next.films[id] = entry;
  const order = next.carousels[carousel].order;
  if (!noOrder && !order.includes(id)) {
    order.splice(after ? order.indexOf(after) + 1 : order.length, 0, id);
  }
  return next;
}

/** The messages with the film's empty words: `site.home.films.<id>`. Pure (returns a copy). */
export function withStub(messages, id, { watch = false, replace = false } = {}) {
  const next = structuredClone(messages);
  const films = next.site.home.films;
  if (films[id] && !replace) {
    throw new Error(`site.home.films.${id} already exists`);
  }
  const stub = { caption: "", alt: "" };
  const watchStub = { watchLabel: "", transcript: { lead: "", lines: [""] } };
  const old = films[id] ?? {};
  // A film replaced keeps the words already written; only what is new is stubbed.
  films[id] = watch ? { ...stub, ...watchStub, ...old } : { ...stub, ...old };
  return next;
}

const run = (cmd, args) =>
  execFileSync(cmd, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], maxBuffer: 1 << 26 });

/** What the source is: size, length, and whether it has sound. */
export function probe(file) {
  const entries = "stream=codec_type,width,height:format=duration";
  const out = JSON.parse(run("ffprobe", ["-v", "error", "-show_entries", entries, "-of", "json", file]));
  const video = out.streams.find((s) => s.codec_type === "video");
  if (!video) {
    throw new Error(`${file} has no video stream`);
  }
  return {
    width: video.width,
    height: video.height,
    seconds: Number(out.format.duration),
    audio: out.streams.some((s) => s.codec_type === "audio"),
  };
}

/** The ffmpeg arguments of one cut (`span`: the part of the source to keep). Pure. */
export function cutArgs(source, out, cut, { audio, span }) {
  const seek = span ? ["-ss", String(span.start), "-t", String(span.end - span.start)] : [];
  const bufsize = `${Number.parseInt(cut.maxrate, 10) * 2}k`;
  return [
    ...["-v", "error", "-y", ...seek, "-i", source, "-map", "0:v:0"],
    ...(audio ? ["-map", "0:a:0"] : ["-an"]),
    ...["-vf", `scale=${cut.width}:${cut.height}:flags=lanczos,setsar=1`],
    ...["-c:v", "libx264", "-preset", "slow", "-profile:v", "high", "-pix_fmt", "yuv420p"],
    ...["-crf", String(cut.crf), "-maxrate", cut.maxrate, "-bufsize", bufsize],
    ...(audio ? ["-c:a", "aac", "-b:a", cut.audio, "-ac", "2"] : []),
    ...["-movflags", "+faststart", out],
  ];
}

/** The poster as a webp in `dir`: the given picture, else a frame of the film at `at` seconds. */
function renderPoster({ source, poster, at, dir, name }) {
  const still = join(dir, "poster.png");
  const scale = `scale=${POSTER.width}:${POSTER.height}:flags=lanczos`;
  const from = poster ? ["-i", poster] : ["-ss", String(at), "-i", source];
  run("ffmpeg", ["-v", "error", "-y", ...from, "-vf", scale, "-frames:v", "1", still]);
  const to = join(dir, name);
  run("cwebp", ["-quiet", "-q", String(POSTER.quality), still, "-o", to]);
  rmSync(still);
  return statSync(to).size;
}

/** Renders the files into `dir`; returns their sizes in bytes. */
export function render({ source, poster, dir, files, info, teaser, keepAudio }) {
  const sizes = {};
  const loopAudio = info.audio && (teaser ? keepAudio : true);
  const roles = [
    ["full", CUTS.full, { audio: loopAudio, span: teaser }],
    ["phone", CUTS.phone, { audio: loopAudio, span: teaser }],
    ...(teaser ? [["watch", CUTS.watch, { audio: info.audio }]] : []),
  ];
  for (const [role, cut, options] of roles) {
    const to = join(dir, files[role].name);
    run("ffmpeg", cutArgs(source, to, cut, options));
    sizes[role] = statSync(to).size;
  }
  const at = teaser ? teaser.start + 1 : info.seconds * 0.1;
  sizes.poster = renderPoster({ source, poster, at, dir, name: files.poster.name });
  return sizes;
}

/** The storage credentials as cdn-assets reads them, from `secret.sh` (never printed); the environment wins if set. */
export function credentials(source, env = process.env) {
  if (env.MEDIA_STORAGE_API_KEY) {
    return {};
  }
  const tools = run("kz-config", ["tools"]).trim();
  const fallback = join(homedir(), ".krizaka-worktrees/tools/secret.sh");
  const tool = existsSync(join(tools, "secret.sh")) ? join(tools, "secret.sh") : fallback;
  const out = {};
  for (const key of ["MEDIA_STORAGE_API_KEY", "MEDIA_STORAGE_ZONE", "MEDIA_STORAGE_ENDPOINT"]) {
    out[key] = run(tool, [source, key]).trim();
  }
  return out;
}

/** The default uploader: cdn-assets' own `upload`, which names the files by hash and records the manifest. */
export async function cdnUpload({ dir, to, root, secrets }) {
  const env = { ...process.env, ...credentials(secrets) };
  const code = await cdnMain(["upload", dir, "--to", to], { env, manifestFile: join(root, "lib/cdn-manifest.json") });
  if (code) {
    throw new Error("cdn-assets upload failed");
  }
}

const readJson = (file) => JSON.parse(readFileSync(file, "utf8"));
const writeJson = (file, value) => writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);

/** prettier decides the layout of the JSON files (inline short arrays), as `npm run format:check` does. */
function format(root, files) {
  const bin = join(REPO, "node_modules/.bin/prettier");
  if (existsSync(bin)) {
    run(bin, ["--write", ...files.map((f) => join(root, f))]);
  }
}

const mb = (n) => `${(n / 1048576).toFixed(1)} MB`;

function checkSources({ source, poster }, info) {
  if (!isSixteenNine(info.width, info.height)) {
    throw new Error(`${source} is ${info.width}x${info.height}, not 16:9`);
  }
  if (poster) {
    const p = probe(poster);
    if (!isSixteenNine(p.width, p.height)) {
      throw new Error(`${poster} is ${p.width}x${p.height}, not 16:9`);
    }
  }
}

/** The storyboard entry of a film. */
function entryOf({ files, info, teaser, keepAudio, idea, id, today }) {
  const cuts = `${CUTS.full.width}x${CUTS.full.height} H.264 crf ${CUTS.full.crf} (max ${CUTS.full.maxrate})`;
  const phone = `${CUTS.phone.width}x${CUTS.phone.height} (max ${CUTS.phone.maxrate}) for phones`;
  const entry = {
    base: files.base,
    idea: idea ?? id,
    made: `added with scripts/showcase-add.mjs (krizaka-internal#2876); the source film is ${info.width}x${info.height}, ${Math.round(info.seconds)} s`,
    cut: `${cuts}, ${phone}, a webp poster; no webm`,
    audio: info.audio && (teaser ? keepAudio : true),
  };
  if (teaser) {
    entry.cut += `; the loop is ${teaser.start}-${teaser.end} s of the film`;
    entry.watch = { mp4: files.watch.logical, seconds: Math.round(info.seconds), uploadDate: today, audio: info.audio };
  }
  return entry;
}

/**
 * Adds a film to a carousel. `root` holds content/, messages/ and lib/cdn-manifest.json (the repository by default).
 * `upload` and `today` are injectable for the tests. Returns what was (or, with dryRun, would be) done.
 */
export async function addFilm(opts) {
  const { carousel, id, source, poster, after, noOrder, replace, idea, product, keepAudio = false } = opts;
  const {
    dryRun = false,
    root = REPO,
    secrets = "@dev",
    upload = cdnUpload,
    today = new Date().toISOString().slice(0, 10),
  } = opts;
  const storyboard = join(root, "content/films/home-showcase.json");
  const board = readJson(storyboard);
  const problems = argProblems(opts, board);
  for (const f of [source, poster].filter(Boolean)) {
    if (!existsSync(f)) {
      problems.push(`${f} does not exist`);
    }
  }
  if (problems.length > 0) {
    throw new Error(problems.join("\n"));
  }
  const info = probe(source);
  checkSources({ source, poster }, info);
  const teaser = opts.teaser === undefined ? undefined : parseTeaser(opts.teaser);
  if (teaser && teaser.end > info.seconds) {
    throw new Error(`--teaser ends at ${teaser.end} s, the film is ${Math.round(info.seconds)} s`);
  }
  if (!teaser && info.seconds > MAX_LOOP_SECONDS) {
    throw new Error(
      `${Math.round(info.seconds)} s: no full film plays in a carousel, give --teaser <start>-<end> (at most ${MAX_TEASER_SECONDS} s)`,
    );
  }
  const files = plan({ id, carousel, product });
  const was = replace ? board.films[id] : undefined;
  const fresh = entryOf({ files, info, teaser, keepAudio, idea: idea ?? was?.idea, id, today });
  // A film replaced keeps what was written about its making.
  const entry = was?.made ? { ...fresh, made: was.made } : fresh;
  const roles = teaser ? [files.full, files.phone, files.poster, files.watch] : [files.full, files.phone, files.poster];
  const next = withFilm(board, { carousel, id, entry, after, noOrder });
  const result = {
    dryRun,
    files: roles.map((f) => f.logical),
    manifestKeys: roles.map((f) => f.logical),
    entry,
    order: next.carousels[carousel].order,
    stubs: ["en", "fr"].map((l) => `messages/${l}.json site.home.films.${id}`),
  };
  if (dryRun) {
    return result;
  }
  const dir = mkdtempSync(join(tmpdir(), `showcase-add-${id}-`));
  try {
    result.sizes = render({ source, poster, dir, files, info, teaser, keepAudio });
    await upload({ dir, to: files.to, root, secrets });
    const manifest = readJson(join(root, "lib/cdn-manifest.json"));
    const missing = result.manifestKeys.filter((k) => !manifest.files[k]);
    if (missing.length > 0) {
      throw new Error(`not in lib/cdn-manifest.json after the upload: ${missing.join(", ")}`);
    }
    writeJson(storyboard, next);
    for (const lang of ["en", "fr"]) {
      const file = join(root, `messages/${lang}.json`);
      writeJson(file, withStub(readJson(file), id, { watch: Boolean(teaser), replace }));
    }
    format(root, ["content/films/home-showcase.json", "messages/en.json", "messages/fr.json"]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  return result;
}

const USAGE = `usage: node scripts/showcase-add.mjs <carousel> <id> <source.mp4> [--teaser <start>-<end> [--keep-audio]] [--poster file.jpg] [--after <id> | --no-order] [--replace] [--idea "…"] [--product <p>] [--secrets @dev] [--dry-run]`;
const FLAGS = ["--dry-run", "--no-order", "--replace", "--keep-audio"];

async function cli(argv) {
  const args = parseArgs(argv.filter((a) => !FLAGS.includes(a)));
  const [carousel, id, source] = args._;
  if (args.help || !carousel) {
    console.log(USAGE);
    return args.help ? 0 : 1;
  }
  const r = await addFilm({
    carousel,
    id,
    source: source && resolve(source),
    poster: args.poster && resolve(args.poster),
    teaser: args.teaser,
    after: args.after,
    idea: args.idea,
    product: args.product,
    secrets: args.secrets,
    dryRun: argv.includes("--dry-run"),
    noOrder: argv.includes("--no-order"),
    replace: argv.includes("--replace"),
    keepAudio: argv.includes("--keep-audio"),
  });
  console.log(`${r.dryRun ? "dry run, nothing written" : "done"}: ${carousel}/${id}`);
  console.log(["  files + manifest keys:", ...r.files.map((f) => "    " + f)].join("\n"));
  console.log(`  storyboard: films.${id} = ${JSON.stringify(r.entry)}\n  order of ${carousel}: ${r.order.join(", ")}`);
  console.log(`  message stubs (empty: the build refuses them until written): ${r.stubs.join("; ")}`);
  if (r.sizes) {
    const parts = Object.entries(r.sizes).map(([k, n]) => `${k} ${mb(n)}`);
    console.log(`  sizes: ${parts.join(", ")}`);
  }
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  cli(process.argv.slice(2)).then(
    (code) => process.exit(code),
    (e) => {
      console.error(`showcase-add: ${e.message}`);
      process.exit(1);
    },
  );
}
