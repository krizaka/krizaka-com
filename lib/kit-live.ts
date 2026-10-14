/* "Krizaka UI, live" (home): a gallery of the kit's own components, and the phone that shows their native versions.
   Structure only — which component, where its documentation is, which recording; the words (hints of the variants,
   neutral sample content) are messages: site.home.build.kit.*. The product switch only re-themes the gallery
   (`.brand-<id>`) and picks the phone's recording: one kit, four identities. */

/** The gallery's tiles, in order: the registry name (its page is /docs/ui/<name>) and the component as written in code. */
export const KIT_TILES = [
  { id: "button", name: "Button" },
  { id: "slider", name: "Slider" },
  { id: "switch", name: "Switch" },
  { id: "chip", name: "Chip" },
  { id: "tabs", name: "Tabs" },
  { id: "date-picker", name: "DatePicker" },
  { id: "choice-grid", name: "ChoiceGrid" },
  { id: "sparkline", name: "Sparkline" },
  { id: "goal-gauge", name: "GoalGauge" },
  { id: "countdown", name: "Countdown" },
  { id: "progress", name: "Progress" },
  { id: "profile-card", name: "ProfileCard" },
  { id: "avatar", name: "Avatar" },
  { id: "toast", name: "Toast" },
] as const;
export type KitTileId = (typeof KIT_TILES)[number]["id"];

/** The Krizaka UI portraits of the examples (lib/people.json, product "ui"): no product's face. */
export const KIT_PEOPLE = ["camille", "noor", "tomas", "ada"] as const;

/** Neutral series, in cents of Canadian dollars. */
export const KIT_SERIES_CENTS = [8200, 7600, 9100, 8800, 10200, 9900, 11300, 12100, 10900, 13400, 12800, 14200, 13900, 15100, 16200, 15800, 17000, 16400, 18100, 17600, 19300, 20400, 19800, 21500, 20900, 22600, 23400, 22800, 24100, 25200];
export const KIT_CURRENCY = "CAD";
/** What the gauges, the countdown and the progress count. */
export const KIT_GOAL = { segments: 10, reached: 6, raisedCents: 32_000, targetCents: 50_000 };
export const KIT_COUNTDOWN_MS = 74 * 60_000 + 20_000;

export const KIT_BRANDS = ["orazaka", "orochia", "yazakia", "yororis"] as const;
export type KitBrand = (typeof KIT_BRANDS)[number];

