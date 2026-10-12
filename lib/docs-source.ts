/* The five documentation sets, on one engine (Fumadocs).

   - ui, java     content/docs/** — MDX written here. Their titles and descriptions on the site come from
                  messages (docs.pages.<section>.<page>), so the sidebar, the page heading and the SEO metadata
                  are translated; the body is English (developer documentation), like the synced product docs.
   - yororis      content/docs/yororis — written here while Yororis is under construction (one page: what it is, what
                  it is not, the controls it inherits, what is studied); titles from messages like ui/java. It becomes
                  a synced product section when krizaka/yororis has code and docs:generate (PYO5).
   - ui/<name>    one page per component of the @krizaka/ui registry, generated at every build (virtual pages, see
                  componentFiles): the code of the component drives it. An optional content/docs/ui/components/
                  <name>.mdx enriches the generated page (its body is rendered under "Notes").
   - orazaka,     synced from the product repositories, compiled only for the files their publication manifest
     orochia      lists (source.config.ts); title, category, order and intro come from that manifest.
   - <product>/ui the product's design system, generated at every build from the registry of its kit
                  (@krizaka/orazaka-design-system, @krizaka/orochia-design-system — virtual pages, see kitFiles): an
                  overview (how the kit extends Krizaka UI), its foundations, one page per component.

   Every URL carries the locale (/en/docs/ui/card), so a docs link never goes through the locale redirect. */

import { loader, update, type VirtualFile } from "fumadocs-core/source";
import type * as PageTree from "fumadocs-core/page-tree";
import { java, orazaka, orochia, ui, yororis } from "@/.source/server";
import { DOCS_MANIFEST, type DocManifestEntry } from "@/lib/docs-manifest";
import { OROCHIA_DOCS_MANIFEST } from "@/lib/orochia-docs-manifest";
import { format, getDictionary, type Locale, type TranslationDictionary } from "@/lib/i18n";
import { CATEGORIES, getKitFoundations, getRegistryItems, type ProductKit, type RegistryItem } from "@/lib/ui-registry";
import { type Foundation, FOUNDATIONS, foundationStructuredData } from "@/lib/ui-foundations";

export const DOCS_SECTIONS = ["ui", "java", "orazaka", "orochia", "yororis"] as const;
export type DocsSection = (typeof DOCS_SECTIONS)[number];
export type WrittenSection = "ui" | "java" | "yororis";
export type ProductSection = "orazaka" | "orochia";

export const isProductSection = (section: DocsSection): section is ProductSection => section === "orazaka" || section === "orochia";

export const PRODUCT_MANIFESTS: Record<ProductSection, Record<string, DocManifestEntry>> = {
  orazaka: DOCS_MANIFEST,
  orochia: OROCHIA_DOCS_MANIFEST,
};

/** Reading order of the product categories in the sidebar. */
const CATEGORY_ORDER = ["getting-started", "architecture", "api", "core-features", "operations", "guidelines"];

const COLLECTIONS = { ui, java, orazaka, orochia, yororis };

/** A synced file `API_REFERENCE.md` is the page `api_reference` — the manifest's key and the old URL's slug. */
const productSlug = (path: string) => [path.replace(/\.md$/, "").split("/").pop()!.toLowerCase()];

/** What a generated page carries: the registry item it renders (title and description are its own), or the
    foundation it lays out from the packages' data (Typography, Icons: title and description from messages). */
export interface ComponentPageData {
  component?: string;
  /** A page of a product kit: its overview, its foundations, or one of its components (`component`). */
  kit?: ProductKit;
  kitPage?: "overview" | "foundations" | "component";
  /** A foundation of Krizaka UI laid out from the packages' data (Typography, Icons). */
  foundation?: Foundation;
}

/** The pages of a product's UI section, as Fumadocs files: `ui/index`, `ui/foundations`, `ui/<component>`. */
const KIT_DIR = "ui";

