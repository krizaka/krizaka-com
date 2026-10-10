/* Isometric projection for the site's illustrations (BRAND.md §4: luminous isometric objects built from our own
   vocabulary — hexagons, cut corners, nodes). Pure geometry, no React: the SVG components in
   app/components/brand/Iso.tsx compute their faces here at render time (server-side, static markup).

   World: x to the lower right, y to the lower left, z up. Screen: X = (x − y)·cos 30°, Y = (x + y)·sin 30° − z. */

export type P2 = readonly [number, number];
export type P3 = readonly [number, number, number];

const COS = Math.cos(Math.PI / 6);
const SIN = 0.5;

export function project([x, y, z]: P3): P2 {
  return [(x - y) * COS, (x + y) * SIN - z];
}

export const pts = (points: P2[]) => points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

/** A regular hexagon footprint (flat top in plan), centre (cx, cy), radius r. */
export function hexagon(cx: number, cy: number, r: number): P2[] {
  return Array.from({ length: 6 }, (_, k) => {
    const a = (Math.PI / 3) * k;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
  });
}

/** A rectangle with 45° cut corners (the Krizaka icon chamfer), centre (cx, cy), size w × d, cut c. */
export function cutRect(cx: number, cy: number, w: number, d: number, c: number): P2[] {
  const x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - d / 2, y1 = cy + d / 2;
  return [
    [x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c],
    [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c],
  ];
}

export interface Face {
  points: string;
  /** "top", or a side lit from the left ("left") or the right ("right"). */
  kind: "top" | "left" | "right";
}

/** The visible faces of a vertical prism over a footprint, painted back to front. */
export function prism(footprint: P2[], z0: number, h: number): Face[] {
  const n = footprint.length;
  // Orientation of the footprint (shoelace) so outward normals point out whatever the winding.
  const area = footprint.reduce((s, [x, y], i) => {
    const [x2, y2] = footprint[(i + 1) % n];
    return s + (x * y2 - x2 * y);
  }, 0);
  const sign = area > 0 ? 1 : -1;
  const sides: { depth: number; face: Face }[] = [];
  for (let i = 0; i < n; i++) {
    const [ax, ay] = footprint[i];
    const [bx, by] = footprint[(i + 1) % n];
    const nx = sign * (by - ay);
    const ny = sign * -(bx - ax);
    if (nx + ny <= 1e-6) continue; // faces away from the viewer
    const quad: P2[] = [project([ax, ay, z0]), project([bx, by, z0]), project([bx, by, z0 + h]), project([ax, ay, z0 + h])];
    sides.push({ depth: ax + ay + bx + by, face: { points: pts(quad), kind: nx >= ny ? "right" : "left" } });
  }
  sides.sort((a, b) => a.depth - b.depth);
  const top: Face = { points: pts(footprint.map(([x, y]) => project([x, y, z0 + h]))), kind: "top" };
  return [...sides.map((s) => s.face), top];
}

/** The screen ellipse of a horizontal circle of radius r at height z (centre and radii). */
export function isoCircle(cx: number, cy: number, z: number, r: number) {
  const [x, y] = project([cx, cy, z]);
  return { cx: x, cy: y, rx: r * COS * Math.SQRT2, ry: r * SIN * Math.SQRT2 };
}
