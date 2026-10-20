/* The engine, in one glance (/story): Orazaka at the centre, the products around it, one plain connector each — solid
   where the use is wired, dashed and dim where it is planned (lib/engine-uses.ts: only what runs is drawn solid).
   A clean static version until @krizaka/ui's EngineFlow (radial on desktop, top to bottom on a phone) is released — the
   home's engine flow, same data; swap this file's body for it then. Nothing overlaps: every connector runs under the
   marks' own discs and stops at them, the names sit on the outer side of each mark, the legend is a line under the
   drawing. A phone gets the products in a grid above the engine, one stem between them (CSS only).
   Decorative (`role="img"` with a name); the text version is the fold under it (the list of what each product uses it
   for). No motion. A server component. Words: site.story.engine.*, site.products.engine.*. */

import type { CSSProperties } from "react";
import { ProductLogo } from "@krizaka/ui";
import { ENGINE_USES } from "@/lib/engine-uses";
import { format } from "@/lib/i18n";
import { PRODUCTS } from "@/lib/products";
import { ENGINE } from "@/lib/story";
import { H, W, placeNodes } from "@/lib/engine-map";

export default function EngineMap({ words }: { words: { label: string; note: string; wired: string; planned: string } }) {
  const nodes = placeNodes(ENGINE_USES.length);
  return (
    <figure className={"em brand-" + ENGINE} role="img" aria-label={format(words.label, { count: String(ENGINE_USES.length) })}>
      <div className="em-box" aria-hidden="true">
        <svg className="em-lines" viewBox={`0 0 ${W} ${H}`} focusable="false">
          {ENGINE_USES.map((u, i) => {
            const [x1, y1, x2, y2] = nodes[i]!.line;
            return <line key={u.id} className={"em-line brand-" + u.id} data-planned={u.planned ? "" : undefined} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </svg>
        <span className="em-hub">
          <ProductLogo id={ENGINE} size={52} animated={false} />
        </span>
        {ENGINE_USES.map((u, i) => {
          const n = nodes[i]!;
          return (
            <span
              key={u.id}
              className={"em-node brand-" + u.id}
              data-side={n.side}
              data-planned={u.planned ? "" : undefined}
              style={{ "--x": `${(n.x / W) * 100}%`, "--y": `${(n.y / H) * 100}%` } as CSSProperties}
            >
              <span className="em-mark">
                <ProductLogo id={u.id} size={34} animated={false} />
              </span>
              <span className="em-name">{PRODUCTS.find((p) => p.id === u.id)!.name}</span>
            </span>
          );
        })}
      </div>
      <figcaption className="em-note" aria-hidden="true">
        <span className="em-key em-key-wired">{words.wired}</span>
        <span className="em-key em-key-planned">{words.planned}</span>
        <span className="em-note-text">{words.note}</span>
      </figcaption>
    </figure>
  );
}
