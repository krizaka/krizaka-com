/* The geometry of the engine drawing on /story (app/components/story/EngineMap.tsx): n nodes on an ellipse around the
   hub, in a 100 × 64 box; each connector runs hub → node, trimmed at both ends so it never reaches a mark. Pure, tested
   (tests/engine.test.mjs). */

/** The drawing's own coordinate space (a 16:9 box). */
// @fixed: the drawing's own coordinate space (a 100 × 64 box), a fact of the SVG, not a business parameter.
export const W = 100;
// @fixed: the height of that box.
export const H = 64;
export const CX = W / 2;
export const CY = H / 2;
const RX = 31;
const RY = 24;
/** Where each connector starts and stops, in the box's units, so a line never reaches a mark's centre. */
const HUB_GAP = 9;
const NODE_GAP = 4.2;

type Side = "top" | "bottom";

/** Place `n` nodes on the ellipse, the first at the top, clockwise; a node's name goes on its outer side (above or below). */
export function placeNodes(n: number): { x: number; y: number; side: Side; line: [number, number, number, number] }[] {
  return Array.from({ length: n }, (_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const x = CX + RX * Math.cos(a);
    const y = CY + RY * Math.sin(a);
    const dx = x - CX;
    const dy = y - CY;
    const len = Math.hypot(dx, dy);
    const [ux, uy] = [dx / len, dy / len];
    // A name goes above a node of the upper half and below one of the lower half: the line arrives from the hub, never through it.
    const side: Side = dy < 0 ? "top" : "bottom";
    return { x, y, side, line: [CX + ux * HUB_GAP, CY + uy * HUB_GAP, x - ux * NODE_GAP, y - uy * NODE_GAP] };
  });
}
