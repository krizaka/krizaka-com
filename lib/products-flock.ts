import type { FlockBird } from "@krizaka/ui/flock";

import type { ProductId } from "@/lib/products";

/* The flock IS the products: each product has its bird (lib/story.ts PRODUCT_BIRD — Orazaka the flamingo, the engine, at
   the centre; Orochia the pigeon, Yomizaka the owl, Yasakia the lovebird, Yororis the crane, Kachizaka the magpie, Akinaza
   the beaver). The places are percents of the valley film's frame (krizaka-ui tools/brand-films « home-valley »: its ridge
   at 83.3 % of the 16:9 frame, 87.4 % of the 4:5 one), so they hold at any width. */
export interface PlacedBird extends FlockBird {
  product: ProductId;
}

/** Each product's bird — the same as lib/story.ts PRODUCT_BIRD (a test keeps them equal; this module stays importable by node:test). */
const BIRD: Record<ProductId, FlockBird["bird"]> = { orazaka: "flamingo", yomizaka: "owl", orochia: "pigeon", kachizaka: "magpie", akinaza: "beaver", yasakia: "lovebird", yororis: "crane" };
const at = (product: ProductId, x: number, y: number, size: number): PlacedBird => ({ product, bird: BIRD[product], x, y, size });

/** Wide (16:9): one row on the ridge, the engine's flamingo in the middle and larger; the pigeon at one end, so its parcel crosses the whole band. */
export const BAND_WIDE: { ratio: number; birds: PlacedBird[] } = {
  ratio: 16 / 9,
  birds: [
    at("orochia", 12, 83.3, 11.5),
    at("yomizaka", 25.5, 83.3, 11.5),
    at("yasakia", 38.5, 83.3, 11.5),
    at("orazaka", 50, 83.3, 14.5),
    at("yororis", 61.5, 83.3, 11.5),
    at("kachizaka", 74.5, 83.3, 11.5),
    at("akinaza", 88, 83.3, 11.5),
  ],
};

/** Phones (4:5): two rows — four behind, three in front with the flamingo in the middle. */
export const BAND_TALL: { ratio: number; birds: PlacedBird[] } = {
  ratio: 4 / 5,
  birds: [
    at("orochia", 15, 75, 20),
    at("yomizaka", 38, 75, 20),
    at("yororis", 62, 75, 20),
    at("akinaza", 85, 75, 20),
    at("kachizaka", 22, 88, 23),
    at("orazaka", 50, 88, 27),
    at("yasakia", 78, 88, 23),
  ],
};
