/* The Orazaka packs, as the site sells them.
   Read from app/data/architecture.json → `packs`, generated from the krizaka/orazaka-packs repository (each pack.yaml,
   its i18n/*.yaml, its Studios' blueprints and rulesets) by `orazaka docs build` and copied by `orazaka docs sync` —
   never written here (AGENTS.md §2). A pack's words are its own translations (`text.<locale>`), read with the locale
   key. A bundle the catalogue keeps off the shelf (`catalog.status: DRAFT`, e.g. the platform's test pack) has
   `showcase: false` and is never shown. Server-side: pages pass the slice they render. */

import architecture from "@/app/data/architecture.json";
import type { Locale } from "@/lib/i18n";

export interface PackText {
  label: string | null;
  tagline: string | null;
  description: string | null;
}

export interface PackStudio {
  key: string;
  profession: string | null;
  iconKey: string | null;
  pricing: string | null;
  estimatedCredits: number | null;
  steps: number;
  stepKinds: string[];
  text: Record<string, PackText | null>;
}

export interface PackRuleset {
  id: string;
  label: string;
  jurisdiction: string | null;
  versions: string[];
  rules: number;
}

export interface Pack {
  key: string;
  version: string | null;
  tier: string | null;
  kind: string | null;
  distribution: string | null;
  regulatoryClass: string | null;
  status: string;
  showcase: boolean;
  iconKey: string | null;
  workers: string[];
  scopeGuard: boolean;
  consent: boolean;
  safety: boolean;
  rulesets: PackRuleset[];
  text: Record<string, PackText | null>;
  studios: PackStudio[];
}

function fail(message: string): never {
  throw new Error(`orazaka-packs: ${message} — regenerate app/data/architecture.json with \`orazaka docs sync\``);
}

/** The packs on the shelf, in the catalogue's order. Fails the build when the generated catalogue is missing. */
export function showcasePacks(): Pack[] {
  const packs = (architecture as { packs?: Pack[] }).packs;
  if (!Array.isArray(packs) || packs.length === 0) fail("no packs");
  for (const p of packs) if (!p.key || !Array.isArray(p.studios) || !p.text) fail(`pack ${p.key ?? "?"} has no studios or text`);
  return packs.filter((p) => p.showcase);
}

/** A pack's or a Studio's words in the reader's language — English when the pack has no translation for it. */
export function packText(texts: Record<string, PackText | null>, locale: Locale): PackText {
  return texts[locale] ?? texts.en ?? { label: null, tagline: null, description: null };
}

/** The title of a pack: its own label, or (a pack without a catalogue entry) its first Studio's. */
export function packTitle(pack: Pack, locale: Locale): string {
  return packText(pack.text, locale).label ?? (pack.studios[0] ? packText(pack.studios[0].text, locale).label : null) ?? pack.key;
}
