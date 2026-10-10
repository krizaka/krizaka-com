import type { CSSProperties, ReactNode } from "react";
import { notFound } from "next/navigation";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { ProductLogo } from "@krizaka/ui";
import TopNavBar from "@/app/components/TopNavBar";
import SiteFooter from "@/app/components/SiteFooter";
import { DOCS_SECTIONS, getPageTree, type DocsSection } from "@/lib/docs-source";
import { asLocale, getDictionary } from "@/lib/i18n";

export const dynamicParams = false;

export function generateStaticParams() {
  return DOCS_SECTIONS.map((section) => ({ section }));
}

const isSection = (value: string): value is DocsSection => (DOCS_SECTIONS as readonly string[]).includes(value);

/* One documentation set: the site's navigation on top, Fumadocs' sidebar (this set's tree, a switcher between the
   four sets, the search) and the page with its table of contents, then the site's footer. */
export default async function DocsSectionLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string; section: string }> }) {
  const { locale: raw, section } = await params;
  if (!isSection(section)) notFound();
  const locale = asLocale(raw);
  const t = getDictionary(locale).docs;

  const tabs = DOCS_SECTIONS.map((s) => ({
    title: t.sections[s].title,
    description: t.sections[s].description,
    url: `/${locale}/docs/${s}`,
    icon: <ProductLogo id={s === "orazaka" || s === "orochia" ? s : "krizaka"} size={18} animated={false} />,
  }));

  return (
    <>
      <TopNavBar />
      <DocsLayout
        tree={getPageTree(section, locale)}
        tabs={tabs}
        nav={{ title: t.hub.kicker, url: `/${locale}/docs` }}
        themeSwitch={{ enabled: false }}
        containerProps={{ className: "kz-docs", style: { "--fd-banner-height": "var(--kz-docs-top)" } as CSSProperties }}
      >
        {children}
      </DocsLayout>
      <SiteFooter />
    </>
  );
}
