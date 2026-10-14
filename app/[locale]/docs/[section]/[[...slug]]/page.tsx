import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/docs/page";
import { getMdxComponents } from "@/app/components/docs/mdx";
import { ComponentDoc, componentToc } from "@/app/components/docs/ComponentDoc";
import { InlineCode } from "@/app/components/docs/InlineCode";
import { IconsDoc, iconsToc } from "@/app/components/docs/IconsDoc";
import { TypographyDoc, typographyToc } from "@/app/components/docs/TypographyDoc";
import { BrandMarksDoc } from "@/app/components/docs/BrandMarksDoc";
import { MobileDoc } from "@/app/components/docs/MobileDoc";
import { TemplatesDoc, templatesToc } from "@/app/components/docs/TemplatesDoc";
import { purposeOf } from "@/lib/ui-foundations";
import { BRAND_PAGE, MOBILE_PAGE } from "@/lib/ui-ia";
import { getRegistryItem } from "@/lib/ui-registry";
import {
  type ComponentPageData,
  DOCS_SECTIONS,
  getSource,
  pageText,
  type DocsSection,
} from "@/lib/docs-source";
import { asLocale, getDictionary } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { JsonLd } from "@/app/components/JsonLd";
import { buildBreadcrumbJsonLd, buildTechArticleJsonLd } from "@/lib/structured-data";

export const dynamicParams = false;

interface Props {
  params: Promise<{ locale: string; section: string; slug?: string[] }>;
}

export function generateStaticParams({ params }: { params: { locale: string; section: string } }) {
  const section = params.section as DocsSection;
  const slugs = getSource(section, asLocale(params.locale))
    .getPages()
    .map((page) => ({ slug: page.slugs }));
  return slugs;
}

async function resolve(params: Props["params"]) {
  const { locale: raw, section: rawSection, slug = [] } = await params;
  if (!(DOCS_SECTIONS as readonly string[]).includes(rawSection)) notFound();
  const section = rawSection as DocsSection;
  const locale = asLocale(raw);
  const t = getDictionary(locale);
  const page = getSource(section, locale).getPage(slug);
  if (!page) notFound();
  return { locale, section, slug, t, page };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section, slug, locale, page } = await resolve(params);
  const path = `/docs/${section}${slug.length ? `/${slug.join("/")}` : ""}`;
  const copy = (lang: "en" | "fr") => {
    const dict = getDictionary(lang);
    const text = pageText(section, page, dict);
    return { title: `${text.title} — ${dict.docs.sections[section].title}`, description: text.description };
  };
  return localizedMetadata(locale, { path, en: copy("en"), fr: copy("fr") });
}

/* Every docs page: the page itself plus its JSON-LD — a BreadcrumbList (Docs › section › page) and a TechArticle. */
export default async function DocsSectionPage(props: Props) {
  const { locale, section, slug, t, page } = await resolve(props.params);
  const sectionTitle = t.docs.sections[section].title;
  const base = `${SITE_URL}/${locale}/docs`;
  const own = pageText(section, page, t);
  const url = `${base}/${section}${slug.length ? `/${slug.join("/")}` : ""}`;
  const trail = [
    { name: t.docs.hub.kicker, url: base },
    { name: sectionTitle, url: `${base}/${section}` },
    { name: own.title, url },
  ];
  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(trail)} />
      <JsonLd data={buildTechArticleJsonLd({ locale, title: own.title, description: own.description, url })} />
      <DocsSectionBody {...props} />
    </>
  );
}

async function DocsSectionBody({ params }: Props) {
  const { locale, section, t, page } = await resolve(params);

  const { title, description } = pageText(section, page, t);

  const { component } = page.data as ComponentPageData;

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

  // A foundation of Krizaka UI (Typography, Icons): laid out from the data of the packages that ship it.
  const foundation = (page.data as ComponentPageData).foundation;
  if (foundation) {
    const purpose = purposeOf(foundation);
    const templates = foundation === "templates" || purpose !== null;
    const toc = foundation === "icons" ? iconsToc(t) : templates ? templatesToc(t, purpose ?? undefined) : foundation === "typography" ? typographyToc(t) : [];
    return (
      <DocsPage toc={toc} full={purpose !== null}>
        <DocsTitle>{title}</DocsTitle>
        <DocsDescription>{description}</DocsDescription>
        <DocsBody>
          {foundation === "icons" ? (
            <IconsDoc locale={locale} />
          ) : templates ? (
            <TemplatesDoc locale={locale} purpose={purpose ?? undefined} />
          ) : foundation === MOBILE_PAGE ? (
            <MobileDoc locale={locale} />
          ) : foundation === BRAND_PAGE ? (
            <BrandMarksDoc locale={locale} />
          ) : (
            <TypographyDoc locale={locale} />
          )}
        </DocsBody>
      </DocsPage>
    );
  }

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{title}</DocsTitle>
      <DocsDescription>{description}</DocsDescription>
      <DocsBody>
        <MDX components={getMdxComponents(locale, section)} />
      </DocsBody>
    </DocsPage>
  );
}
