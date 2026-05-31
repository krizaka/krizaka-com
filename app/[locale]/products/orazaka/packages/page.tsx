import type { Metadata } from "next";
import { localizedMetadata } from "@/lib/seo";
import PackagesPageClient from "./PackagesPageClient";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(locale, {
    path: "/products/orazaka/packages",
    en: {
      title: "Orazaka Packages — Custom Sovereign AI Solutions | Krizaka",
      description:
        "Deploy pre-configured Orazaka packages: Law 25 compliance, secure customer support, B2B outreach, and document analysis on-premise.",
    },
    fr: {
      title: "Packages IA Souveraine — Solutions Métier Loi 25 Montréal | Krizaka",
      description:
        "Déployez des packages IA pré-configurés à Montréal : conformité Loi 25 du Québec, support client souverain, prospection et analyse de documents.",
    },
  });
}

export default function PackagesPage() {
  return <PackagesPageClient />;
}
