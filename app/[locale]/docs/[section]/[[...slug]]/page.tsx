import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/docs/page";
import ArchitectureDocDiagram from "@/app/components/docs/ArchitectureDocDiagram";
import { getMdxComponents } from "@/app/components/docs/mdx";
import { ProductDocsIndex } from "@/app/components/docs/ProductDocsIndex";
import { ComponentDoc, componentToc } from "@/app/components/docs/ComponentDoc";
import { KitFoundations, foundationsToc } from "@/app/components/docs/KitFoundations";
import { KitOverview, overviewToc } from "@/app/components/docs/KitOverview";
import { InlineCode } from "@/app/components/docs/InlineCode";
import { getRegistryItem } from "@/lib/ui-registry";
import {
  type ComponentPageData,
  DOCS_SECTIONS,
  getSource,
  isProductSection,
  isPublished,
  pageKey,
  pageText,
  PRODUCT_MANIFESTS,
  type DocsSection,
} from "@/lib/docs-source";
import { asLocale, getDictionary } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/seo";

export const dynamicParams = false;

interface Props {
  params: Promise<{ locale: string; section: string; slug?: string[] }>;
}

export function generateStaticParams({ params }: { params: { locale: string; section: string } }) {
  const section = params.section as DocsSection;
  const slugs = getSource(section, asLocale(params.locale))
    .getPages()
    .filter((page) => isPublished(section, page))
    .map((page) => ({ slug: page.slugs }));
  // A product section's home is its catalogue: the synced docs have no index file.
  return isProductSection(section) ? [{ slug: [] }, ...slugs] : slugs;
}

async function resolve(params: Props["params"]) {
  const { locale: raw, section: rawSection, slug = [] } = await params;
  if (!(DOCS_SECTIONS as readonly string[]).includes(rawSection)) notFound();
  const section = rawSection as DocsSection;
  const locale = asLocale(raw);
  const t = getDictionary(locale);
  if (isProductSection(section) && slug.length === 0) return { locale, section, slug, t, page: null };
  const page = getSource(section, locale).getPage(slug);
  if (!page || !isPublished(section, page)) notFound();
  return { locale, section, slug, t, page };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section, slug, locale, page } = await resolve(params);
  const path = `/docs/${section}${slug.length ? `/${slug.join("/")}` : ""}`;
  const copy = (lang: "en" | "fr") => {
    const dict = getDictionary(lang);
    if (!page) return { title: `${dict.docs.sections[section].title} — ${dict.docs.hub.kicker}`, description: dict.docs.sections[section].description };
    const text = pageText(section, page, dict);
    return { title: `${text.title} — ${dict.docs.sections[section].title}`, description: text.description };
  };
  return localizedMetadata(locale, { path, en: copy("en"), fr: copy("fr") });
}

export default async function DocsSectionPage({ params }: Props) {
  const { locale, section, t, page } = await resolve(params);

  if (!page) {
    return (
      <DocsPage toc={[]} tableOfContent={{ enabled: false }} tableOfContentPopover={{ enabled: false }}>
        <DocsTitle>{t.docs.sections[section].title}</DocsTitle>
        <DocsDescription>{t.docs.sections[section].description}</DocsDescription>
        <DocsBody>
          <ProductDocsIndex section={section as "orazaka" | "orochia"} locale={locale} />
        </DocsBody>
      </DocsPage>
    );
  }

  const { title, description } = pageText(section, page, t);

  // The UI section of a product: generated from its kit's registry.
  const { kit, kitPage, component } = page.data as ComponentPageData;
  if (kit && kitPage === "overview") {
    return (
      <DocsPage toc={overviewToc(kit, t)}>
        <DocsTitle>{title}</DocsTitle>
        <DocsDescription>{description}</DocsDescription>
        <DocsBody>
          <KitOverview kit={kit} locale={locale} />
        </DocsBody>
      </DocsPage>
    );
  }
  if (kit && kitPage === "foundations") {
    return (
      <DocsPage toc={foundationsToc(kit, t)}>
        <DocsTitle>{title}</DocsTitle>
        <DocsDescription>{description}</DocsDescription>
        <DocsBody>
          <KitFoundations kit={kit} locale={locale} />
        </DocsBody>
      </DocsPage>
    );
  }
  if (kit && component) {
    return (
      <DocsPage toc={componentToc(component, t, false, kit)}>
        <DocsTitle>{title}</DocsTitle>
        <DocsDescription>
          <InlineCode text={getRegistryItem(component, kit).summary} />
        </DocsDescription>
        <DocsBody>
          <ComponentDoc name={component} locale={locale} kit={kit} />
        </DocsBody>
      </DocsPage>
    );
  }

  // A component of @krizaka/ui: generated from the registry; an enrichment MDX, if any, becomes its notes.
  if (component) {
    const Notes = "body" in page.data ? page.data.body : undefined;
    return (
      <DocsPage toc={componentToc(component, t, Boolean(Notes))}>
        <DocsTitle>{title}</DocsTitle>
        <DocsDescription>
          <InlineCode text={getRegistryItem(component).summary} />
        </DocsDescription>
        <DocsBody>
          <ComponentDoc name={component} locale={locale} notes={Notes && <Notes components={getMdxComponents(locale, section)} />} />
        </DocsBody>
      </DocsPage>
    );
  }

  const MDX = page.data.body;
  const entry = isProductSection(section) ? PRODUCT_MANIFESTS[section][pageKey(page.slugs)] : undefined;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{title}</DocsTitle>
      {!entry && <DocsDescription>{description}</DocsDescription>}
      {entry && (
        <div className="kz-doc-intro not-prose">
          <span className="kz-doc-audience">{entry.audience === "developer" ? t.site.docs.forDevelopers : t.site.docs.forDecisionMakers}</span>
          <p>{entry.intro}</p>
        </div>
      )}
      <DocsBody>
        {section === "orazaka" && <ArchitectureDocDiagram page={pageKey(page.slugs)} t={t} />}
        <MDX components={getMdxComponents(locale, section)} />
        {entry && (
          <p className="kz-docs-note">
            <Link href={`/products/${section}`}>{t.docs.productIndex.overview} →</Link>
          </p>
        )}
      </DocsBody>
    </DocsPage>
  );
}
