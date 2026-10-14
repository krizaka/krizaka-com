import type { Metadata } from "next";
import { localizedMetadata } from "@/lib/seo";
import { asLocale, getDictionary } from "@/lib/i18n";
import TopNavBar from "@/app/components/TopNavBar";
import SiteFooter from "@/app/components/SiteFooter";
import { PageHero } from "@krizaka/ui/page-hero";
import ProductCards from "@/app/components/home/ProductCards";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const copy = getDictionary(locale).site.productsPage;
  return localizedMetadata(locale, { path: "/products", en: copy, fr: copy });
}

/* /products — the only page about the products on krizaka.com: the page hero (@krizaka/ui), then one card per product
   (ProductCards) that leads to the product's own site and its source. */
export default async function ProductsPage({ params }: Props) {
  const locale = asLocale((await params).locale);
  const h = getDictionary(locale).site.products;
  return (
    <main style={{ background: "var(--kz-surface-0)", minHeight: "100vh" }}>
      <TopNavBar />
      <PageHero eyebrow={h.eyebrow} title={h.pageTitle} lead={h.lead} backdrop="plain" />
      <ProductCards locale={locale} heading="none" />
      <SiteFooter />
    </main>
  );
}
