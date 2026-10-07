import type { Metadata } from "next";
import Link from "next/link";
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

export default async function OrochiaDocsIndex({ params }: Props) {
  const { locale } = await params;
  const isFr = locale === "fr";
  const docs = await getDocsList("orochia");
  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-display), system-ui, sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.4rem)", fontWeight: 800, letterSpacing: "-0.02em", margin: 0, color: "var(--kz-text-primary)" }}>
        {isFr ? "Documentation Orochia" : "Orochia documentation"}
      </h1>
      <p style={{ color: "var(--kz-text-secondary)", fontSize: 15, lineHeight: 1.7, margin: "12px 0 32px", maxWidth: 640 }}>
        {isFr
          ? "Synchronisée depuis le dépôt krizaka/orochia : ces pages décrivent le code tel qu'il est publié."
          : "Synced from the krizaka/orochia repository: these pages describe the code as published."}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 260px), 1fr))", gap: 14 }}>
        {docs.map((d) => (
          <Link
            key={d.slug}
            href={`/products/orochia/docs/${d.slug}`}
            style={{ display: "block", padding: 18, borderRadius: 16, border: "1px solid var(--kz-border-subtle)", background: "var(--kz-surface-1)", textDecoration: "none" }}
          >
            <span style={{ fontWeight: 700, color: "var(--kz-text-primary)" }}>{d.title}</span>
            <p style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.6, color: "var(--kz-text-secondary)" }}>{d.intro}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
