/* The documentation set, on one engine (Fumadocs).

   - ui           content/docs/ui — MDX written here. Its titles and descriptions on the site come from
                  messages (docs.pages.<section>.<page>), so the sidebar, the page heading and the SEO metadata
                  are translated; the body is English (developer documentation).
   - ui/<name>    one page per component of the @krizaka/ui (and @krizaka/charts) registry, generated at every build
                  (virtual pages, see componentFiles): the code of the component drives it. An optional
                  content/docs/ui/components/<name>.mdx enriches the generated page (its body is rendered under "Notes").

   The products' own documentation is on their sites, Krizaka Java's on java.krizaka.com (krizaka-build/site): next.config
   redirects /docs/<product> and /docs/java there.
   Every URL carries the locale (/en/docs/ui/card), so a docs link never goes through the locale redirect. */

import { loader, update, type VirtualFile } from "fumadocs-core/source";
import type * as PageTree from "fumadocs-core/page-tree";
import { ui } from "@/.source/server";
import { format, getDictionary, type Locale, type TranslationDictionary } from "@/lib/i18n";
import { getRegistryItems, type RegistryItem } from "@/lib/ui-registry";
import { type Foundation, foundationSlugs, foundationStructuredData, purposeOf } from "@/lib/ui-foundations";
import { GROUP_PAGES, JOBS, PATTERNS, placementOf, templatePurposeSlug } from "@/lib/ui-ia";

export const DOCS_SECTIONS = ["ui"] as const;
export type DocsSection = (typeof DOCS_SECTIONS)[number];

const COLLECTIONS = { ui };

/** What a generated page carries: the registry item it renders (title and description are its own), or the
    foundation it lays out from the packages' data (Typography, Icons: title and description from messages). */
export interface ComponentPageData {
  component?: string;
  /** A foundation of Krizaka UI laid out from the packages' data (Typography, Icons). */
  foundation?: Foundation;
}

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
  // The pages generated from the packages' data and the registry (@krizaka/fonts, @krizaka/tokens, @krizaka/icons, the
  // templates by intent, the mobile parity, the brand marks): virtual pages at /docs/ui/<slug>. The sidebar is
  // lib/docs-source.ts `uiTree` (lib/ui-ia.ts), not a meta.json: every component is placed by what it does.
  for (const foundation of foundationSlugs()) {
    if (written.has(`${foundation}.mdx`)) continue;
    out.push({
      type: "page",
      path: `${foundation}.mdx`,
      data: { title: foundation, foundation, structuredData: foundationStructuredData(foundation) } as never,
    });
  }
  return out;
}

