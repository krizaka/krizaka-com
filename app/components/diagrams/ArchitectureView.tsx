/* The module map of a product, filtered, for any page or doc: ```architecture blocks of the synced docs and
   <ArchitectureView product="orazaka" focus="krizaka-billing-service" mode="runtime" /> in MDX. Server side: it
   hands ModuleMap the product's slice of the generated model and its journeys, with their words. */

import ModuleMap, { type View } from "./ModuleMap";
import { architectureCounts, moduleMapData, type Product } from "@/lib/architecture-model";
import { journeysFor } from "@/lib/journeys";
import { getDictionary, type Locale } from "@/lib/i18n";
import { parseArchitecture } from "@/lib/structured-diagrams";

export interface ArchitectureViewProps {
  product?: Product;
  focus?: string;
  mode?: View;
  journey?: string;
  owner?: string;
  /** The text of a ```architecture block (product, focus, mode, journey, owner — one per line). */
  source?: string;
  compact?: boolean;
}

export default function ArchitectureView({ locale, fallback, compact = true, ...props }: ArchitectureViewProps & { locale: Locale; fallback: Product | null }) {
  const block = parseArchitecture(
    props.source ??
      Object.entries({ product: props.product, focus: props.focus, mode: props.mode, journey: props.journey, owner: props.owner })
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n"),
    fallback,
  );
  const counts = architectureCounts();
  const journeys = journeysFor(block.product, getDictionary(locale), { core: counts.coreInterceptors, configured: counts.configuredInterceptors });
  if (block.journey && !journeys.some((j) => j.id === block.journey)) {
    throw new Error(`architecture block: no journey ${block.journey} for ${block.product} (${journeys.map((j) => j.id).join(", ") || "none"})`);
  }
  return (
    <div className="not-prose" style={{ margin: "24px 0 32px" }}>
      <ModuleMap
        data={moduleMapData(block.product)}
        journeys={journeys}
        compact={compact}
        initial={{
          view: block.view ?? undefined,
          ...(block.focus ? { focus: block.focus } : {}),
          ...(block.journey ? { journey: block.journey, view: "journey" as const } : {}),
          ...(block.owner ? { owner: block.owner as never } : {}),
        }}
      />
    </div>
  );
}
