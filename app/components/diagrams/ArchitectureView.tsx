/* The module map of Krizaka Java, filtered, for any doc: ```architecture blocks and
   <ArchitectureView product="java" focus="krizaka-security" mode="build" /> in MDX. Server side: it hands ModuleMap the
   product's slice of the generated model. */

import ModuleMap, { type View } from "./ModuleMap";
import { moduleMapData, type Product } from "@/lib/architecture-model";
import { parseArchitecture } from "@/lib/structured-diagrams";

export interface ArchitectureViewProps {
  product?: Product;
  focus?: string;
  mode?: View;
  owner?: string;
  /** The text of a ```architecture block (product, focus, mode, owner — one per line). */
  source?: string;
  compact?: boolean;
}

export default function ArchitectureView({ fallback, compact = true, ...props }: ArchitectureViewProps & { fallback: Product | null }) {
  const block = parseArchitecture(
    props.source ??
      Object.entries({ product: props.product, focus: props.focus, mode: props.mode, owner: props.owner })
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n"),
    fallback,
  );
  return (
    <div className="not-prose" style={{ margin: "24px 0 32px" }}>
      <ModuleMap
        data={moduleMapData(block.product)}
        compact={compact}
        initial={{
          view: block.view ?? undefined,
          ...(block.focus ? { focus: block.focus } : {}),
          ...(block.owner ? { owner: block.owner as never } : {}),
        }}
      />
    </div>
  );
}
