/* The foundations of /docs/ui — Typography and Icons — read from the packages that ship them, at build time: their
   words, rules and data are written in krizaka-ui beside the code (@krizaka/fonts `fonts`/`rules`, @krizaka/tokens
   `typeScale`, @krizaka/icons/glyphs `glyphIndex`/`iconGroups`/`iconGuidelines`), never here. The site only lays them
   out (TypographyDoc, IconsDoc) and indexes them for the search. */

import { fonts, rules } from "@krizaka/fonts";
import { glyphIndex, iconGroups, iconGuidelines } from "@krizaka/icons/glyphs";
import { typeScale } from "@krizaka/tokens";
import { getRegistryItems, type RegistryExample, type RegistryItem } from "@/lib/ui-registry";

export { fonts, glyphIndex, iconGroups, iconGuidelines, rules, typeScale };

/** The generated foundation pages of /docs/ui, by slug. */
export const FOUNDATIONS = ["typography", "icons", "screens"] as const;
export type Foundation = (typeof FOUNDATIONS)[number];
export const isFoundation = (slug: string): slug is Foundation => (FOUNDATIONS as readonly string[]).includes(slug);

/** One icon of the gallery: what a client component needs to draw, find and copy it. */
export interface IconEntry {
  name: string;
  component: string;
  group: string;
  keywords: string;
}

export function iconEntries(): IconEntry[] {
  return Object.entries(glyphIndex).map(([name, entry]) => ({ name, component: entry.component, group: entry.group, keywords: entry.keywords }));
}

const plain = (text: string) => text.replace(/`/g, "");

/** The screens of @krizaka/ui: the examples of its layouts flagged `template` — whole screens, in registry order. */
export function templateEntries(): { item: RegistryItem; example: RegistryExample }[] {
  return getRegistryItems().flatMap((item) => (item.web?.examples ?? []).filter((example) => example.template).map((example) => ({ item, example })));
}

/** The words of a foundation page for the search index (Fumadocs structured data). */
export function foundationStructuredData(page: Foundation) {
  const contents =
    page === "screens"
      ? templateEntries().map(({ item, example }) => `${example.title} (${item.title}): ${example.description}`)
      : page === "typography"
      ? [
          ...fonts.flatMap((f) => [`${f.family} — ${f.role}. ${f.description}`, f.why, ...f.use, ...f.avoid]),
          ...typeScale.map((s) => `text-${s.name}: ${s.size} / ${s.lineHeight} · ${s.weight} — ${s.description}`),
          ...rules,
        ]
      : [
          ...iconGroups.map((g) => `${g.title}: ${g.description}`),
          ...iconEntries().map((i) => `${i.component} — ${i.keywords}`),
          ...iconGuidelines.grammar,
          ...iconGuidelines.color,
          ...iconGuidelines.accessibility,
          ...iconGuidelines.request,
        ];
  return { headings: [], contents: contents.map((content) => ({ heading: undefined, content: plain(content) })) };
}
