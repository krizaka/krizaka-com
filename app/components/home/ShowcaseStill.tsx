/* The still of a product in conception (founder, 2026-11-06, krizaka-internal#2802): one mood photo in the carousels' frame
   (the site's plate, .rd-plate, with its paper shadow, the same caption line « Fig. 5 — … »), so the products' row reads as one
   family. It is a generated picture of the job the product will do, never a screen of an app that does not exist yet; its
   caption says the product is in conception. Nothing moves: the photo is the poster and the reduced-motion still. Its file
   is read from the CDN manifest (lib/home-showcase.ts; an unknown file fails the build), its words are messages
   (site.home.showcase.stills.<product>). Rendered on the server. */

import { cdn } from "@/lib/cdn";
import { format, getDictionary } from "@/lib/i18n";
import { showcaseStill, type Still } from "@/lib/home-showcase";
import "./showcase.css";

// @fixed: the size of every poster of the home's carousels (scripts/home-showcase.mjs encodes them at 1280x720).
const POSTER = { width: 1280, height: 720 } as const;

export default function ShowcaseStill({
  product,
  fig,
  locale,
}: Readonly<{ product: Still; fig: number; locale: string }>) {
  const t = getDictionary(locale).site.home.showcase;
  const still = showcaseStill(product);
  const words = t.stills[product];
  return (
    <figure className="kz-show kz-show-still" data-still={still.id}>
      <div className="rd-plate kz-show-stage">
        <picture>
          <img
            className="kz-show-media"
            src={cdn(still.poster)}
            alt={words.alt}
            width={POSTER.width}
            height={POSTER.height}
            decoding="async"
            loading="lazy"
          />
        </picture>
      </div>
      <figcaption className="kz-show-bar">
        <span className="rd-plate-caption kz-show-caption">
          {format(t.labels.figure, { fig: String(fig), caption: words.caption })}
        </span>
      </figcaption>
    </figure>
  );
}
