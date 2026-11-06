/* A product by its commercial name (Verikora, Sovkora, Folioviv, Kridoc) in the contact link: what the products' waiting pages
   write in `/contact?topic=verikora&source=verikora-com` (réunion 6, 2026-11-05, krizaka-internal#2629), so no code name is in an
   address a visitor can read. The topics keep their code names, which the form still takes. */
import { CONTACT_TOPICS, type ContactTopic } from "./contact.ts";

const COMMERCIAL_TOPIC: Record<string, ContactTopic> = {
  verikora: "yomizaka",
  sovkora: "orazaka",
  folioviv: "akinaza",
  kridoc: "other",
};

/** The topic of `?topic=`: a listed topic, or a product's commercial name; none when it is neither. */
export function topicFromQuery(requested: string | null): ContactTopic | null {
  if (!requested) return null;
  if ((CONTACT_TOPICS as readonly string[]).includes(requested)) return requested as ContactTopic;
  return COMMERCIAL_TOPIC[requested] ?? null;
}

/** The topic a product's site implies as the source (`verikora-com`): none for Kridoc (no topic of its own) and for any other source. */
export function topicForProductSite(source: string | null): ContactTopic | null {
  const site = source?.match(/^([a-z]+)-com$/)?.[1];
  return site && site !== "kridoc" ? (COMMERCIAL_TOPIC[site] ?? null) : null;
}