/** Plain text of the code-written documentation: `asChild` → asChild (titles, SEO, search, sidebar). */
const plain = (text: string) => text.replace(/`/g, "");

/** The words of a component for the search index: its summary and when to use it, under its title. */
function structuredData(item: RegistryItem) {
  const contents = [item.summary, ...item.whenToUse, ...item.whenNotToUse.map((w) => w.when), ...item.accessibility.notes];
  return { headings: [], contents: contents.map((content) => ({ heading: undefined, content: plain(content) })) };
}

/**
 * The ui collection, plus one page per component of the registry: virtual when there is no enrichment MDX, the MDX
 * page marked with its component otherwise; and the sidebar of the components, grouped by category.
 */
function componentFiles(files: VirtualFile[]): VirtualFile[] {
  const items = getRegistryItems();
  const byName = new Map(items.map((item) => [item.name, item]));
  const pagePath = (name: string) => `components/${name}.mdx`;
  const written = new Set(files.filter((f) => f.type === "page").map((f) => f.path));
  const out = files
    .filter((file) => !(file.type === "meta" && file.path === "components/meta.json"))
    .map((file) => {
      const name = file.type === "page" && file.path.startsWith("components/") ? file.path.slice(11, -4) : undefined;
      const item = name ? byName.get(name) : undefined;
      if (!item || file.type !== "page") return file;
      return { ...file, data: { ...file.data, title: item.title, description: plain(item.summary), component: item.name, structuredData: structuredData(item) } };
    });
  for (const item of items) {
    if (written.has(pagePath(item.name))) continue;
    out.push({
      type: "page",
      path: pagePath(item.name),
      data: { title: item.title, description: plain(item.summary), component: item.name, structuredData: structuredData(item) } as never,
    });
  }
  // The foundations generated from the packages' data (@krizaka/fonts, @krizaka/tokens, @krizaka/icons): virtual pages
  // at /docs/ui/typography and /docs/ui/icons, placed by content/docs/ui/meta.json.
  for (const foundation of FOUNDATIONS) {
    if (written.has(`${foundation}.mdx`)) continue;
    out.push({
      type: "page",
      path: `${foundation}.mdx`,
      data: { title: foundation, foundation, structuredData: foundationStructuredData(foundation) } as never,
    });
  }
  const pages = CATEGORIES.flatMap((category) => {
    const names = items.filter((item) => item.category === category).map((item) => item.name);
    return names.length ? [`---${category}---`, ...names] : [];
  });
  out.push({ type: "meta", path: "components/meta.json", data: { title: "Components", pages } });
  return out;
}

/** The UI section of a product: virtual pages generated from its kit's registry (its words are the kit's, in English). */
function kitFiles(kit: ProductKit, files: VirtualFile[]): VirtualFile[] {
  const t = getDictionary("en").docs.kit;
  const foundations = getKitFoundations(kit);
  const words = (contents: string[]) => ({ headings: [], contents: contents.map((content) => ({ heading: undefined, content })) });
  const page = (path: string, data: ComponentPageData & { title: string; description: string; structuredData?: unknown }): VirtualFile => ({
    type: "page",
    path: `${KIT_DIR}/${path}.mdx`,
    data: data as never,
  });
  return [
    ...files,
    page("index", { title: t.overview, description: t.overviewLead, kit, kitPage: "overview", structuredData: words([t.overviewLead]) }),
    page("foundations", {
      title: t.foundations,
      description: t.foundationsLead,
      kit,
      kitPage: "foundations",
      structuredData: words([t.foundationsLead, ...foundations.rules.map((rule) => `${rule.title}: ${plain(rule.text)}`)]),
    }),
    ...getRegistryItems(kit).map((item) =>
      page(item.name, {
        title: item.title,
        description: plain(item.summary),
        kit,
        kitPage: "component",
        component: item.name,
        structuredData: structuredData(item),
      }),
    ),
  ];
}

/** True for a page of a product's UI section (generated from its kit). */
export const isKitPage = (page: { data: unknown }) => Boolean((page.data as ComponentPageData).kitPage);

function createSource(section: DocsSection, locale: Locale) {
  const source = COLLECTIONS[section].toFumadocsSource();
  const build = (edit: (files: VirtualFile[]) => VirtualFile[]) => update(source).files((files) => edit(files as VirtualFile[]) as typeof files).build();
  return loader({
    baseUrl: `/${locale}/docs/${section}`,
    source: section === "ui" ? build(componentFiles) : isProductSection(section) ? build((files) => kitFiles(section, files)) : source,
    slugs: isProductSection(section)
      ? (file) =>
          file.path.startsWith(`${KIT_DIR}/`)
            ? file.path.replace(/\.mdx$/, "").split("/").filter((slug) => slug !== "index")
            : productSlug(file.path)
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
  const data = page.data as ComponentPageData;
  if (data.kitPage === "overview") return { title: format(t.docs.kit.overviewTitle, { product: t.docs.sections[section].title }), description: t.docs.kit.overviewLead };
  if (data.kitPage === "foundations") return { title: format(t.docs.kit.foundationsTitle, { product: t.docs.sections[section].title }), description: t.docs.kit.foundationsLead };
  if (data.kitPage === "component") return { title: page.data.title ?? data.component ?? "", description: page.data.description ?? "" };
  if (isProductSection(section)) {
    const entry = PRODUCT_MANIFESTS[section][pageKey(page.slugs)];
    return { title: entry?.title ?? pageKey(page.slugs), description: entry?.intro ?? page.data.description ?? "" };
  }
  // A component page: its title and summary come from its code (the registry), in English.
  const component = (page.data as ComponentPageData).component;
  if (component) return { title: page.data.title ?? component, description: page.data.description ?? "" };
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

/** A page that is served: a written or generated page, or a synced product doc its manifest publishes. */
export function isPublished(section: DocsSection, page: DocsPage): boolean {
  return !isProductSection(section) || isKitPage(page) || pageKey(page.slugs) in PRODUCT_MANIFESTS[section];
}

/** The UI section of a product: its overview, its foundations, then its components (deprecated ones flagged, last). */
function kitTree(section: ProductSection, source: DocsSource, t: TranslationDictionary): PageTree.Folder {
  const k = t.docs.kit;
  const pages = source.getPages().filter(isKitPage);
  const item = (page: DocsPage, name: string): PageTree.Item => ({ type: "page", name, url: page.url, $id: `${section}:${page.url}` });
  const find = (kitPage: string) => pages.find((p) => (p.data as ComponentPageData).kitPage === kitPage);
  const overview = find("overview");
  const foundations = find("foundations");
  const components = getRegistryItems(section).flatMap((entry) => {
    const page = pages.find((p) => (p.data as ComponentPageData).component === entry.name);
    return page ? [item(page, entry.status === "deprecated" ? format(k.deprecatedName, { name: entry.title }) : entry.title)] : [];
  });
  return {
    type: "folder",
    $id: `${section}:ui`,
    name: k.sidebar,
    defaultOpen: false,
    index: overview ? item(overview, k.overview) : undefined,
    children: [
      ...(foundations ? [item(foundations, k.foundations)] : []),
      { type: "separator", $id: `${section}:ui:components`, name: k.components },
      ...components,
    ],
  };
}

/** Product docs: one folder per manifest category, in reading order, pages by manifest order; then the UI section. */
function productTree(section: ProductSection, source: DocsSource, t: TranslationDictionary, name: string): PageTree.Root {
  const manifest = PRODUCT_MANIFESTS[section];
  const categories: Record<string, string> = t.docs.categories;
  const byCategory = new Map<string, { order: number; item: PageTree.Item }[]>();
  for (const page of source.getPages()) {
    const entry = isKitPage(page) ? undefined : manifest[pageKey(page.slugs)];
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
  return { name, children: [...children, kitTree(section, source, t)] };
}

/** Locale-less paths of every docs page (sitemap, llms.txt). */
export function allDocsPaths(): string[] {
  return DOCS_SECTIONS.flatMap((section) => [
    `/docs/${section}`,
    ...getSource(section, "en")
      .getPages()
      .filter((page) => isPublished(section, page))
      .filter((page) => page.slugs.length > 0)
      .map((page) => page.url.replace(/^\/en/, "")),
  ]);
}
