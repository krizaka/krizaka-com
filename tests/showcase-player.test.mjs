import { test } from "node:test";
import assert from "node:assert/strict";
import { DWELL_MS, initialPlayer, pickSources, playerView, stepPlayer } from "../lib/showcase-player.ts";
import { hasJsx, jsxAll } from "./helpers/source.mjs";

// The home's carousels with real films (krizaka-internal#2837, founder 2026-11-07): « le temps est fixe et non adapté à la
// vidéo ; si la vidéo est plus petite il attend à la fin avec la dernière image ». A video slide lasts as long as its video,
// sound comes only from the visitor's click, and reduced motion shows a still with a play button.
const VIDEO = { video: true, audio: false };
const FILM = { video: true, audio: true };
const STILL = { video: false, audio: false };
const env = (slides, over = {}) => ({ slides, still: false, loaded: true, ...over });
const run = (slides, events, envOver = {}) =>
  events.reduce((s, e) => stepPlayer(s, e, env(slides, envOver)), initialPlayer());
const onScreen = { type: "screen", on: true };

test("a video slide advances on its clip's end, never on a timer; a still slide keeps the fixed dwell", () => {
  const slides = [FILM, VIDEO, STILL];
  let s = run(slides, [onScreen]);
  assert.equal(playerView(s, env(slides)).clock, "ended", "the film waits for its end, however long");
  assert.equal(playerView(s, env(slides)).playing, true);
  s = stepPlayer(s, { type: "ended" }, env(slides));
  assert.equal(s.active, 1, "its end moves the carousel on: no last frame held");
  assert.equal(playerView(s, env(slides)).clock, "ended");
  s = stepPlayer(s, { type: "ended" }, env(slides));
  assert.equal(s.active, 2);
  assert.equal(playerView(s, env(slides)).clock, "dwell", "a still slide stays the fixed time");
  assert.equal(DWELL_MS, 6500);
  s = stepPlayer(s, { type: "dwell" }, env(slides));
  assert.equal(s.active, 0, "and the carousel comes back to the film");
});

test("a clip that cannot play is a still: the poster stays and the dwell moves the carousel on", () => {
  const slides = [VIDEO, VIDEO, VIDEO];
  const s = run(slides, [onScreen, { type: "broken", slide: 0 }]);
  const v = playerView(s, env(slides));
  assert.equal(v.clip, false, "no video element left");
  assert.equal(v.clock, "dwell");
});

test("before the page's load and before the carousel is on screen, no clip is mounted and nothing moves on", () => {
  const slides = [FILM, VIDEO, VIDEO];
  assert.equal(playerView(run(slides, [onScreen]), env(slides, { loaded: false })).clip, false, "the h1 stays the LCP");
  const offscreen = playerView(initialPlayer(), env(slides));
  assert.equal(offscreen.clip, false, "a carousel below the fold downloads no film");
  assert.equal(offscreen.clock, "none");
});

test("the pointer or the focus holds the carousel and pauses the clip, which resumes when they leave", () => {
  const slides = [FILM, VIDEO, VIDEO];
  for (const held of [
    { type: "hover", on: true },
    { type: "focus", on: true },
  ]) {
    let s = run(slides, [onScreen, held]);
    assert.deepEqual([playerView(s, env(slides)).playing, playerView(s, env(slides)).clock], [false, "none"]);
    assert.equal(playerView(s, env(slides)).clip, true, "paused, not unmounted: it resumes where it was");
    s = stepPlayer(s, { ...held, on: false }, env(slides));
    assert.deepEqual([playerView(s, env(slides)).playing, playerView(s, env(slides)).clock], [true, "ended"]);
  }
});

test("off screen it holds and mutes; the visitor's pause holds it until play", () => {
  const slides = [FILM, VIDEO, VIDEO];
  let s = run(slides, [onScreen, { type: "sound" }, { type: "screen", on: false }]);
  const away = playerView(s, env(slides));
  assert.deepEqual([away.playing, away.audible, away.clock], [false, false, "none"]);
  assert.equal(s.sound, false, "scrolled away: the sound is off again");
  s = run(slides, [onScreen, { type: "toggle" }]);
  assert.deepEqual([playerView(s, env(slides)).playing, playerView(s, env(slides)).clock], [false, "none"]);
  s = stepPlayer(s, { type: "toggle" }, env(slides));
  assert.equal(playerView(s, env(slides)).playing, true);
});

