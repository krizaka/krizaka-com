/* The brand film's slot (the home's « Watch the film », /story, its watch page): « Montrer son travail » (lib/brand-film.ts),
   its files read from the manifest. « La famille Krizaka », « Le monde de Krizaka » and « le relais » are retired from
   every slot (2026-11-01). The vertical cut joins the day its files are recorded in lib/cdn-manifest.json. */

import { onCdn, video } from "./cdn";
import { BRAND_FILM, hasTallCut } from "./brand-film";

export function brandFilm() {
  const wide = video(BRAND_FILM.base);
  return {
    ...BRAND_FILM,
    ...wide,
    loop: video(BRAND_FILM.loop),
    tall: hasTallCut(onCdn) ? video(BRAND_FILM.tall) : undefined,
  };
}
