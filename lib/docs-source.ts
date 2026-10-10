/* The four documentation sets, on one engine (Fumadocs).

   - ui, java     content/docs/** — MDX written here. Their titles and descriptions on the site come from
                  messages (docs.pages.<section>.<page>), so the sidebar, the page heading and the SEO metadata
                  are translated; the body is English (developer documentation), like the synced product docs.
   - orazaka,     synced from the product repositories, compiled only for the files their publication manifest
     orochia      lists (source.config.ts); title, category, order and intro come from that manifest.

   Every URL carries the locale (/en/docs/ui/card), so a docs link never goes through the locale redirect. */

import { loader } from "fumadocs-core/source";
import type * as PageTree from "fumadocs-core/page-tree";
import { java, orazaka, orochia, ui } from "@/.source/server";
import { DOCS_MANIFEST, type DocManifestEntry } from "@/lib/docs-manifest";
import { OROCHIA_DOCS_MANIFEST } from "@/lib/orochia-docs-manifest";
import { getDictionary, type Locale, type TranslationDictionary } from "@/lib/i18n";

export const DOCS_SECTIONS = ["ui", "java", "orazaka", "orochia"] as const;
export type DocsSection = (typeof DOCS_SECTIONS)[number];
export type WrittenSection = "ui" | "java";
export type ProductSection = "orazaka" | "orochia";

export const isProductSection = (section: DocsSection): section is ProductSection => section === "orazaka" || section === "orochia";

export const PRODUCT_MANIFESTS: Record<ProductSection, Record<string, DocManifestEntry>> = {
  orazaka: DOCS_MANIFEST,
  orochia: OROCHIA_DOCS_MANIFEST,
};

/** Reading order of the product categories in the sidebar. */
const CATEGORY_ORDER = ["getting-started", "architecture", "api", "core-features", "operations", "guidelines"];

const COLLECTIONS = { ui, java, orazaka, orochia };

/** A synced file `API_REFERENCE.md` is the page `api_reference` — the manifest's key and the old URL's slug. */
const productSlug = (path: string) => [path.replace(/\.md$/, "").split("/").pop()!.toLowerCase()];

function createSource(section: DocsSection, locale: Locale) {
  return loader({
    baseUrl: `/${locale}/docs/${section}`,
    source: COLLECTIONS[section].toFumadocsSource(),
    slugs: isProductSection(section)
      ? (file) => productSlug(file.path)
      : // The primitives live in content/docs/ui/components/ but are served flat: /docs/ui/card.
        (_file, next) => next().filter((slug, i) => !(section === "ui" && i === 0 && slug === "components")),
  });
}

type DocsSource = ReturnType<typeof createSource>;
export type DocsPage = ReturnType<DocsSource["getPages"]>[number];

const sources = new Map<string, DocsSource>();

export function getSource(section: DocsSection, locale: Locale): DocsSource {
  const key = `${section}:${locale}`;
  if (!sources.has(key)) sources.set(key, createSource(section, locale));
  return sources.get(key)!;
}

/** The message key of a written page: its last slug, `index` for the section's home. */
export const pageKey = (slugs: string[]) => slugs.at(-1) ?? "index";

export interface PageText {
  title: string;
  description: string;
}

/** Title and description shown on the site — messages for ui/java, the manifest for the products. */
export function pageText(section: DocsSection, page: DocsPage, t: TranslationDictionary): PageText {
  if (isProductSection(section)) {
    const entry = PRODUCT_MANIFESTS[section][pageKey(page.slugs)];
    return { title: entry?.title ?? pageKey(page.slugs), description: entry?.intro ?? page.data.description ?? "" };
  }
  const pages: Record<string, PageText | undefined> = t.docs.pages[section];
  const text = pages[pageKey(page.slugs)];
  return { title: text?.title ?? page.data.title ?? "", description: text?.description ?? page.data.description ?? "" };
}

/** The sidebar of a section in the reader's language. */
export function getPageTree(section: DocsSection, locale: Locale): PageTree.Root {
  const t = getDictionary(locale);
  const source = getSource(section, locale);
  const name = t.docs.sections[section].title;
  if (isProductSection(section)) return productTree(section, source, t, name);

  const separators: Record<string, string> = t.docs.separators;
  const localize = (node: PageTree.Node): PageTree.Node => {
    if (node.type === "page") {
      const page = source.getNodePage(node);
      if (!page) return node;
      const text = pageText(section, page, t);
      return { ...node, name: text.title, description: text.description };
    }
    if (node.type === "separator") {
      const label = typeof node.name === "string" ? separators[node.name.toLowerCase()] : undefined;
      return { ...node, name: label ?? node.name };
    }
    return {
      ...node,
      name: separators[String(node.name).toLowerCase()] ?? node.name,
      index: node.index ? (localize(node.index) as PageTree.Item) : undefined,
      children: node.children.map(localize),
    };
  };
  const tree = source.getPageTree();
  return { ...tree, name, children: tree.children.map(localize) };
}

/** Product docs: one folder per manifest category, in reading order, pages by manifest order. */
function productTree(section: ProductSection, source: DocsSource, t: TranslationDictionary, name: string): PageTree.Root {
  const manifest = PRODUCT_MANIFESTS[section];
  const categories: Record<string, string> = t.docs.categories;
  const byCategory = new Map<string, { order: number; item: PageTree.Item }[]>();
  for (const page of source.getPages()) {
    const entry = manifest[pageKey(page.slugs)];
    if (!entry) continue;
    const list = byCategory.get(entry.category) ?? [];
    list.push({ order: entry.order, item: { type: "page", name: entry.title, url: page.url, $id: `${section}:${page.url}` } });
    byCategory.set(entry.category, list);
  }
  const rank = (category: string) => {
    const i = CATEGORY_ORDER.indexOf(category);
    return i < 0 ? CATEGORY_ORDER.length : i;
  };
  const children: PageTree.Node[] = [...byCategory.entries()]
    .sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b))
    .map(([category, items]) => ({
      type: "folder",
      $id: `${section}:${category}`,
      name: categories[category] ?? category,
      defaultOpen: true,
      children: items.sort((a, b) => a.order - b.order).map(({ item }) => item),
    }));
  return { name, children };
}

/** Locale-less paths of every docs page (sitemap, llms.txt). */
export function allDocsPaths(): string[] {
  return DOCS_SECTIONS.flatMap((section) => [
    `/docs/${section}`,
    ...getSource(section, "en")
      .getPages()
      .filter((page) => !isProductSection(section) || pageKey(page.slugs) in PRODUCT_MANIFESTS[section])
      .filter((page) => page.slugs.length > 0)
      .map((page) => page.url.replace(/^\/en/, "")),
  ]);
}
