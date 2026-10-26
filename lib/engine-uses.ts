/* What each product uses the engine (Orazaka) for — structure only; the words are messages
   (site.products.engine.uses.<id>). `planned`: the product's repository states the intention, and the call is not
   wired to a real Studio yet — the card says "planned", never more. Source: each product repository's README/AGENTS. */

import type { ProductId } from "./products";

/** What comes back from Orazaka to the product — only what runs: `results` (the run's output), `analytics` (the
 *  knowledge-service analytics, ADR-081, read back). Run events (SSE) and signed webhooks are orazaka#189, still open:
 *  they are neither drawn nor said until they ship. */
export type EngineBack = "results" | "analytics";

export interface EngineUse {
  id: ProductId;
  back: readonly EngineBack[];
  planned?: true;
}

export const ENGINE_USES: readonly EngineUse[] = [
  { id: "yomizaka", back: ["results"] }, // document analyses are Orazaka runs (document-validation pack)
  { id: "akinaza", back: ["results"], planned: true }, // the tax-assistant Studio (contract and a fake Studio exist)
];
