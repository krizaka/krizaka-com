/* What a contact link says (`/contact?topic=support&product=verikora&source=verikora-footer`): the kind in `topic`, the product by
   its commercial name in `product` (réunion 6, 2026-11-05, krizaka-internal#2629; the kind: founder, 2026-11-06). The old links keep
   working (contact-kinds.ts): `topic=verikora`, `topic=yomizaka`, `topic=enterprise`. An explicit value beats what the source implies. */
import { presetForSource } from "./contact.ts";
import { CONTACT_KINDS, legacyPreset, productOf, type ContactKind, type ContactPreset } from "./contact-kinds.ts";

const kindOf = (v: string | null): ContactKind | null => CONTACT_KINDS.find((k) => k === v) ?? null;

export interface ContactQuery {
  topic: string | null;
  product: string | null;
  source: string | null;
}

/** The kind and the product of a contact link: its `topic` and `product` first, then the page it comes from. */
export function presetFromQuery({ topic, product, source }: ContactQuery): ContactPreset {
  const old = legacyPreset(topic);
  const fromSource = presetForProductSite(source) ?? presetForSource(source);
  return {
    kind: kindOf(topic) ?? old?.kind ?? fromSource.kind,
    product: productOf(product) ?? old?.product ?? fromSource.product,
  };
}

/** What a product's own site implies as the source (`verikora-com`): its product. None for any other source. */
export function presetForProductSite(source: string | null): ContactPreset | null {
  const site = source?.match(/^([a-z]+)-com$/)?.[1];
  const found = productOf(site);
  return found ? { kind: null, product: found } : null;
}
