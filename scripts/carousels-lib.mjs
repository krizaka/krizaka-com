/* The pure part of scripts/check-carousels.mjs (krizaka-internal#2658): the cases of the journey and how a reading of the
   home's carousels is judged. Tested by tests/check-carousels.test.mjs. */

export const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "phone", width: 390, height: 844 },
];
export const THEMES = ["dark", "light"];
export const PREFERENCES = ["no-preference", "reduce"];
// @fixed: the home's carousels: the hero's, then Sovkora, Verikora and Folioviv (lib/home-showcase.ts).
export const CAROUSELS = 4;

/** Every viewport × theme × motion preference to load the home in, in French (the default) and English. */
export function cases(paths = ["/fr", "/en"], viewports = VIEWPORTS, themes = THEMES, preferences = PREFERENCES) {
  return paths.flatMap((path) =>
    viewports.flatMap((vp) =>
      themes.flatMap((theme) => preferences.map((reducedMotion) => ({ path, vp, theme, reducedMotion }))),
    ),
  );
}

const label = (c) => `${c.path} ${c.vp.name} ${c.theme} ${c.reducedMotion}`;

/**
 * What is wrong with one reading (empty: fine). `reading`: `{ carousels: [{ ratio, video, playing, error, pause }],
 * advanced, held }` — `advanced`: the first carousel turned on its own; `held`: it did not turn under the pointer.
 */
export function carouselProblems(c, reading) {
  const out = [];
  const at = label(c);
  if (reading.carousels.length !== CAROUSELS)
    out.push(`${at}: ${reading.carousels.length} carousels, expected ${CAROUSELS}`);
  reading.carousels.forEach((k, i) => {
    if (Math.abs(k.ratio - 16 / 9) > 0.02) out.push(`${at}: carousel ${i + 1} is ${k.ratio.toFixed(2)}:1, not 16:9`);
    if (k.error) out.push(`${at}: carousel ${i + 1}'s clip failed (${k.error})`);
  });
  const calm = c.reducedMotion === "reduce";
  const first = reading.carousels[0];
  if (calm) {
    if (reading.carousels.some((k) => k.video)) out.push(`${at}: a clip is mounted under reduced motion`);
    if (reading.carousels.some((k) => k.pause)) out.push(`${at}: a pause button under reduced motion (nothing moves)`);
    if (reading.advanced) out.push(`${at}: a carousel advanced under reduced motion`);
    return out;
  }
  if (first && !first.playing) out.push(`${at}: the first carousel's clip does not play`);
  if (reading.carousels.some((k) => !k.pause)) out.push(`${at}: a carousel without its visible pause (WCAG 2.2.2)`);
  if (!reading.advanced) out.push(`${at}: the first carousel did not advance on its own`);
  if (!reading.held) out.push(`${at}: the first carousel advanced under the pointer`);
  return out;
}

/** Runs in the page: each carousel's frame ratio, its clip (mounted, playing, failed) and its pause button. */
export function readCarouselsInPage() {
  return [...document.querySelectorAll("section[data-frame]")].map((root) => {
    const stage = root.firstElementChild?.tagName === "STYLE" ? root.children[1] : root.firstElementChild;
    const box = stage?.getBoundingClientRect() ?? { width: 0, height: 1 };
    const video = root.querySelector("video");
    return {
      ratio: box.width / box.height,
      video: Boolean(video),
      playing: Boolean(video && !video.paused && video.currentTime > 0),
      error: video?.error ? String(video.error.code) : undefined,
      pause: [...root.querySelectorAll("button")].some((b) =>
        /pause|lecture|play/i.test(b.getAttribute("aria-label") ?? ""),
      ),
    };
  });
}

/** Runs in the page: the count of a carousel (« 2 / 5 »). */
export function countInPage(index) {
  const root = document.querySelectorAll("section[data-frame]")[index];
  return root?.querySelector("p[aria-live] span")?.textContent ?? "";
}
