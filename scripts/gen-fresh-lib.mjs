/* Local-loop helper: the generated data of the site (org figures, registry versions, changelog) are read from the
   network. `dev` and `postinstall` need them to exist, not to be minutes old: skip the fetch when the file is younger
   than the limit. Never in CI, and `build` never uses this (it always reads the registries). */
export const DEFAULT_MAX_AGE_MIN = 360;

/** True when the generated file may be reused: not CI, not forced, and younger than `maxAgeMin` minutes. */
export function isFresh({ mtimeMs, now, maxAgeMin = DEFAULT_MAX_AGE_MIN, ci = false, force = false }) {
  if (ci || force || mtimeMs == null || !(maxAgeMin > 0)) return false;
  const age = now - mtimeMs;
  return age >= 0 && age < maxAgeMin * 60_000;
}
