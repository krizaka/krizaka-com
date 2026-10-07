import type { Metadata } from "next";
import { localizedMetadata } from "@/lib/seo";
import TopNavBar from "@/app/components/TopNavBar";
import SiteFooter from "@/app/components/SiteFooter";
import ProductsShowcase from "@/app/components/home/ProductsShowcase";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(locale, {
    path: "/products",
    en: { title: "Products — Orazaka & Orochia | Krizaka", description: "Krizaka's open-source products: Orazaka (sovereign AI orchestration) and Orochia (creator video platform)." },
    fr: { title: "Produits — Orazaka & Orochia | Krizaka", description: "Les produits open source de Krizaka : Orazaka (orchestration IA souveraine) et Orochia (plateforme vidéo pour créateurs)." },
  });
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
