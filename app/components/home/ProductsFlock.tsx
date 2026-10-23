"use client";

/* The opening of the products section: the flock on the valley, cropped at its ground, as a photo pinned in the notebook —
   slightly tilted, a thin white print border, a soft paper shadow, tape at two corners (@krizaka/ui TapedPhoto). Each bird IS a product (lib/products-flock.ts): hovering, focusing or tapping one lights
   its row and its node in the list below, and the row (or the node) lights its bird — the same link the engine flow has
   (ProductsLink, through `kz-products-point` / `kz-products-lit` on window). A bird has its name on hover or focus, and is a
   link to its entry. The birds themselves are krizaka-ui's Flock: at ease in character, glancing at each other, the pigeon
   (Orochia) carrying its parcel across the band, each jumping once as the band comes into view; still under reduced motion.
   The ridge of the film is the page's surface: below the band the section's paper continues. */

import { Flock } from "@krizaka/ui/flock";
import { TapedPhoto } from "@krizaka/ui/taped-photo";
import { useEffect, useState } from "react";

import { BAND_TALL, BAND_WIDE, FOCUS_TALL, FOCUS_WIDE, type PlacedBird } from "@/lib/products-flock";
import { PRODUCTS } from "@/lib/products";
import type { AmbientSet } from "@/lib/home-ambient";
import AmbientLoop from "./AmbientLoop";
import { useCarnet } from "../useCarnet";

const nameOf = (id: string) => PRODUCTS.find((p) => p.id === id)?.name ?? id;
const point = (id: string | null) => window.dispatchEvent(new CustomEvent("kz-products-point", { detail: id }));

function Hits({ band, lit }: { band: { birds: PlacedBird[] }; lit: string | null }) {
  return (
    <div className="kz-band-hits">
      {band.birds.map((b) => (
        <a
          key={b.product}
          href={`#product-${b.product}`}
          className={"kz-band-hit brand-" + b.product}
          data-product={b.product}
          data-lit={lit === b.product ? "" : undefined}
          aria-label={nameOf(b.product)}
          style={{ left: `${b.x - b.size / 2}%`, width: `${b.size}%`, top: `calc(${b.y}% - ${b.size * 0.9}cqw)` }}
          onPointerEnter={() => point(b.product)}
          onPointerLeave={() => point(null)}
          onFocus={() => point(b.product)}
          onBlur={() => point(null)}
        >
          <span className="kz-band-cap" aria-hidden>
            {nameOf(b.product)}
          </span>
        </a>
      ))}
    </div>
  );
}

export default function ProductsFlock({ set }: { set: AmbientSet }) {
  const [lit, setLit] = useState<string | null>(null);
  // Three birds while only the focus shows (lib/focus.ts), the seven once the notebook is open whole.
  const open = useCarnet();
  const WIDE = open ? BAND_WIDE : FOCUS_WIDE;
  const TALL = open ? BAND_TALL : FOCUS_TALL;
  useEffect(() => {
    const on = (e: Event) => setLit((e as CustomEvent<string | null>).detail ?? null);
    window.addEventListener("kz-products-lit", on);
    return () => window.removeEventListener("kz-products-lit", on);
  }, []);
  const active = (b: { birds: PlacedBird[] }) => b.birds.find((x) => x.product === lit)?.bird ?? null;
  return (
    <div className="kz-band-photo-wrap">
      <TapedPhoto className="kz-band-photo">
        <div className="kz-band">
          <div className="kz-band-stage">
            <AmbientLoop set={set} />
            <div className="kz-band-wide">
              <Flock className="kz-band-flock" tone="own" ratio={WIDE.ratio} birds={WIDE.birds} tempo={1.7} scenes greet active={active(WIDE)} />
              <Hits band={WIDE} lit={lit} />
            </div>
            <div className="kz-band-tall">
              <Flock className="kz-band-flock" tone="own" ratio={TALL.ratio} birds={TALL.birds} tempo={1.7} scenes greet active={active(TALL)} />
              <Hits band={TALL} lit={lit} />
            </div>
          </div>
        </div>
      </TapedPhoto>
    </div>
  );
}
