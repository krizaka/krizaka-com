import type { Metadata } from "next";
import orochia from "@/app/data/orochia-architecture.json";
import OrochiaDocsOverview from "./OrochiaDocsOverview";
import { getDocsList } from "@/lib/docs";
import { localizedMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(locale, {
    path: "/products/orochia/docs",
    en: { title: "Orochia Documentation | Krizaka", description: "Architecture, media pipeline, API reference and deployment of Orochia — synced from its source code." },
    fr: { title: "Documentation Orochia | Krizaka", description: "Architecture, pipeline média, référence API et déploiement d'Orochia — synchronisés depuis son code source." },
  });
}

const READING_ORDER = ["getting-started", "architecture", "api", "operations"];

export default async function OrochiaDocsIndex() {
  const docs = await getDocsList("orochia");
  const web = orochia.repositories.find((r) => r.name === "orochia");
  return (
    <OrochiaDocsOverview
      docs={docs
        .map((d) => ({ slug: d.slug, title: d.title, category: d.category, order: d.order }))
        .sort((a, b) => READING_ORDER.indexOf(a.category) - READING_ORDER.indexOf(b.category) || a.order - b.order)}
      modules={orochia.modules}
      stack={web?.stack ?? []}
      endpoints={orochia.apiEndpoints.length}
    />
  );
}
