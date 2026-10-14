/* The foundations of /docs/ui — Typography and Icons — read from the packages that ship them, at build time: their
   words, rules and data are written in krizaka-ui beside the code (@krizaka/fonts `fonts`/`rules`, @krizaka/tokens
   `typeScale`, @krizaka/icons/glyphs `glyphIndex`/`iconGroups`/`iconGuidelines`), never here. The site only lays them
   out (TypographyDoc, IconsDoc) and indexes them for the search. */

import { fonts, rules } from "@krizaka/fonts";
import { glyphIndex, iconGroups, iconGuidelines } from "@krizaka/icons/glyphs";
import { typeScale } from "@krizaka/tokens";
import { BRAND_PAGE, MOBILE_PAGE, TEMPLATE_PAGE, templatePurposeSlug } from "@/lib/ui-ia";
import { getRegistryIndex, getRegistryItems, type RegistryExample, type RegistryIndex, type RegistryItem, type TemplatePurpose } from "@/lib/ui-registry";

export { fonts, glyphIndex, iconGroups, iconGuidelines, rules, typeScale };

/** The generated pages of /docs/ui that no MDX file writes: two foundations, the templates (all, then one page per
    intent: `templates-<purpose>`), the mobile parity and the brand marks — by slug. */
export const FOUNDATIONS = ["typography", "icons", TEMPLATE_PAGE, MOBILE_PAGE, BRAND_PAGE] as const;
export type Foundation = (typeof FOUNDATIONS)[number] | `${typeof TEMPLATE_PAGE}-${TemplatePurpose}`;

/** The intents the templates are grouped by, from the registry: the id, its title and its "you come here when…". */
export function templatePurposes(): { id: TemplatePurpose; title: string; useWhen: string }[] {
  const groups = getRegistryIndex().templatePurposes ?? ({} as NonNullable<RegistryIndex["templatePurposes"]>);
  return (Object.keys(groups) as TemplatePurpose[]).map((id) => ({ id, ...groups[id] }));
}

/** Every generated page slug, the pages of the intents included. */
export const foundationSlugs = (): Foundation[] => [...FOUNDATIONS, ...templatePurposes().map(({ id }) => templatePurposeSlug(id) as Foundation)];
export const isFoundation = (slug: string): slug is Foundation => (foundationSlugs() as string[]).includes(slug);

/** The intent a `templates-<purpose>` page is about. */
export const purposeOf = (foundation: Foundation): TemplatePurpose | null => (foundation.startsWith(`${TEMPLATE_PAGE}-`) ? (foundation.slice(TEMPLATE_PAGE.length + 1) as TemplatePurpose) : null);

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

/** A template, with the component it is an example of: the page it is shown on and the code it is copied from. */
export interface TemplateEntry {
  item: RegistryItem;
  example: RegistryExample;
  platform: "web" | "native";
  purpose: TemplatePurpose;
  why: string;
}

/** The templates of @krizaka/ui — the examples of a component flagged `template`, web and native — in the registry's order
    (by intent, then component); `purpose` keeps one intent. */
export function templateEntries(purpose?: TemplatePurpose): TemplateEntry[] {
  const order = templatePurposes().map(({ id }) => id);
  return getRegistryItems()
    .flatMap((item) =>
      (["web", "native"] as const).flatMap((platform) =>
        (item[platform]?.examples ?? []).filter((example) => example.template && example.purpose && example.why).map((example) => ({ item, example, platform, purpose: example.purpose!, why: example.why! })),
      ),
    )
    .filter((entry) => !purpose || entry.purpose === purpose)
    .sort((a, b) => order.indexOf(a.purpose) - order.indexOf(b.purpose) || a.item.name.localeCompare(b.item.name) || a.example.name.localeCompare(b.example.name));
}

/** The words of a foundation page for the search index (Fumadocs structured data). */
export function foundationStructuredData(page: Foundation) {
  const contents =
    page === TEMPLATE_PAGE || page.startsWith(`${TEMPLATE_PAGE}-`)
      ? templateEntries(purposeOf(page) ?? undefined).map(({ item, example, why }) => `${example.title} (${item.title}): ${example.description} ${why}`)
      : page === MOBILE_PAGE || page === BRAND_PAGE
      ? []
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
