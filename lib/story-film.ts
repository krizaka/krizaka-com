/* The brand film's slot (the home's « Watch the film », /story, its watch page): « Montrer son travail » (lib/brand-film.ts),
   its files read from the manifest. « La famille Krizaka », « Le monde de Krizaka » and « le relais » are retired from
   every slot (2026-11-01). The vertical cut joins the day its files are recorded in lib/cdn-manifest.json. */

import { cdn, onCdn, video } from "./cdn";
import { BRAND_FILM, hasTallCut } from "./brand-film";
import { HERO_SLIDES, heroSlideProblems } from "./hero-slides";

export function brandFilm() {
  const wide = video(BRAND_FILM.base);
  return {
    ...BRAND_FILM,
    ...wide,
    loop: video(BRAND_FILM.loop),
    tall: hasTallCut(onCdn)
      ? { mp4: cdn(`${BRAND_FILM.tallWeb}.mp4`), poster: cdn(`${BRAND_FILM.tall}.jpg`) }
      : undefined,
  };
}

/** The hero's slides, resolved on the CDN: an unknown clip throws here, so the build fails (lib/hero-slides.ts). */
export function heroSlides() {
  const problems = heroSlideProblems(HERO_SLIDES, onCdn);
  if (problems.length > 0) {
    throw new Error(`hero slides: ${problems.join("; ")}`);
  }
  return HERO_SLIDES.map((s) => ({ ...s, ...video(s.base) }));
}
