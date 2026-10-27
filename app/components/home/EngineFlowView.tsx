/* The engine and the products it powers, drawn on Orazaka's card on the home — @krizaka/ui's EngineFlow (SVG + CSS, the
   one motion system; the generic piece of krizaka-motion's « Orazaka Neural Pipeline Flow »). Radial on desktop and
   tablet (Orazaka at the centre: « one engine, the products it powers » in one glance), top to bottom on a phone (the
   products in a row above, flowing down into the engine).
   Only what runs is drawn (lib/engine-uses.ts): requests go in from every wired product and results come back to it;
   a planned product is dim, its conduit dashed and still. No settings for visitors (the lab has them). Pointing at or
   focusing a product says what it uses Orazaka for, with a link to its site. Paused off screen, still under reduced
   motion; the text version is each product row's « On Orazaka · … » line. Words: site.home.products.flow.* */

import { ProductLogo } from "@krizaka/ui";
import { EngineFlow, type EngineFlowNode } from "@krizaka/ui/engine-flow";
import { ENGINE_USES } from "@/lib/engine-uses";
import { format, type TranslationDictionary } from "@/lib/i18n";
import { PRODUCTS } from "@/lib/products";
import { hostOf } from "@/lib/stack";
import { ENGINE } from "@/lib/story";

export default function EngineFlowView({ t }: { t: TranslationDictionary }) {
  const f = t.site.home.products.flow;
  const e = t.site.products.engine;
  const engine = PRODUCTS.find((p) => p.id === ENGINE)!;
  const nodes: EngineFlowNode[] = ENGINE_USES.map((u) => {
    const p = PRODUCTS.find((x) => x.id === u.id)!;
    return {
      id: u.id,
      label: p.name,
      className: "brand-" + u.id + " kz-home-n-" + u.id, // kz-home-n-<id>: ProductsLink ties the node to its row
      mark: <ProductLogo id={u.id} size={28} animated={false} />,
      // Requests in from every wired product; results back where they run (every wired use has `results`).
      flow: u.planned ? "in" : u.back.length > 0 ? "both" : "in",
      planned: u.planned,
      status: u.planned ? e.planned : undefined,
      description: format(u.planned ? f.usesPlanned : f.uses, { use: e.uses[u.id as keyof typeof e.uses] }),
      href: p.devUrl,
      external: true,
      linkLabel: format(f.visit, { host: hostOf(p.devUrl) }),
    };
  });
  return (
    <EngineFlow
      className={"kz-home-flow brand-" + ENGINE}
      label={f.label}
      hub={{ label: engine.name, caption: f.caption, mark: <ProductLogo id={ENGINE} size={56} animated={false} /> }}
      nodes={nodes}
      layout="radial"
      compactLayout="top-to-bottom"
      particles="photons"
      conduit="bezier"
      hint={f.hint}
    />
  );
}
