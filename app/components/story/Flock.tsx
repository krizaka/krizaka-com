"use client";

import { Mascot } from "@krizaka/ui/mascots";
import PhoenixMark from "./PhoenixMark";
import type { BirdId } from "@/lib/story";

/**
 * The portrait of one bird of the flock — the Krizaka mascots, from @krizaka/ui/mascots (the same birds the products
 * use), in their own colours of the story (`tone="own"`). The phoenix is the story's own mark.
 */
export function BirdPortrait({ id, size = 92 }: { id: BirdId; size?: number }) {
  const box = { width: size, height: size, display: "flex", alignItems: "flex-end", justifyContent: "center" } as const;
  if (id === "phoenix") return <div style={box}><PhoenixMark size={size} /></div>;
  return (
    <div style={box}>
      <Mascot bird={id} mood="welcome" tone="own" size={size} />
    </div>
  );
}

/** Kept for the pages that mount it: the mascots now carry their own styles. */
export function FlockStyles() {
  return null;
}
