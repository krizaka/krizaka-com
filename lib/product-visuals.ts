/* The demo data of the products' field-guide entries (app/components/home/visuals) — structure only, said as demo data on
   the page; the words are messages (site.home.visuals.<id>). Nothing here claims a real user, figure or result. */

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
