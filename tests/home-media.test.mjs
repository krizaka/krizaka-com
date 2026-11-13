import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { emptySnapshot, homeMediaProblems } from "../scripts/home-media-lib.mjs";
import { audioTracksOf, soundControlProblems } from "../scripts/sound-control-lib.mjs";

const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");

// krizaka-internal#3243: the home mounts no <video> at load, each section shows at most one moving image and only on demand.
test("a home with nothing moving is clean", () => {
  assert.deepEqual(homeMediaProblems(emptySnapshot(), "/fr"), []);
});

test("a <video>, a carousel, a sound or pause control or a video request on the home is each a problem", () => {
  const dirty = { videos: 1, carousels: 1, soundControls: 1, pauseControls: 1, mediaRequests: ["https://cdn/x.mp4"] };
  const problems = homeMediaProblems(dirty, "/en 360px");
  assert.equal(problems.length, 5);
  assert.ok(problems.every((p) => p.startsWith("/en 360px: ")));
});

test("a sound control on a silent file, and a file with sound and no control, are problems; the rest is fine", () => {
  const ok = [
    { page: "/en/films/a", file: "a.mp4", audioTracks: 1, control: true },
    { page: "/en/story", file: "loop.mp4", audioTracks: 0, control: false },
  ];
  assert.deepEqual(soundControlProblems(ok), []);
  const bad = soundControlProblems([
    { page: "/en/story", file: "loop.mp4", audioTracks: 0, control: true },
    { page: "/en/films/a", file: "a.mp4", audioTracks: 2, control: false },
  ]);
  assert.equal(bad.length, 2);
  assert.match(bad[0], /sound control sits on a silent file/);
  assert.match(bad[1], /has sound and no control/);
});

test("the audio tracks are counted from ffprobe's streams, and a probe with none reads as silent", () => {
  assert.equal(audioTracksOf({ streams: [{ codec_type: "video" }, { codec_type: "audio" }] }), 1);
  assert.equal(audioTracksOf({ streams: [{ codec_type: "video" }] }), 0);
  assert.equal(audioTracksOf({}), 0);
});

test("the container smoke runs both checks, and the home is wired to none of the players", () => {
  const smoke = read("scripts/ci-container-smoke.sh");
  assert.match(smoke, /node scripts\/check-showcase-player\.mjs/);
  assert.match(smoke, /check-sound-control\.mjs/);
  for (const f of [
    "app/[locale]/page.tsx",
    "app/components/home/HomeHero.tsx",
    "app/components/home/ProductShowcase.tsx",
  ])
    assert.doesNotMatch(read(f), /media-carousel|media-player|video-player|pausable-loop/, f);
});
