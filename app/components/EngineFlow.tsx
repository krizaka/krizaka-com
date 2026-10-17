/* The engine's two-way flow (EngineCard): the products' marks on the left, Orazaka's on the right, and two lanes per
   product — out (requests, documents, prompts: dots in the product's colour) and back (results, analytics: dots in
   Orazaka's orange). Structure from lib/engine-uses.ts: a planned use is drawn still and dim, never as a live flow.
   Decorative (aria-hidden): the text version is the list of EngineCard. Motion: CSS only (.engine-flow in
   app/globals.css), paused off screen by @krizaka/ui's data-motion-scope, static under prefers-reduced-motion. */

import { ProductLogo } from "@krizaka/ui";
import { ENGINE_USES } from "@/lib/engine-uses";
import { ENGINE } from "@/lib/story";

const ROW = 38;
const MARK = 30;
const W = 120;

export function EngineFlow({ legendOut, legendBack }: { legendOut: string; legendBack: string }) {
  const n = ENGINE_USES.length;
  const h = n * ROW;
  const mid = h / 2;
  return (
    <div className="engine-flow" data-motion-scope aria-hidden="true">
      <div className="engine-flow-diagram" style={{ height: h }}>
        <ul className="engine-flow-marks" style={{ gridTemplateRows: `repeat(${n}, ${ROW}px)` }}>
          {ENGINE_USES.map((u) => (
            <li key={u.id} className={"brand-" + u.id}>
              <ProductLogo id={u.id} size={MARK} animated={false} />
            </li>
          ))}
        </ul>
        <svg className="engine-flow-lanes" viewBox={`0 0 ${W} ${h}`} preserveAspectRatio="none" focusable="false">
          <defs>
            <marker id="engine-arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0 0 L8 4 L0 8 z" fill="currentColor" stroke="none" />
            </marker>
          </defs>
          {ENGINE_USES.map((u, i) => {
            const y = i * ROW + ROW / 2;
            const dy = (i - (n - 1) / 2) * 1.6;
            const planned = u.planned ? "" : undefined;
            return (
              <g key={u.id} data-planned={planned}>
                <path className={"engine-lane engine-lane-out brand-" + u.id} data-lane="out" d={`M2 ${y - 3} C ${W * 0.55} ${y - 3}, ${W * 0.45} ${mid - 5 + dy}, ${W - 4} ${mid - 5 + dy}`} markerEnd="url(#engine-arrow)" />
                <path className={"engine-lane engine-lane-back brand-" + ENGINE} data-lane="back" d={`M${W - 4} ${mid + 5 + dy} C ${W * 0.45} ${mid + 5 + dy}, ${W * 0.55} ${y + 3}, 2 ${y + 3}`} markerEnd="url(#engine-arrow)" />
              </g>
            );
          })}
        </svg>
        <div className={"engine-flow-core brand-" + ENGINE}>
          <ProductLogo id={ENGINE} size={56} animated={false} />
        </div>
      </div>
      <p className="engine-flow-legend">
        <span className="engine-flow-key engine-flow-key-out">{legendOut}</span>
        <span className={"engine-flow-key engine-flow-key-back brand-" + ENGINE}>{legendBack}</span>
      </p>
    </div>
  );
}
