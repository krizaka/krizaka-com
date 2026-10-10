/* Original isometric illustrations of the product pages (BRAND.md §4): objects built from the Krizaka vocabulary —
   hexagons, cut corners, the node of the marks — extruded in isometric projection (lib/iso.ts), lit from inside by the
   brand accent of the section they sit in (`.brand-<id>` re-points --kz-accent). Decorative (aria-hidden): the page
   says the same thing in words. Colours are roles only; motion is slow and stops under prefers-reduced-motion
   (.iso-* in globals.css). Server components: static SVG, no client JavaScript. */

import { cutRect, hexagon, isoCircle, prism, project, pts, type Face, type P2 } from "@/lib/iso";
import { cn } from "@krizaka/ui/cn";

type Material = "base" | "accent" | "glass" | "accent2";

function Solid({ faces, material, className }: { faces: Face[]; material: Material; className?: string }) {
  return (
    <g className={cn("iso-" + material, className)}>
      {faces.map((f, i) => (
        <polygon key={i} points={f.points} className={cn("iso-face", "iso-" + f.kind)} />
      ))}
    </g>
  );
}

/** Floor lines at z = 0, fading out from the centre (mask). */
function Floor({ id, extent = 240, step = 40 }: { id: string; extent?: number; step?: number }) {
  const lines: string[] = [];
  for (let v = -extent; v <= extent; v += step) {
    const a = project([v, -extent, 0]), b = project([v, extent, 0]);
    const c = project([-extent, v, 0]), d = project([extent, v, 0]);
    lines.push(`M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}`);
    lines.push(`M${c[0].toFixed(1)} ${c[1].toFixed(1)}L${d[0].toFixed(1)} ${d[1].toFixed(1)}`);
  }
  const e = isoCircle(0, 0, 0, extent * 0.9);
  return (
    <>
      <defs>
        <radialGradient id={`${id}-floor`}>
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={`${id}-floor-mask`}>
          <ellipse cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry} fill={`url(#${id}-floor)`} />
        </mask>
      </defs>
      <path d={lines.join("")} className="iso-floor" mask={`url(#${id}-floor-mask)`} />
    </>
  );
}

function Glow({ id, at, r }: { id: string; at: P2; r: number }) {
  return (
    <>
      <defs>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0%" className="iso-glow-stop" stopOpacity="0.55" />
          <stop offset="100%" className="iso-glow-stop" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={at[0]} cy={at[1]} r={r} fill={`url(#${id}-glow)`} className="iso-breathe" />
    </>
  );
}

/** A light strip around the front of a cut-corner slab (the "LEDs" of a server). */
function Strip({ cx, cy, w, d, c, z }: { cx: number; cy: number; w: number; d: number; c: number; z: number }) {
  const x1 = cx + w / 2, y1 = cy + d / 2, x0 = cx - w / 2, y0 = cy - d / 2;
  const path: P2[] = [
    project([x1, y0 + c, z]), project([x1, y1 - c, z]), project([x1 - c, y1, z]), project([x0 + c, y1, z]),
  ];
  return <polyline points={pts(path)} className="iso-strip" />;
}

/** Orazaka — the sovereign stack: a server of three cut-corner slabs on a hexagonal plinth, an orange core on top,
 *  under a glass dome; a chat bubble and a document float outside, joined to the plinth by light on the floor. */
export function IsoSovereignStack({ id = "oz", className }: { id?: string; className?: string }) {
  const slab = (z0: number) => prism(cutRect(0, 0, 120, 120, 20), z0, 22);
  const dome = isoCircle(0, 0, 0, 158);
  const domeH = 250;
  const bubble = (dz: number) => prism(cutRect(180, -110, 76, 48, 12), 120 + dz, 9);
  const doc = prism(cutRect(-70, 175, 52, 66, 10), 64, 6);
  const core = project([0, 0, 124]);
  const flowA = [project([180, -110, 0]), project([95, -60, 0]), project([60, -40, 0])];
  const flowB = [project([-70, 175, 0]), project([-40, 100, 0]), project([-25, 65, 0])];
  return (
    <svg viewBox="-290 -250 590 420" className={className} aria-hidden focusable="false">
      <Floor id={id} />
      <polyline points={pts(flowA)} className="iso-flow" />
      <polyline points={pts(flowB)} className="iso-flow" />
      <ellipse cx={dome.cx} cy={dome.cy} rx={dome.rx} ry={dome.ry} className="iso-rim" />
      <Solid faces={prism(hexagon(0, 0, 112), 0, 12)} material="base" />
      <Solid faces={slab(16)} material="base" />
      <Strip cx={0} cy={0} w={120} d={120} c={20} z={27} />
      <Solid faces={slab(42)} material="base" />
      <Strip cx={0} cy={0} w={120} d={120} c={20} z={53} />
      <Solid faces={slab(68)} material="base" />
      <Strip cx={0} cy={0} w={120} d={120} c={20} z={79} />
      <Solid faces={prism(hexagon(0, 0, 30), 90, 16)} material="accent" />
      <Glow id={id} at={core} r={70} />
      <circle cx={core[0]} cy={core[1] - 6} r={7} className="iso-node iso-breathe" />
      <path
        d={`M${(dome.cx - dome.rx).toFixed(1)} ${dome.cy.toFixed(1)} A ${dome.rx.toFixed(1)} ${domeH} 0 0 1 ${(dome.cx + dome.rx).toFixed(1)} ${dome.cy.toFixed(1)}`}
        className="iso-dome"
      />
      <g className="iso-float">
        <Solid faces={doc} material="glass" />
        <path d={(() => {
          const l = [0, 1, 2].map((k) => [project([-86, 160 + k * 12, 70.5]), project([-56, 160 + k * 12, 70.5])]);
          return l.map(([a, b]) => `M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}`).join("");
        })()} className="iso-lines" />
      </g>
      <g className="iso-float iso-float-late">
        <Solid faces={bubble(0)} material="accent" />
        {[-16, 0, 16].map((dx) => {
          const c = project([180 + dx, -110 + dx * 0.0, 129.5]);
          return <circle key={dx} cx={c[0]} cy={c[1]} r={3.2} className="iso-dot" />;
        })}
      </g>
    </svg>
  );
}

/** Orochia — the 90 / 10 split: two hexagonal prisms on one plinth whose heights are the real shares (`share`, in
 *  percent), the creator's lit from inside in the violet → magenta of the brand; credits float beside it. */
export function IsoSplit({ id = "oc", share = 90, className }: { id?: string; share?: number; className?: string }) {
  const unit = 1.7;
  const big = prism(hexagon(-34, 34, 46), 12, share * unit);
  const small = prism(hexagon(58, -58, 46), 12, (100 - share) * unit);
  const top = project([-34, 34, 12 + share * unit]);
  const coin = (z: number) => prism(hexagon(150, 70, 20), z, 5);
  return (
    <svg viewBox="-250 -260 500 420" className={className} aria-hidden focusable="false">
      <Floor id={id} />
      <Solid faces={prism(hexagon(0, 0, 128), 0, 12)} material="base" />
      <Solid faces={small} material="base" />
      <Solid faces={big} material="accent2" />
      <Glow id={id} at={top} r={64} />
      <circle cx={top[0]} cy={top[1]} r={7} className="iso-node iso-breathe" />
      <g className="iso-float">
        <Solid faces={coin(40)} material="accent" />
        <Solid faces={coin(52)} material="accent" />
        <Solid faces={coin(64)} material="accent" />
      </g>
    </svg>
  );
}
