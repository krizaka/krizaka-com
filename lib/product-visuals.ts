/* The demo data of the products' field-guide entries (app/components/home/visuals) — structure only, said as demo data on
   the page; the words are messages (site.home.visuals.<id>). Nothing here claims a real user, figure or result. */

/** The run ids the plates show (demo): every result of the products is an Orazaka run, and the plate says which. */
export const DEMO_RUNS = { orazaka: "7f3a2c", yomizaka: "b91e04", akinaza: "c4d218" } as const;

/** Akinaza: the number of the demo invoice the booking becomes. */
export const AKINAZA_INVOICE = "F-0042";

/** The steps of a plate: the input alone, the run under way, the result in. */
// @fixed: the shape of a decorative plate (three moments), not a business setting.
export const PLATE_STEPS = 3;
/** How long each step stays on screen (ms): the result is held longest, it is what the plate is about. */
// @fixed: the pace of a decorative plate, not a business setting.
export const PLATE_STEP_MS = [900, 1300, 4800] as const;
/** The step a plate shows at rest and under reduced motion: everything, the result in. */
// @fixed: derived from PLATE_STEPS, the last step.
export const PLATE_REST = PLATE_STEPS - 1;

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
