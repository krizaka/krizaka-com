/* "Krizaka UI, live" (home): a gallery of the kit's own components, and the phone that shows their native versions.
   Each identity leads with the components its product really uses, after a short common core; the switch re-themes
   the stage (`.brand-<id>`). Structure only — which component, its page, the data; the words (hints of the variants,
   neutral sample content) are messages: site.home.build.kit.*. Money is Canadian dollars, always. */

/** Every tile: its id (the message key of its hint), the component as written in code, and its documentation page
 *  (/docs/ui/<doc>, a registry name). */
export const KIT_TILES = {
  button: { name: "Button", doc: "button" },
  switch: { name: "Switch", doc: "switch" },
  chip: { name: "Chip", doc: "chip" },
  progress: { name: "Progress", doc: "progress" },
  slider: { name: "Slider", doc: "slider" },
  tabs: { name: "Tabs", doc: "tabs" },
  chat: { name: "Chat", doc: "chat" },
  "code-block": { name: "CodeBlock", doc: "code-block" },
  stepper: { name: "Stepper", doc: "stepper" },
  "choice-grid": { name: "ChoiceGrid", doc: "choice-grid" },
  "terminal-replay": { name: "TerminalReplay", doc: "terminal-replay" },
  "video-player": { name: "VideoPlayer", doc: "video-player" },
  "video-trimmer": { name: "VideoTrimmer", doc: "video-trimmer" },
  "image-cropper": { name: "ImageCropper", doc: "image-cropper" },
  "media-capture": { name: "MediaCapture", doc: "media-capture" },
  countdown: { name: "Countdown", doc: "countdown" },
  "goal-gauge": { name: "GoalGauge", doc: "goal-gauge" },
  sparkline: { name: "Sparkline", doc: "sparkline" },
  map: { name: "Map", doc: "map" },
  "location-picker": { name: "LocationPicker", doc: "map" },
  "swipe-deck": { name: "SwipeDeck", doc: "swipe-deck" },
  "match-dialog": { name: "MatchDialog", doc: "match-dialog" },
  "tag-selector": { name: "TagSelector", doc: "tag-selector" },
  toast: { name: "Toast", doc: "toast" },
  card: { name: "Card", doc: "card" },
} as const;
export type KitTileId = keyof typeof KIT_TILES;

/** The tiles of each identity, in order: what its product uses first, then the common core (kept short). */
export const KIT_SETS = {
  orazaka: ["chat", "code-block", "stepper", "choice-grid", "terminal-replay", "button", "switch", "progress"],
  orochia: ["video-player", "video-trimmer", "image-cropper", "media-capture", "countdown", "goal-gauge", "sparkline", "button", "switch"],
  yazakia: ["swipe-deck", "match-dialog", "tag-selector", "location-picker", "map", "chip", "button", "switch"],
  yororis: ["countdown", "slider", "switch", "toast", "card", "button", "progress"],
} as const satisfies Record<string, readonly KitTileId[]>;
export type KitBrand = keyof typeof KIT_SETS;
export const KIT_BRANDS = Object.keys(KIT_SETS) as KitBrand[];

export const KIT_CURRENCY = "CAD";
/** A neutral series, in cents of Canadian dollars. */
export const KIT_SERIES_CENTS = [8200, 7600, 9100, 8800, 10200, 9900, 11300, 12100, 10900, 13400, 12800, 14200, 13900, 15100, 16200, 15800, 17000, 16400, 18100, 17600, 19300, 20400, 19800, 21500, 20900, 22600, 23400, 22800, 24100, 25200];
/** What the gauges, the countdown and the progress count. */
export const KIT_GOAL = { segments: 10, reached: 6, raisedCents: 32_000, targetCents: 50_000 };
export const KIT_COUNTDOWN_MS = 74 * 60_000 + 20_000;
export const KIT_MOMENT_MS = 7 * 60_000 + 30_000;
/** Self-reported, 1 to 5. */
export const KIT_MOOD = { min: 1, max: 5, before: 2, after: 4 };

/** Orochia's media (site/home/kit on the CDN; the clip is vertical, 9:16, like a short): Krizaka's own AI-generated clips (fictional, owned by Krizaka — never
 *  presented as real creators). The clip that plays, its filmstrip (frames of the same clip, `KIT_CLIP_SECONDS` long),
 *  the still to crop and the still behind the camera. */
export const KIT_VIDEO = "reel-v";
export const KIT_FILMSTRIP = "reel";
export const KIT_FILMSTRIP_FRAMES = 8;
export const KIT_CLIP_SECONDS = 6;
export const KIT_CROP_IMAGE = "reel-crop";
export const KIT_CAPTURE_IMAGE = "reel-capture";

/** Yazakia's people (lib/people.json, product "yazakia") and the places of the map (Montréal). */
export const KIT_YAZAKIA_PEOPLE = [{ id: "ines", age: 29, km: 3.2 }, { id: "kofi", age: 31, km: 12 }, { id: "hana", age: 28, km: 5.4 }] as const;
export const KIT_MAP = {
  center: [-73.592, 45.528] as const,
  spots: [{ id: "a", position: [-73.6005, 45.5229] as const }, { id: "b", position: [-73.6147, 45.5363] as const }, { id: "c", position: [-73.5695, 45.5268] as const }],
  origin: [-73.5794, 45.5048] as const,
  meeting: [-73.5673, 45.5017] as const,
  radius: 1000,
};

/** The overlay of the vertical clip (an action rail and a caption): the figures. Words are messages: site.home.build.kit.short. */
export const KIT_SHORT = { likes: 12_400, comments: 318 };
