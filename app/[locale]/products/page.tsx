import type { Metadata } from "next";
import { localizedMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/i18n";
import TopNavBar from "@/app/components/TopNavBar";
import SiteFooter from "@/app/components/SiteFooter";
import ProductsShowcase from "@/app/components/home/ProductsShowcase";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const copy = getDictionary(locale).site.productsPage;
  return localizedMetadata(locale, { path: "/products", en: copy, fr: copy });
}

export default function ProductsPage() {
  return (
    <main style={{ background: "var(--kz-surface-0)", minHeight: "100vh" }}>
      <TopNavBar />
      <div style={{ paddingTop: 80 }}>
        <ProductsShowcase heading="h1" />
      </div>
      <SiteFooter />
    </main>
  );
}