test("sound only after the visitor's click, for the film in view while it plays on screen", () => {
  const slides = [FILM, VIDEO, VIDEO];
  let s = run(slides, [onScreen, { type: "hover", on: true }, { type: "focus", on: true }]);
  assert.equal(
    playerView(s, env(slides)).audible,
    false,
    "never sound before a click: hover and focus are not a click",
  );
  assert.equal(playerView(s, env(slides)).soundControl, true, "the film shows its sound control");
  s = stepPlayer(s, { type: "sound" }, env(slides));
  const on = playerView(s, env(slides));
  assert.deepEqual(
    [on.audible, on.playing],
    [true, true],
    "the click turns it on, and the film plays on under the pointer",
  );
  s = stepPlayer(s, { type: "ended" }, env(slides));
  assert.equal(s.sound, false, "another slide is muted again");
  assert.equal(playerView(s, env(slides)).soundControl, false, "a silent clip shows no sound control");
  s = run(slides, [onScreen, { type: "sound" }, { type: "go", to: 1 }]);
  assert.equal(s.sound, false, "previous / next mute too");
  s = run(slides, [onScreen, { type: "sound" }, { type: "sound" }]);
  assert.equal(playerView(s, env(slides)).audible, false, "a second click turns it off");
});

test("reduced motion: the poster and a play button; nothing starts or moves on by itself; the end brings the poster back", () => {
  const slides = [FILM, VIDEO, STILL];
  const still = env(slides, { still: true });
  let s = run(slides, [onScreen], { still: true });
  const rest = playerView(s, still);
  assert.deepEqual(
    [rest.clip, rest.playing, rest.clock, rest.playButton, rest.pauseControl, rest.soundControl],
    [false, false, "none", true, false, false],
  );
  s = stepPlayer(s, { type: "watch" }, still);
  const watching = playerView(s, still);
  assert.deepEqual(
    [watching.clip, watching.playing, watching.playButton, watching.audible],
    [true, true, false, false],
  );
  assert.equal(watching.clock, "none", "the visitor's film plays, the carousel still does not move on");
  s = stepPlayer(s, { type: "ended" }, still);
  assert.equal(s.active, 0, "it stays on its slide");
  assert.deepEqual([playerView(s, still).clip, playerView(s, still).playButton], [false, true], "the poster again");
  assert.equal(playerView(run(slides, [onScreen, { type: "go", to: 2 }], { still: true }), still).playButton, false);
});

test("a clip unmounts when the carousel leaves the viewport: one decoder at a time", () => {
  // Guard for krizaka-internal#2946: s.shown used to stay true forever, keeping the <video> mounted
  // even when off screen. With 4 carousels on the home, 4 decoders ran simultaneously at page load.
  const slides = [FILM, VIDEO, STILL];
  // Carousel comes into view, clip mounts, then it leaves the viewport.
  const gone = run(slides, [onScreen, { type: "screen", on: false }]);
  const v = playerView(gone, env(slides));
  assert.equal(v.clip, false, "clip unmounts once the carousel is off screen");
  assert.equal(v.playing, false);
  assert.equal(v.clock, "none");
  // Comes back into view: clip remounts and plays.
  const back = stepPlayer(gone, { type: "screen", on: true }, env(slides));
  assert.equal(playerView(back, env(slides)).clip, true, "clip remounts when the carousel re-enters the viewport");
});

test("the arrows and previous / next wrap around and remember the posters already shown", () => {
  const slides = [VIDEO, VIDEO, VIDEO];
  const s = run(slides, [onScreen, { type: "go", to: -1 }]);
  assert.equal(s.active, 2);
  assert.deepEqual([...s.seen].sort(), [0, 2]);
});

test("the phone gets the light cut, a wider screen the full one: chosen once on the client, in every browser", () => {
  // `<source media>` on a video is ignored by Chrome and Firefox before 120, inside Next 16's floor (Chrome 111,
  // Firefox 111): the client picks the sources itself before mounting the clip.
  const film = [
    { src: "trailer-720.mp4", type: "video/mp4", media: "(max-width: 767px)" },
    { src: "trailer.mp4", type: "video/mp4" },
  ];
  const phone = (q) => q === "(max-width: 767px)";
  assert.deepEqual(
    pickSources(film, phone).map((x) => x.src),
    ["trailer-720.mp4", "trailer.mp4"],
  );
  assert.deepEqual(
    pickSources(film, () => false).map((x) => x.src),
    ["trailer.mp4"],
  );
  const clip = [
    { src: "a.webm", type: "video/webm" },
    { src: "a.mp4", type: "video/mp4" },
  ];
  assert.deepEqual(
    pickSources(clip, () => false),
    clip,
    "a clip without a phone cut keeps both encodes",
  );
});

test("the carousel's video never loops, starts muted inline, and moves on at its end", () => {
  const file = "app/components/home/ShowcaseCarousel.tsx";
  const [video] = jsxAll(file, "video");
  assert.ok(video, "one video element");
  assert.equal(video.attrs.loop, undefined, "no loop");
  assert.equal(video.attrs.autoPlay, undefined, "played by the player, not by the attribute");
  assert.equal(video.attrs.muted, true);
  assert.equal(video.attrs.playsInline, true);
  assert.match(String(video.attrs.onEnded), /\{.+\}/, "its end is listened to");
  assert.ok(hasJsx(file, "IconButton", { "aria-pressed": "{state.sound}" }), "the sound control says its state");
});
