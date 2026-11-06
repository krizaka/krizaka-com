import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { SHOWCASES, showcaseSlides } from "../lib/home-showcase.ts";
import {
  blackEndCard,
  guardedSlides,
  isSixteenNine,
  letterboxed,
  pillarboxed,
  problemsOf,
} from "../scripts/check-showcase-media.mjs";

// The carousels' real media (founder, 2026-11-05): a « wide » key is not enough, the file must be a clean 16:9.
const board = JSON.parse(readFileSync(new URL("../content/films/home-showcase.json", import.meta.url), "utf8"));
const LIVE = Boolean(process.env.KRIZAKA_CHECK_MEDIA);

test("a real 16:9 is told from a vertical frame, a pillarboxed picture and a black end card", () => {
  assert.ok(isSixteenNine(1280, 720));
  assert.ok(!isSixteenNine(720, 1280));
  assert.ok(!isSixteenNine(544, 680));
  // Peak luma per band of each frame (@krizaka/ui's media guard): bars on both sides, or above and below, of a picture.
  const band = (left, right, centre, top = 200, bottom = 200, middle = 200) => ({
    left,
    right,
    centre,
    top,
    bottom,
    middle,
  });
  const frames = [band(200, 210, 250), band(4, 6, 240), band(10, 12, 8), band(200, 200, 200, 3, 5, 220)];
  assert.equal(pillarboxed(frames).length, 1);
  assert.equal(letterboxed(frames).length, 1);
  assert.ok(blackEndCard(2));
  assert.ok(!blackEndCard(40));
});

test("a slide retired for an artefact is out of its order, with its reason", () => {
  for (const [name, c] of Object.entries(board.carousels)) {
    for (const r of c.retired ?? []) {
      assert.ok(!c.order.includes(r.id), `${name}/${r.id} is retired and still in the order`);
      assert.ok(r.why.length > 20, `${name}/${r.id}: say why`);
    }
  }
  const retired = Object.values(board.carousels).flatMap((c) => (c.retired ?? []).map((r) => r.id));
  assert.deepEqual(retired.sort(), [
    "bridge",
    "duck",
    "files",
    "first-client",
    "ink",
    "loupe",
    "morning",
    "neon",
    "notebook",
    "rag",
    "signature",
  ]);
  for (const c of SHOWCASES) {
    assert.ok(showcaseSlides(c).length >= 3, c);
  }
});

test("the guard reads every slide's real poster, webm and mp4, and its audio claim", () => {
  for (const c of SHOWCASES) {
    for (const s of guardedSlides(c)) {
      assert.match(s.src, /^https:\/\/.+\.jpg$/, s.id);
      assert.match(s.video.webm, /\.webm$/, s.id);
      assert.match(s.video.mp4, /\.mp4$/, s.id);
      assert.equal(typeof s.audio, "boolean", s.id);
    }
  }
});

// The real files: HTTP 200 and type, ffprobe's width and height, codecs, no pillarbox, no black end card, no audio.
// Needs the network, ffmpeg and ffprobe: the container smoke runs it with KRIZAKA_CHECK_MEDIA=1; `npm test` stays offline.
for (const carousel of SHOWCASES) {
  test(`${carousel}: every media file is real, 16:9 and clean`, { skip: !LIVE }, async () => {
    assert.deepEqual(await problemsOf(carousel), []);
  });
}
