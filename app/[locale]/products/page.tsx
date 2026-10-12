import type { Metadata } from "next";
import { localizedMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/i18n";
import TopNavBar from "@/app/components/TopNavBar";
import SiteFooter from "@/app/components/SiteFooter";
import { PageHero } from "@krizaka/ui/page-hero";
import ProductsShowcase from "@/app/components/home/ProductsShowcase";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const copy = getDictionary(locale).site.productsPage;
  return localizedMetadata(locale, { path: "/products", en: copy, fr: copy });
}

/* /products — the page hero (@krizaka/ui), then both products presented the same way (ProductsShowcase). */
export default async function ProductsPage({ params }: Props) {
  const h = getDictionary((await params).locale).site.home.products;
  return (
    <main style={{ background: "var(--kz-surface-0)", minHeight: "100vh" }}>
      <TopNavBar />
      <PageHero eyebrow={h.pageEyebrow} title={h.pageTitle} lead={h.pageLead} backdrop="plain" />
      <ProductsShowcase heading="none" />
      <SiteFooter />
    </main>
  );
}
