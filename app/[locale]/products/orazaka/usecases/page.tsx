import type { Metadata } from "next";
import { localizedMetadata } from "@/lib/seo";
import UseCasesIndexClient from "./UseCasesIndexClient";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(locale, {
    path: "/products/orazaka/usecases",
    en: {
      title: "Sovereign AI Use Cases — Orazaka on-premise | Krizaka",
      description:
        "Discover concrete on-premise AI use cases for businesses, law firms, clinics, and realtors. Conforms to Quebec's Law 25 and GDPR.",
      og: {
        title: "Sovereign AI Use Cases | Krizaka",
        description:
          "Concrete on-premise AI solutions for every business. Zero cloud dependencies.",
      },
    },
    fr: {
      title: "Cas d'usage IA Souveraine — Secteurs & Métiers Québec | Krizaka",
      description:
        "Découvrez nos cas d'usage réels d'IA souveraine pour entreprises, cabinets d'avocats, cliniques et immobilier à Montréal. Conforme Loi 25.",
      og: {
        title: "Cas d'usage — IA souveraine on-premise | Krizaka Montréal",
        description:
          "Des solutions IA concrètes pour chaque métier à Montréal. Aucune donnée ne quitte votre infrastructure.",
      },
    },
  });
}

export default function UseCasesPage() {
  return <UseCasesIndexClient />;
}
