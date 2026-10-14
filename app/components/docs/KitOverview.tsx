import Link from "next/link";
import type { TOCItemType } from "fumadocs-core/toc";
import { ForwardIcon } from "@krizaka/icons";
import Rich from "@/app/components/Rich";
import { format, getDictionary, type Locale, type TranslationDictionary } from "@/lib/i18n";
import {
  CATEGORIES,
  componentHref,
  getKitFoundations,
  getRegistryIndex,
  getRegistryItems,
  KIT_PACKAGES,
  type ProductKit,
  type RegistryItem,
  resolveReference,
} from "@/lib/ui-registry";
import { CatalogFilter, type CatalogEntry } from "./CatalogFilter";
import { CodeBlock } from "./ExamplePreview";
import { InlineCode } from "./InlineCode";

/* The home of a product's UI section (/docs/<product>/ui): how its kit extends Krizaka UI — the three layers of its
   theme, how to install it, the components it adds (why, and on which primitive), the deprecated ones and what replaces
   them, what it re-exports from @krizaka/ui. Every fact comes from the kit's registry; the sentences around them from
   messages. Server Component. */

export function overviewToc(kit: ProductKit, t: TranslationDictionary): TOCItemType[] {
  const k = t.docs.kit;
  const hasDeprecated = getRegistryItems(kit).some((item) => item.status === "deprecated");
  const hasReexports = (getRegistryIndex(kit).reexports ?? []).length > 0;
  const entries: [string, string | false][] = [
    ["layers", k.layersTitle],
    ["install", k.installTitle],
    ["components", k.componentsTitle],
    ["deprecated", hasDeprecated && k.deprecatedTitle],
    ["reexports", hasReexports && k.reexportsTitle],
  ];
  return entries.filter(([, title]) => title).map(([id, title]) => ({ title, url: `#${id}`, depth: 2 }));
}

/** A component of the kit as a card: its title, summary and the primitives it is built on. */
function ComponentCard({ item, kit, locale, t }: { item: RegistryItem; kit: ProductKit; locale: Locale; t: TranslationDictionary }) {
  const builtOn = (item.builtOn ?? []).map((ref) => resolveReference(ref, kit).name);
  const replacement = item.deprecated?.use ? resolveReference(item.deprecated.use, kit) : null;
  return (
    <li>
      <Link href={componentHref(locale, kit, item.name)}>
        <span className="kz-related-title">{item.title}</span>
        <span className="kz-related-text">
          <InlineCode text={item.summary} />
        </span>
        {builtOn.length > 0 && (
          <span className="kz-related-kit">
            {t.docs.kit.builtOn} {builtOn.join(" · ")}
          </span>
        )}
        {replacement && (
          <span className="kz-related-kit">
            {t.docs.kit.useInstead} {replacement.kit === "ui" ? `${t.docs.kit.fromKrizakaUi} — ` : ""}
            {replacement.name}
          </span>
        )}
      </Link>
    </li>
  );
}

export function KitOverview({ kit, locale }: { kit: ProductKit; locale: Locale }) {
  const t = getDictionary(locale);
  const k = t.docs.kit;
  const index = getRegistryIndex(kit);
  const foundations = getKitFoundations(kit);
  const items = getRegistryItems(kit);
  const current = items.filter((item) => item.status !== "deprecated");
  const deprecated = items.filter((item) => item.status === "deprecated");
  const words = { product: t.docs.sections[kit].title, package: KIT_PACKAGES[kit], version: index.version };
  const uiNames = new Set(getRegistryIndex("ui").items.map((item) => item.name));
  /** `@krizaka/ui/button` → its page, when it is a documented component (the root exports — marks, motion — are not). */
  const uiPage = (from: string) => {
    const name = from.replace(/^@krizaka\/ui\/?/, "");
    return uiNames.has(name) ? componentHref(locale, "ui", name) : undefined;
  };

  return (
    <>
      <p>
        <Rich text={format(k.intro, words)} />
      </p>

      <h2 id="layers">{k.layersTitle}</h2>
      <ol className="kz-kit-layers not-prose">
        {foundations.layers.map((layer) => (
          <li key={layer.id}>
            <code>{layer.source}</code>
            <span>{k.layers[layer.id as keyof typeof k.layers]}</span>
          </li>
        ))}
      </ol>
      <p>{k.layersComponents}</p>
      <p className="kz-docs-note">
        <Link href={`/${locale}/docs/${kit}/ui/foundations`}>
          {k.foundationsCta} <ForwardIcon size={14} />
        </Link>
      </p>

      <h2 id="install">{k.installTitle}</h2>
      {index.install && (
        <>
          <CodeBlock code={index.install.command} lang="bash" />
          <CodeBlock code={index.install.css} lang="css" />
          {index.install.note && (
            <p className="kz-docs-note">
              <InlineCode text={index.install.note} />
            </p>
          )}
        </>
      )}

      <h2 id="components">{k.componentsTitle}</h2>
      <p>{k.componentsLead}</p>
      {/* The same catalogue as /docs/ui — by category, filtered by platform — each card saying what it is built on. */}
      <CatalogFilter
        entries={current.map(
          (item): CatalogEntry => ({
            name: item.name,
            title: item.title,
            summary: item.summary,
            platforms: item.platforms,
            status: item.status,
            category: item.category,
            href: componentHref(locale, kit, item.name),
            note: item.builtOn?.length ? `${k.builtOn} ${item.builtOn.map((ref) => resolveReference(ref, kit).name).join(" · ")}` : undefined,
          }),
        )}
        groups={CATEGORIES.map((category) => ({ category, label: t.docs.component.categories[category] }))}
      />

      {deprecated.length > 0 && (
        <>
          <h2 id="deprecated">{k.deprecatedTitle}</h2>
          <p>{k.deprecatedLead}</p>
          <ul className="kz-related not-prose">
            {deprecated.map((item) => (
              <ComponentCard key={item.name} item={item} kit={kit} locale={locale} t={t} />
            ))}
          </ul>
        </>
      )}

      {(index.reexports ?? []).length > 0 && (
        <>
          <h2 id="reexports">{k.reexportsTitle}</h2>
          <p>{k.reexportsLead}</p>
          <ul className="kz-kit-reexports not-prose">
            {index.reexports!.map(({ name, from }) => {
              const href = uiPage(from);
              return (
                <li key={name}>
                  {href ? (
                    <Link href={href}>
                      <code>{name}</code>
                    </Link>
                  ) : (
                    <code>{name}</code>
                  )}
                  <span>{from}</span>
                </li>
              );
            })}
          </ul>
        </>
      )}

      <p className="kz-component-source not-prose">
        <span>{format(k.source, words)}</span>
      </p>
    </>
  );
}
