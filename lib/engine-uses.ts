/* What each product uses the engine (Orazaka) for — structure only; the words are messages
   (site.products.engine.uses.<id>). `planned`: the product's repository states the intention, and the call is not
   wired to a real Studio yet — the card says "planned", never more. Source: each product repository's README/AGENTS. */

import type { ProductId } from "./products";

export interface EngineUse {
  id: ProductId;
  planned?: true;
}

export const ENGINE_USES: readonly EngineUse[] = [
  { id: "orochia" }, // Explorer: search and recommendations (apps/web explorer route)
  { id: "yomizaka" }, // document analyses are Orazaka runs (document-validation pack)
  { id: "kachizaka" }, // match facts read through Orazaka's MCP sports-feed connector
  { id: "akinaza", planned: true }, // the tax-assistant Studio (contract and a fake Studio exist)
  { id: "yasakia", planned: true }, // the matching agent (port with an `orazaka` adapter to come)
  { id: "yororis", planned: true }, // the wellbeing pack (under construction)
];
