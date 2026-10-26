/* "How it fits": the architecture in one diagram, read from data (lib/how-it-fits.ts) — the products, the engine, the
   building blocks, the shared services, top to bottom. The diagram IS an ordered list (its own text version): it reads
   the same with a screen reader, at phone width (one column), in both themes, with no motion. */

import { ProductLogo } from "@krizaka/ui";
import { format } from "@/lib/i18n";
import type { Layers } from "@/lib/how-it-fits";
import type { ProductId } from "@/lib/products";

export interface FitsWords {
  products: string;
  engine: string;
  engineMeta: string;
  blocks: string;
  npm: string;
  java: string;
  services: string;
}

export default function HowItFits({ layers, names, w }: { layers: Layers; names: Record<string, string>; w: FitsWords }) {
  return (
    <ol className="os-fits">
      <li className="os-fits-layer">
        <p className="os-fits-name">{w.products}</p>
        <ul className="os-fits-items">
          {layers.products.map((id) => (
            <li key={id} className={"os-fits-chip brand-" + id}>
              <ProductLogo id={id as ProductId} size={18} animated={false} /> {names[id]}
            </li>
          ))}
        </ul>
      </li>
      <li className="os-fits-layer os-fits-engine brand-orazaka">
        <p className="os-fits-name">{w.engine}</p>
        <ul className="os-fits-items">
          <li className="os-fits-chip os-fits-chip-lg">
            <ProductLogo id="orazaka" size={22} animated={false} /> {names[layers.engine.id]}
          </li>
        </ul>
        <p className="os-fits-meta">{format(w.engineMeta, { calls: layers.engine.calls, planned: layers.engine.planned })}</p>
      </li>
      <li className="os-fits-layer">
        <p className="os-fits-name">{w.blocks}</p>
        <p className="os-fits-sub">{w.npm}</p>
        <ul className="os-fits-items">
          {layers.blocks.npm.map((n) => (
            <li key={n} className="os-fits-chip os-fits-code">
              {n}
            </li>
          ))}
        </ul>
        <p className="os-fits-sub">{w.java}</p>
        <ul className="os-fits-items">
          {layers.blocks.java.map((n) => (
            <li key={n} className="os-fits-chip os-fits-code">
              {n}
            </li>
          ))}
        </ul>
      </li>
      <li className="os-fits-layer">
        <p className="os-fits-name">{w.services}</p>
        <ul className="os-fits-items">
          {layers.services.map((n) => (
            <li key={n} className="os-fits-chip os-fits-code">
              {n}
            </li>
          ))}
        </ul>
      </li>
    </ol>
  );
}
