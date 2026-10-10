import { getDictionary, type Locale } from "@/lib/i18n";
import { CATEGORIES, getRegistryItems } from "@/lib/ui-registry";
import { CatalogFilter, type CatalogEntry } from "./CatalogFilter";

/* The one list of Krizaka components — web, mobile or both — generated from the @krizaka/ui registry and filtered by
   platform. Rendered on /docs/ui (`<ComponentCatalog />` in content/docs/ui/index.mdx). Server Component: the
   filter is the only client part. */
export function ComponentCatalog({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).docs;
  const entries: CatalogEntry[] = getRegistryItems().map((item) => ({
    name: item.name,
    title: item.title,
    summary: item.summary,
    platforms: item.platforms,
    status: item.status,
    category: item.category,
    href: `/${locale}/docs/ui/${item.name}`,
  }));
  const groups = CATEGORIES.map((category) => ({ category, label: t.component.categories[category] }));
  return <CatalogFilter entries={entries} groups={groups} />;
}
