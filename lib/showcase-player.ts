/* How a carousel of the home plays its slides (ShowcaseCarousel; krizaka-internal#2450, #2837), as pure data so it is
   tested without a browser (tests/showcase-player.test.mjs). Founder, 2026-11-07: « le temps est fixe et non adapté à la
   vidéo ; si la vidéo est plus petite il attend à la fin avec la dernière image ».
   - A video slide lasts as long as its video: the carousel moves on at the clip's end (`ended`), and a clip never loops,
     so no last frame is held. A still slide, or a clip that cannot play, stays DWELL_MS.
   - The pointer or the keyboard focus in the carousel holds it, the clip included (paused, then resumed where it was), until
     the visitor acts on the slide in view (sound, play): then it is theirs and plays on. Off screen everything holds.
   - Sound only after the visitor's click on its control, for the film in view while it plays on screen: another slide or
     scrolling away mutes it again.
   - The clip is mounted only after the page's load (the LCP is a poster, never a clip) and once the carousel has been on screen (a
     carousel below the fold downloads no film).
   - Under reduced motion (or Save-Data) nothing moves on and no clip starts by itself: the poster and, on a video slide, a
     play button; at the clip's end the poster comes back. */

// @fixed: how long a still slide stays before the next one, a reading time (a caption), not a setting.
export const DWELL_MS = 6500;

/** What the player needs to know of a slide. */
export interface PlayerSlide {
  video: boolean;
  audio: boolean;
}

/** What the page says about the visitor and the page: reduced motion (or Save-Data), and the page's load. */
export interface PlayerEnv {
  slides: readonly PlayerSlide[];
  still: boolean;
  loaded: boolean;
}

export interface PlayerState {
  active: number;
  /** The slides already shown: their posters stay drawn. */
  seen: readonly number[];
  /** The visitor's pause. */
  stopped: boolean;
  hovered: boolean;
  focused: boolean;
  onScreen: boolean;
  /** The carousel has been on screen once. */
  shown: boolean;
  /** The visitor acted on the slide in view (sound, play): the pointer and the focus no longer hold it. */
  engaged: boolean;
  /** The visitor turned the sound on for the slide in view. */
  sound: boolean;
  /** Slides whose clip cannot play: they behave as stills. */
  broken: readonly number[];
}

export type PlayerEvent =
  | { type: "go"; to: number }
  | { type: "ended" }
  | { type: "dwell" }
  | { type: "toggle" }
  | { type: "sound" }
  | { type: "watch" }
  | { type: "hover"; on: boolean }
  | { type: "focus"; on: boolean }
  | { type: "screen"; on: boolean }
  | { type: "broken"; slide: number };

/** What moves the carousel on: the clip's end, the fixed dwell, or nothing. */
export type PlayerClock = "ended" | "dwell" | "none";

export interface PlayerView {
  /** The slide in view mounts its clip. */
  clip: boolean;
  playing: boolean;
  audible: boolean;
  clock: PlayerClock;
  /** Reduced motion: the play button on the poster. */
  playButton: boolean;
  pauseControl: boolean;
  soundControl: boolean;
}

export const initialPlayer = (): PlayerState => ({
  active: 0,
  seen: [0],
  stopped: false,
  hovered: false,
  focused: false,
  onScreen: false,
  shown: false,
  engaged: false,
  sound: false,
  broken: [],
});

/** The slide `to` (wrapping around), its poster remembered; what the visitor chose for the last one is dropped. */
function go(s: PlayerState, to: number, total: number): PlayerState {
  const active = ((to % total) + total) % total;
  const seen = s.seen.includes(active) ? s.seen : [...s.seen, active];
  return { ...s, active, seen, engaged: false, sound: false };
}

/** The next state of a carousel after one event. */
export function stepPlayer(s: PlayerState, e: PlayerEvent, env: PlayerEnv): PlayerState {
  const total = env.slides.length;
  switch (e.type) {
    case "go":
      return go(s, e.to, total);
    case "dwell":
      return go(s, s.active + 1, total);
    case "ended":
      return env.still ? { ...s, engaged: false, sound: false } : go(s, s.active + 1, total);
    case "toggle":
      return s.stopped ? { ...s, stopped: false, engaged: true } : { ...s, stopped: true };
    case "sound":
      return { ...s, sound: !s.sound, engaged: true };
    case "watch":
      return { ...s, engaged: true, stopped: false };
    case "hover":
      return { ...s, hovered: e.on };
    case "focus":
      return { ...s, focused: e.on };
    case "screen":
      return { ...s, onScreen: e.on, shown: s.shown || e.on, sound: e.on && s.sound };
    case "broken":
      return s.broken.includes(e.slide) ? s : { ...s, broken: [...s.broken, e.slide] };
  }
}

/** What the carousel shows and does in a state. */
export function playerView(s: PlayerState, env: PlayerEnv): PlayerView {
  const slide = env.slides[s.active];
  const video = slide.video && !s.broken.includes(s.active);
  const held = (s.hovered || s.focused) && !s.engaged;
  const clip = video && env.loaded && s.shown && (!env.still || s.engaged);
  const playing = clip && s.onScreen && !s.stopped && !held;
  const moving = !env.still && !s.stopped && s.onScreen && !held && env.slides.length > 1;
  let clock: PlayerClock = "none";
  if (moving) {
    clock = video ? "ended" : "dwell";
  }
  const open = !env.still || s.engaged;
  return {
    clip,
    playing,
    audible: playing && s.sound && slide.audio,
    clock,
    playButton: env.still && video && !s.engaged,
    pauseControl: open,
    soundControl: video && slide.audio && open,
  };
}

/** A video file of a slide: its URL, its type and, for a lighter cut, the screens it is for. */
export interface PlayerSource {
  src: string;
  type: string;
  media?: string;
}

/** The sources a screen plays, best first: a cut made for other screens is left out. Chosen on the client once, before the
 *  clip is mounted, because `<source media>` on a video is ignored by Chrome and Firefox before 120 (Next 16 supports
 *  Chrome 111 and Firefox 111). */
export const pickSources = <T extends PlayerSource>(sources: readonly T[], matches: (query: string) => boolean): T[] =>
  sources.filter((s) => !s.media || matches(s.media));
