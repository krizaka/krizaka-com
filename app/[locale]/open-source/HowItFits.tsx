/* "How it fits": the architecture in one diagram, read from data (lib/how-it-fits.ts) — the building blocks, then the
   shared services, top to bottom. The diagram IS an ordered list (its own text version): it reads
   the same with a screen reader, at phone width (one column), in both themes, with no motion. */

import type { Layers } from "@/lib/how-it-fits";

export interface FitsWords {
  blocks: string;
  npm: string;
  java: string;
  services: string;
}

export default function HowItFits({ layers, w }: { layers: Layers; w: FitsWords }) {
  return (
    <ol className="os-fits">
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
