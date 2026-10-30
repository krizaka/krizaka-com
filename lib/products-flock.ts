import type { FlockBird } from "@krizaka/ui/flock";

import type { ProductId } from "@/lib/products";

/* The flock IS the products: each product has its bird (lib/story.ts PRODUCT_BIRD — Orazaka the duck, the engine, at
   the centre; Yomizaka the owl, Akinaza the beaver). The places are percents of the valley film's frame (krizaka-ui tools/brand-films « home-valley »: its ridge
   at 83.3 % of the 16:9 frame, 87.4 % of the 4:5 one), so they hold at any width. */
export interface PlacedBird extends FlockBird {
  product: ProductId;
}

/** The five birds of the film, in a tall frame like the band on a phone. */
export const HERO_FLOCK: { ratio: number; birds: FlockBird[] } = {
  ratio: 4 / 5,
  birds: [
    { bird: "falcon", x: 15, y: 75, size: 20 },
    { bird: "owl", x: 38, y: 75, size: 20 },
    { bird: "duck", x: 62, y: 75, size: 20 },
    { bird: "flamingo", x: 50, y: 88, size: 27 },
    { bird: "pigeon", x: 85, y: 75, size: 20 },
  ],
};

/** Each product's bird — the same as lib/story.ts PRODUCT_BIRD (a test keeps them equal; this module stays importable by node:test). */
const BIRD: Record<ProductId, FlockBird["bird"]> = { orazaka: "duck", yomizaka: "owl", akinaza: "beaver" };
const at = (product: ProductId, x: number, y: number, size: number): PlacedBird => ({
  product,
  bird: BIRD[product],
  x,
  y,
  size,
});

/** Wide (16:9): one row on the ridge, the engine's duck in the middle and larger, the two products it powers beside it. */
export const BAND_WIDE: { ratio: number; birds: PlacedBird[] } = {
  ratio: 16 / 9,
  birds: [at("akinaza", 31, 83.3, 11.5), at("orazaka", 50, 83.3, 14.5), at("yomizaka", 69, 83.3, 11.5)],
};

/** Phones (4:5): two behind, the duck in front in the middle. */
export const BAND_TALL: { ratio: number; birds: PlacedBird[] } = {
  ratio: 4 / 5,
  birds: [at("akinaza", 30, 75, 20), at("yomizaka", 70, 75, 20), at("orazaka", 50, 88, 27)],
};
