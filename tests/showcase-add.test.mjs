import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  MAX_LOOP_SECONDS,
  MAX_TEASER_SECONDS,
  REPO,
  addFilm,
  argProblems,
  cutArgs,
  parseTeaser,
  plan,
  probe,
  withFilm,
  withStub,
} from "../scripts/showcase-add.mjs";

// scripts/showcase-add.mjs (krizaka-internal#2876): one command adds a finished film to a carousel. Its pure parts are tested
// directly; the whole run on a synthetic 14 s film (ffmpeg, cwebp) with the upload replaced by a stub that records the
// manifest like cdn-assets does. Nothing here touches Bunny or the company folder.

const tools = ["ffmpeg", "ffprobe", "cwebp"].every((t) => {
  try {
    execFileSync(t, ["-version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
});
const board = JSON.parse(readFileSync(join(REPO, "content/films/home-showcase.json"), "utf8"));

/** A copy of what the script writes (storyboard, messages, manifest) in a temp folder. */
function sandbox() {
  const root = mkdtempSync(join(tmpdir(), "showcase-add-test-"));
  for (const f of [
    "content/films/home-showcase.json",
    "messages/en.json",
    "messages/fr.json",
    "lib/cdn-manifest.json",
  ]) {
    mkdirSync(join(root, f, ".."), { recursive: true });
    cpSync(join(REPO, f), join(root, f));
  }
  return root;
}
const snapshot = (root) =>
  ["content/films/home-showcase.json", "messages/en.json", "messages/fr.json", "lib/cdn-manifest.json"].map((f) =>
    readFileSync(join(root, f), "utf8"),
  );

/** A synthetic 16:9 film with sound: a test pattern and a tone. */
function film(dir, seconds, size = "320x180") {
  const file = join(dir, `src-${seconds}.mp4`);
  execFileSync(
    "ffmpeg",
    ["-v", "error", "-y", "-f", "lavfi", "-i", `testsrc=size=${size}:rate=10:duration=${seconds}`].concat([
      "-f",
      "lavfi",
      "-i",
      `sine=frequency=440:duration=${seconds}`,
      "-c:v",
      "libx264",
      "-c:a",
      "aac",
      "-shortest",
      file,
    ]),
  );
  return file;
}

test("a teaser is a range of seconds, at most 10 s; a film over 12 s needs one", () => {
  assert.deepEqual(parseTeaser("44-53"), { start: 44, end: 53 });
  assert.deepEqual(parseTeaser("1.5-9"), { start: 1.5, end: 9 });
  assert.equal(parseTeaser("44"), undefined);
  assert.equal(parseTeaser("a-b"), undefined);
  assert.equal(MAX_TEASER_SECONDS, 10);
  assert.ok(MAX_LOOP_SECONDS > MAX_TEASER_SECONDS);
  const base = { carousel: "sovkora", id: "new-one", source: "x.mp4" };
  assert.deepEqual(argProblems({ ...base, teaser: "10-20" }, board), []);
  assert.match(argProblems({ ...base, teaser: "10-21" }, board)[0], /at most 10 s/);
  assert.match(argProblems({ ...base, teaser: "20-10" }, board)[0], /<start>-<end>/);
});

test("the arguments are checked against the storyboard: carousel, id, taken ids, --after", () => {
  const ok = { carousel: "sovkora", id: "new-one", source: "x.mp4" };
  assert.deepEqual(argProblems(ok, board), []);
  assert.match(argProblems({ ...ok, carousel: "nope" }, board)[0], /not one of hero, sovkora, verikora, folioviv/);
  assert.match(argProblems({ ...ok, id: "Bad Id" }, board)[0], /lower-case words/);
  assert.match(argProblems({ ...ok, id: "pigeon" }, board)[0], /already in the storyboard/, "a slide's id");
  assert.match(argProblems({ ...ok, id: "trailer" }, board)[0], /already in the storyboard/, "a film's id");
  assert.deepEqual(argProblems({ ...ok, id: "trailer", replace: true }, board), [], "--replace re-renders a film");
  assert.match(argProblems({ ...ok, replace: true }, board)[0], /not a film of the storyboard/);
  assert.match(argProblems({ ...ok, after: "ghost" }, board)[0], /not in the order of sovkora/);
  assert.match(argProblems({ ...ok, after: "trailer", noOrder: true }, board)[0], /do not go together/);
});

test("the files are named like the trailer's, under products/<product>/films/, the hero's films being Sovkora's", () => {
  const p = plan({ id: "dossier-nadia", carousel: "sovkora" });
  assert.deepEqual(
    [p.full.logical, p.phone.logical, p.poster.logical, p.watch.logical],
    [
      "products/sovkora/films/dossier-nadia.mp4",
      "products/sovkora/films/dossier-nadia-720.mp4",
      "products/sovkora/films/dossier-nadia-poster.webp",
      "products/sovkora/films/dossier-nadia-full.mp4",
    ],
  );
  assert.equal(p.base, "products/sovkora/films/dossier-nadia");
  assert.equal(plan({ id: "x", carousel: "hero" }).to, "products/sovkora/films");
  assert.equal(plan({ id: "x", carousel: "verikora" }).to, "products/verikora/films");
  assert.equal(plan({ id: "x", carousel: "hero", product: "folioviv" }).to, "products/folioviv/films");
});

test("the cuts are H.264 faststart at web bitrates, keep the sound when asked, and cut a span", () => {
  const args = cutArgs(
    "in.mp4",
    "out.mp4",
    { width: 1280, height: 720, crf: 27, maxrate: "1400k", audio: "96k" },
    { audio: true },
  );
  assert.ok(args.includes("libx264") && args.includes("+faststart") && args.includes("aac"));
  assert.equal(args[args.indexOf("-maxrate") + 1], "1400k");
  assert.equal(args[args.indexOf("-bufsize") + 1], "2800k");
  const mute = cutArgs(
    "in.mp4",
    "out.mp4",
    { width: 854, height: 480, crf: 29, maxrate: "650k", audio: "64k" },
    { audio: false, span: { start: 44, end: 53 } },
  );
  assert.ok(mute.includes("-an") && !mute.includes("aac"));
  assert.deepEqual(mute.slice(mute.indexOf("-ss"), mute.indexOf("-ss") + 4), ["-ss", "44", "-t", "9"]);
  assert.ok(mute.indexOf("-ss") < mute.indexOf("-i"), "an input seek: fast and exact once re-encoded");
});

test("the storyboard gets the film and its id in the order; the messages get empty words the build refuses", () => {
  const entry = { base: "products/sovkora/films/x", idea: "x", audio: false };
  const end = withFilm(board, { carousel: "sovkora", id: "x", entry });
  assert.deepEqual(end.carousels.sovkora.order.at(-1), "x");
  const after = withFilm(board, { carousel: "sovkora", id: "x", entry, after: "trailer" });
  assert.deepEqual(after.carousels.sovkora.order.slice(0, 2), ["trailer", "x"]);
  const none = withFilm(board, { carousel: "sovkora", id: "x", entry, noOrder: true });
  assert.deepEqual(none.carousels.sovkora.order, board.carousels.sovkora.order, "--no-order leaves every order alone");
  assert.deepEqual(none.films.x, entry);
  assert.equal(board.films.x, undefined, "the input is not changed");
  const en = JSON.parse(readFileSync(join(REPO, "messages/en.json"), "utf8"));
  assert.deepEqual(withStub(en, "x").site.home.films.x, { caption: "", alt: "" });
  const stub = withStub(en, "x", { watch: true }).site.home.films.x;
  assert.deepEqual(stub, { caption: "", alt: "", watchLabel: "", transcript: { lead: "", lines: [""] } });
  assert.throws(() => withStub(en, "trailer"), /already exists/);
  assert.equal(
    withStub(en, "trailer", { watch: true, replace: true }).site.home.films.trailer.caption,
    en.site.home.films.trailer.caption,
    "a film replaced keeps its words",
  );
});

test(
  "a dry run writes nothing and says the files, manifest keys, storyboard entry, order and message stubs",
  { skip: !tools },
  async () => {
    const root = sandbox();
    const src = film(root, 14);
    const before = snapshot(root);
    const r = await addFilm({
      carousel: "sovkora",
      id: "new-one",
      source: src,
      teaser: "2-9",
      after: "trailer",
      root,
      dryRun: true,
      today: "2026-11-07",
    });
    assert.deepEqual(snapshot(root), before, "nothing written");
    assert.equal(r.dryRun, true);
    assert.deepEqual(r.manifestKeys, [
      "products/sovkora/films/new-one.mp4",
      "products/sovkora/films/new-one-720.mp4",
      "products/sovkora/films/new-one-poster.webp",
      "products/sovkora/films/new-one-full.mp4",
    ]);
    assert.equal(r.entry.audio, false, "a loop is silent unless --keep-audio");
    assert.deepEqual(r.entry.watch, {
      mp4: "products/sovkora/films/new-one-full.mp4",
      seconds: 14,
      uploadDate: "2026-11-07",
      audio: true,
    });
    assert.match(r.entry.cut, /the loop is 2-9 s of the film/);
    assert.deepEqual(r.order.slice(0, 2), ["trailer", "new-one"]);
    assert.deepEqual(r.stubs, ["messages/en.json site.home.films.new-one", "messages/fr.json site.home.films.new-one"]);
    assert.equal(
      (
        await addFilm({
          carousel: "sovkora",
          id: "new-one",
          source: src,
          teaser: "2-9",
          keepAudio: true,
          root,
          dryRun: true,
        })
      ).entry.audio,
      true,
    );
    assert.equal(
      (
        await addFilm({
          carousel: "sovkora",
          id: "new-one",
          source: src,
          teaser: "2-9",
          noOrder: true,
          root,
          dryRun: true,
        })
      ).order.includes("new-one"),
      false,
    );
    rmSync(root, { recursive: true, force: true });
  },
);

test(
  "no full film plays in a carousel: a source over 12 s without --teaser is refused; so is a teaser past the end",
  { skip: !tools },
  async () => {
    const root = sandbox();
    const long = film(root, 14);
    await assert.rejects(
      addFilm({ carousel: "sovkora", id: "new-one", source: long, root, dryRun: true }),
      /no full film plays in a carousel/,
    );
    await assert.rejects(
      addFilm({ carousel: "sovkora", id: "new-one", source: long, teaser: "8-17", root, dryRun: true }),
      /ends at 17 s/,
    );
    const short = film(root, 5);
    const r = await addFilm({ carousel: "sovkora", id: "new-one", source: short, root, dryRun: true });
    assert.equal(r.entry.watch, undefined, "a short film is its own loop, with no watch page");
    assert.equal(r.manifestKeys.length, 3);
    const tall = join(root, "tall.mp4");
    execFileSync("ffmpeg", [
      "-v",
      "error",
      "-y",
      "-f",
      "lavfi",
      "-i",
      "testsrc=size=180x320:rate=10:duration=2",
      "-c:v",
      "libx264",
      tall,
    ]);
    await assert.rejects(addFilm({ carousel: "sovkora", id: "new-one", source: tall, root, dryRun: true }), /not 16:9/);
    rmSync(root, { recursive: true, force: true });
  },
);

test(
  "the whole run renders the cuts, uploads them, records the manifest, edits the storyboard and the messages",
  { skip: !tools },
  async () => {
    const root = sandbox();
    const src = film(root, 14);
    const seen = [];
    const upload = async ({ dir, to }) => {
      const names = readdirSync(dir).sort();
      seen.push({
        to,
        names,
        probes: names.filter((n) => n.endsWith(".mp4")).map((n) => ({ n, ...probe(join(dir, n)) })),
      });
      const manifest = JSON.parse(readFileSync(join(root, "lib/cdn-manifest.json"), "utf8"));
      for (const n of names) manifest.files[`${to}/${n}`] = "0123456789";
      writeFileSync(join(root, "lib/cdn-manifest.json"), JSON.stringify(manifest, null, 2));
    };
    const r = await addFilm({
      carousel: "sovkora",
      id: "new-one",
      source: src,
      teaser: "2-9",
      after: "trailer",
      root,
      upload,
      today: "2026-11-07",
    });
    const [{ to, names, probes }] = seen;
    assert.equal(to, "products/sovkora/films");
    assert.deepEqual(names, ["new-one-720.mp4", "new-one-full.mp4", "new-one-poster.webp", "new-one.mp4"]);
    const by = Object.fromEntries(probes.map((p) => [p.n, p]));
    assert.deepEqual([by["new-one.mp4"].width, by["new-one.mp4"].height], [1280, 720]);
    assert.deepEqual([by["new-one-720.mp4"].width, by["new-one-720.mp4"].height], [854, 480]);
    assert.deepEqual([by["new-one-full.mp4"].width, by["new-one-full.mp4"].height], [1280, 720]);
    assert.ok(Math.abs(by["new-one.mp4"].seconds - 7) < 0.6, "the loop is the 7 s asked");
    assert.ok(Math.abs(by["new-one-full.mp4"].seconds - 14) < 0.6, "the whole film is whole");
    assert.equal(by["new-one.mp4"].audio, false, "the loop is silent");
    assert.equal(by["new-one-full.mp4"].audio, true, "the whole film keeps its sound");
    assert.ok(r.sizes.full > 0 && r.sizes.watch > 0 && r.sizes.poster > 0);
    const next = JSON.parse(readFileSync(join(root, "content/films/home-showcase.json"), "utf8"));
    assert.deepEqual(next.carousels.sovkora.order.slice(0, 2), ["trailer", "new-one"]);
    assert.equal(next.films["new-one"].watch.seconds, 14);
    for (const l of ["en", "fr"]) {
      const m = JSON.parse(readFileSync(join(root, `messages/${l}.json`), "utf8")).site.home.films["new-one"];
      assert.deepEqual(m, { caption: "", alt: "", watchLabel: "", transcript: { lead: "", lines: [""] } });
    }
    assert.ok(existsSync(join(REPO, "scripts/showcase-add.mjs")));
    rmSync(root, { recursive: true, force: true });
  },
);

test(
  "an upload that does not record the manifest stops the run before the storyboard or the messages change",
  { skip: !tools },
  async () => {
    const root = sandbox();
    const src = film(root, 5);
    const before = snapshot(root);
    await assert.rejects(
      addFilm({ carousel: "sovkora", id: "new-one", source: src, root, upload: async () => {} }),
      /not in lib\/cdn-manifest\.json after the upload/,
    );
    assert.deepEqual(snapshot(root), before);
    rmSync(root, { recursive: true, force: true });
  },
);
