/* The focus (Oussama, 2026-10-22): « Sur krizaka.com, on affiche plein de produits. On va se concentrer sur 3 pour le
   moment. » krizaka.com shows Orazaka, Akinaza and Yomizaka by default; the four others stay in the data and in every
   page — hidden, not removed — until the notebook is opened whole (a Konami code, `?carnet=complet`). This is a visual
   focus: the JSON-LD Organization still owns every product, llms.txt, the sitemaps and the products' own sites are
   untouched (tests/focus.test.mjs).

   Pure: the data, the key sequence and the address are here, importable by node:test; the browser side is
   app/components/Carnet.tsx, the CSS app/components/focus.css. */

import { PRODUCT_IDS, wwwUrl, type ProductId } from "./product-hosts.ts";

/** The products shown by default, in the story's order. */
export const FOCUS_IDS: readonly ProductId[] = ["orazaka", "akinaza", "yomizaka"];
/** The others: in the page, hidden until the notebook is opened whole. */
export const HIDDEN_IDS: readonly ProductId[] = PRODUCT_IDS.filter((id) => !FOCUS_IDS.includes(id));

/** True for a product outside the focus; anything else (a brick, the stack, the company) is never hidden. */
export const isHidden = (id: string): boolean => (HIDDEN_IDS as readonly string[]).includes(id);

/** True when a free text (a GitHub description, a registry line) names a product outside the focus. */
export const namesHidden = (text: string): boolean => HIDDEN_IDS.some((id) => text.toLowerCase().includes(id));

/** `focusProps` for a thing known by its name only (an npm package, a Maven artifact): `@krizaka/orochia-design-system`. */
export const focusTextProps = (text: string): { "data-focus"?: "off" } => (namesHidden(text) ? { "data-focus": "off" } : {});

/** What to spread on the element of a hidden product (CSS hides it until the notebook is open): `{...focusProps(p.id)}`. */
export const focusProps = (id: string): { "data-focus"?: "off" } => (isHidden(id) ? { "data-focus": "off" } : {});

/** The entries to show: the whole list when the notebook is open, else without the products outside the focus. */
export const inFocus = <T extends { id: string }>(list: readonly T[], open: boolean): T[] => (open ? [...list] : list.filter((x) => !isHidden(x.id)));

/** What the server cannot mark: /story's contents (`@krizaka/ui/toc`) by the anchors of the chapters. Only while the notebook
 *  is closed. (The footer no longer needs it: `SiteFooter` takes a `products` filter, fed by `FOCUS_IDS` and `useCarnet()`.) */
export const hiddenCss = (): string =>
  HIDDEN_IDS.flatMap((id) => [
    `html:not([data-carnet]) .kz-toc li:has(> a[href="#p-${id}"]){display:none}`,
  ]).join("\n");

/* ─── The state is the address: `?carnet=complet` ─── */

export const CARNET_PARAM = "carnet";
export const CARNET_OPEN = "complet";

/** True when the query string (`location.search`) asks for the whole notebook. */
export const carnetOpen = (search: string): boolean => new URLSearchParams(search).get(CARNET_PARAM) === CARNET_OPEN;

/** The same address with the notebook opened or closed — path, other parameters and hash untouched. */
export function withCarnet(href: string, open: boolean): string {
  const url = new URL(href, "https://www.krizaka.com");
  if (open) url.searchParams.set(CARNET_PARAM, CARNET_OPEN);
  else url.searchParams.delete(CARNET_PARAM);
  return `${url.pathname}${url.search}${url.hash}`;
}

/* ─── The code: ↑ ↑ ↓ ↓ ← → ← → B A ─── */

export const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"] as const;

const norm = (key: string) => (key.length === 1 ? key.toLowerCase() : key);

/** One key further in the code: the new progress (KONAMI.length when it is complete). A wrong key starts over — and
 *  counts as the first key when it is one. */
export function konamiStep(progress: number, key: string): number {
  const k = norm(key);
  if (k === KONAMI[progress]) return progress + 1;
  return k === KONAMI[0] ? 1 : 0;
}

/* ─── On a phone: tap the hidden hint N times ─── */

// @fixed: the number of taps is a gesture, not a business parameter: few enough for a thumb, too many for an accident.
export const TAPS_NEEDED = 5;
// @fixed: the window of one tap series, in milliseconds: slow taps never add up.
export const TAP_WINDOW_MS = 4000;

/** The taps still alive after one at `now`, and whether the series is complete. */
export function tapStep(taps: readonly number[], now: number): { taps: number[]; done: boolean } {
  const alive = [...taps.filter((t) => now - t <= TAP_WINDOW_MS), now];
  return alive.length >= TAPS_NEEDED ? { taps: [], done: true } : { taps: alive, done: false };
}
