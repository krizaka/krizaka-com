import type { FlockBird } from "@krizaka/ui/flock";

/* The live flock on the home's valley. The valley film (krizaka-ui tools/brand-films « home-valley ») is the ridge and the
   sky without its birds; these are the places the film's birds stood (`layout()` of that tool: feet on the ridge, the
   five at 20 · 35 · 50 · 65 · 80 % of the width), as percents of the film's frame, so they hold at any size. */
export const FLOCK_WIDE: { ratio: number; birds: FlockBird[] } = {
  ratio: 16 / 9,
  birds: [
    { bird: "falcon", x: 20, y: 83.3, size: 13 },
    { bird: "owl", x: 35, y: 83.3, size: 13 },
    { bird: "duck", x: 50, y: 83.3, size: 13 },
    { bird: "flamingo", x: 65, y: 83.3, size: 13 },
    { bird: "pigeon", x: 80, y: 83.3, size: 13 },
  ],
};

/** The 4:5 cut, for phones: the same five, larger in their frame. */
export const FLOCK_TALL: { ratio: number; birds: FlockBird[] } = {
  ratio: 4 / 5,
  birds: FLOCK_WIDE.birds.map((b) => ({ ...b, y: 87.4, size: 19.4 })),
};