function createSource(section: DocsSection, locale: Locale) {
  const source = COLLECTIONS[section].toFumadocsSource();
  const build = (edit: (files: VirtualFile[]) => VirtualFile[]) => update(source).files((files) => edit(files as VirtualFile[]) as typeof files).build();
  return loader({
    baseUrl: `/${locale}/docs/${section}`,
    source: section === "ui" ? build(componentFiles) : source,
    // The primitives live in content/docs/ui/components/ but are served flat: /docs/ui/card.
    slugs: (_file, next) => next().filter((slug, i) => !(section === "ui" && i === 0 && slug === "components")),
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

/** Title and description shown on the site — messages for the written pages, the code for the generated ones. */
export function pageText(section: DocsSection, page: DocsPage, t: TranslationDictionary): PageText {
  // A page of templates by intent: the intent's title and its "you come here when…".
  const foundation = (page.data as ComponentPageData).foundation;
  const purpose = foundation ? purposeOf(foundation) : null;
  if (purpose) {
    const words = t.docs.ia.purposes[purpose];
    return { title: words.title, description: words.when };
  }
  // A component page: its title and summary come from its code (the registry), in English.
  const component = (page.data as ComponentPageData).component;
  if (component) return { title: page.data.title ?? component, description: page.data.description ?? "" };
  const pages: Record<string, PageText | undefined> = t.docs.pages[section];
  const text = pages[pageKey(page.slugs)];
  return { title: text?.title ?? page.data.title ?? "", description: text?.description ?? page.data.description ?? "" };
}

/**
 * The sidebar of /docs/ui: seven groups, each with its "you come here when…" (lib/ui-ia.ts) — Get started, Foundations,
 * Components (by the job they do), Patterns (blocks, then screen layouts), Templates (by intent), Tooling, Mobile. A
 * heading appears once; a component is in one place; the deprecated ones close their job, flagged.
 */
function uiTree(source: DocsSource, t: TranslationDictionary, name: string): PageTree.Root {
  const ia = t.docs.ia;
  const pages = new Map(source.getPages().map((page) => [page.slugs.join("/"), page]));
  const item = (page: DocsPage, label?: string): PageTree.Item => ({
    type: "page",
    name: label ?? pageText("ui", page, t).title,
    url: page.url,
    $id: `ui:${page.url}`,
  });
  const separator = (id: string, label: string): PageTree.Separator => ({ type: "separator", $id: `ui:${id}`, name: label });
  const written = (slugs: readonly string[]) => slugs.flatMap((slug) => pages.get(slug === "index" ? "" : slug)).filter((page): page is DocsPage => Boolean(page)).map((page) => item(page));
  // The first two groups open at once; the long ones (components, patterns…) open on the group of the page being read.
  const folder = (group: keyof typeof ia.groups, children: PageTree.Node[]): PageTree.Folder => ({
    type: "folder",
    $id: `ui:${group}`,
    name: ia.groups[group].title,
    description: ia.groups[group].when,
    defaultOpen: group === "get-started" || group === "foundations",
    children,
  });
  const items = getRegistryItems();
  const itemsOf = (match: (placement: ReturnType<typeof placementOf>) => boolean) => items.filter((entry) => match(placementOf(entry)));
  const components = (entries: RegistryItem[]) =>
    entries.flatMap((entry) => {
      const page = pages.get(entry.name);
      if (!page) return [];
      return [item(page, entry.status === "deprecated" ? format(t.docs.component.deprecatedName, { name: entry.title }) : undefined)];
    });
  const jobs = JOBS.flatMap((job) => {
    const nodes = components(itemsOf((p) => p.group === "components" && p.job === job));
    return nodes.length ? [separator(`job:${job}`, ia.jobs[job].title), ...nodes] : [];
  });
  const patterns = PATTERNS.flatMap((pattern) => {
    const nodes = components(itemsOf((p) => p.group === "patterns" && p.pattern === pattern));
    return nodes.length ? [separator(`pattern:${pattern}`, ia.patterns[pattern].title), ...nodes] : [];
  });
  const templates = [pages.get("templates"), ...Object.keys(ia.purposes).map((purpose) => pages.get(templatePurposeSlug(purpose)))]
    .filter((page): page is DocsPage => Boolean(page))
    .map((page) => item(page));
  return {
    name,
    children: [
      folder("get-started", written(GROUP_PAGES["get-started"])),
      folder("foundations", written(GROUP_PAGES.foundations)),
      folder("components", jobs),
      folder("patterns", patterns),
      folder("templates", templates),
      folder("tooling", written(GROUP_PAGES.tooling)),
      folder("mobile", written(GROUP_PAGES.mobile)),
    ],
  };
}

/** The sidebar of a section in the reader's language. */
export function getPageTree(section: DocsSection, locale: Locale): PageTree.Root {
  const t = getDictionary(locale);
  const source = getSource(section, locale);
  const name = t.docs.sections[section].title;
  if (section === "ui") return uiTree(source, t, name);

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

/** Locale-less paths of every docs page (sitemap, llms.txt). */
export function allDocsPaths(): string[] {
  return DOCS_SECTIONS.flatMap((section) => [
    `/docs/${section}`,
    ...getSource(section, "en")
      .getPages()
      .filter((page) => page.slugs.length > 0)
      .map((page) => page.url.replace(/^\/en/, "")),
  ]);
}
