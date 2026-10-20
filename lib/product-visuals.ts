/* The demo data of the products' field-guide entries (app/components/home/visuals) — structure only, said as demo data on
   the page; the words are messages (site.home.visuals.<id>). Nothing here claims a real user, figure or result. */

/** Orochia: the renditions an upload is encoded to before it streams (adaptive HLS ladder). */
export const OROCHIA_RENDITIONS = ["360p", "720p", "1080p"] as const;

/** Kachizaka: a friends' league (demo) — each player's points per match day, eight match days; the standings are the sums. */
export const KACHIZAKA_LEAGUE: readonly (readonly number[])[] = [
  [3, 5, 2, 6, 4, 7, 3, 8],
  [4, 2, 5, 3, 6, 4, 5, 4],
  [2, 6, 3, 4, 3, 5, 6, 3],
];

/** The points of each player after `day` match days (1–8). */
export function standings(day: number): number[] {
  return KACHIZAKA_LEAGUE.map((row) => row.slice(0, day).reduce((a, b) => a + b, 0));
}

/** Akinaza: the free slots of a salon's day (demo); the visual books them one by one. */
export const AKINAZA_SLOTS = ["9:00", "10:30", "13:00", "15:30"] as const;

/** Akinaza: the price of the service on the demo receipt (CAD). */
// @fixed: demo data of a decorative plate, said as demo on the page; no business behaviour reads it.
export const AKINAZA_PRICE = 45;
/** Québec sales taxes: the federal GST (TPS) and the provincial QST (TVQ), each on the price. */
// @fixed: the federal GST rate, a published fact shown on a demo receipt (the products read theirs from their settings).
export const GST = 0.05;
// @fixed: Québec's QST rate, a published fact shown on a demo receipt (the products read theirs from their settings).
export const QST = 0.09975;

const cents = (n: number) => Math.round(n * 100) / 100;

/** A receipt to the cent: each tax rounded on its own, as an invoice shows them. */
export function receipt(price: number): { price: number; gst: number; qst: number; total: number } {
  const gst = cents(price * GST);
  const qst = cents(price * QST);
  return { price, gst, qst, total: cents(price + gst + qst) };
}

/** Yororis: the peaks (0–1) of a calm spoken sentence, drawn as a waveform. */
export const YORORIS_PEAKS: readonly number[] = [
  0.18, 0.32, 0.55, 0.42, 0.7, 0.86, 0.6, 0.38, 0.24, 0.46, 0.68, 0.92, 0.74, 0.5, 0.3, 0.2, 0.36, 0.58, 0.8, 0.64, 0.44, 0.28, 0.4,
  0.62, 0.48, 0.3, 0.22, 0.16,
];
