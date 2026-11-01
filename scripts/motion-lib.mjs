/* The pure part of scripts/check-motion.mjs: what is sampled and how a reading is judged. Tested by
   tests/check-motion.test.mjs. */

/** The pages that draw the engine flow: /story's engine chapter (the home's engine entry now draws a plate, not the flow). */
export const PATHS = ["/en/story"];
export const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 900 },
  { name: "phone", width: 390, height: 844 },
];
export const THEMES = ["dark", "light"];
export const PREFERENCES = ["no-preference", "reduce"];

/** Every page × viewport × theme × motion preference to load. */
export function cases(paths = PATHS, viewports = VIEWPORTS, themes = THEMES, preferences = PREFERENCES) {
  return paths.flatMap((path) =>
    viewports.flatMap((vp) =>
      themes.flatMap((theme) => preferences.map((reducedMotion) => ({ path, vp, theme, reducedMotion }))),
    ),
  );
}

/** Runs in the page: each photon's own dash-offset readings over ~700 ms, and the hub's animation.
    Interpolated, a photon reads many distinct finite lengths; the 2026-10-20 bug (a unitless keyframe value) gave two
    — `0px` and a `calc()` — and every dot looked frozen. */
export async function sampleFlowInPage() {
  const stage = [...document.querySelectorAll(".kz-flow-stage")].find((el) => el.getClientRects().length > 0);
  if (!stage) return { error: "no visible EngineFlow stage" };
  const photons = [...stage.querySelectorAll(".kz-flow-photon:not([data-halo])")];
  if (!photons.length) return { error: "no photon drawn" };
  const seen = photons.map(() => new Set());
  for (let n = 0; n < 7; n++) {
    photons.forEach((p, k) => seen[k].add(getComputedStyle(p).strokeDashoffset));
    await new Promise((resolve) => setTimeout(resolve, 110));
  }
  const readings = seen.map((set) => [...set]);
  const hub = stage.querySelector(".kz-flow-hub-mark");
  return {
    readings,
    running: photons.every((p) => p.getAnimations().some((a) => a.playState === "running")),
    hub: hub ? getComputedStyle(hub).animationName : null,
  };
}

/** The failure lines of one sampled page (none when the figure moves, or rests under reduced motion). */
export function motionProblems({ path, vp, theme, reducedMotion }, sample) {
  const where = `${path} ${vp.name} ${theme} reduced-motion=${reducedMotion}`;
  if (sample.error) return [`${where}: ${sample.error}`];
  const distinct = Math.min(...sample.readings.map((r) => r.length));
  const finite = sample.readings.every((r) => r.every((v) => /^-?[\d.]+(px)?$/.test(v)));
  if (reducedMotion === "reduce")
    return distinct === 1 ? [] : [`${where}: the photons move (${distinct} positions) under reduced motion`];
  const out = [];
  if (!finite) out.push(`${where}: the dash offset is not an interpolated length`);
  if (distinct < 4) out.push(`${where}: the photons do not travel (${distinct} distinct positions in 700 ms)`);
  if (!sample.running) out.push(`${where}: a photon animation is not running`);
  if (sample.hub === "none") out.push(`${where}: the engine does not breathe`);
  return out;
}
