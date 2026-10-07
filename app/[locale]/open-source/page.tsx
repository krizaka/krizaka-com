import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { localizedMetadata } from "@/lib/seo";
import { orgRepositories, type Loc } from "@/lib/org-data";
import { GITHUB_ORG_URL } from "@/lib/site";
import TopNavBar from "@/app/components/TopNavBar";
import SiteFooter from "@/app/components/SiteFooter";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(locale, {
    path: "/open-source",
    en: { title: "Open source — every Krizaka repository | Krizaka", description: "Every public Krizaka repository, by product and role: Orazaka components (users, notifications, billing, AI engine…) and Orochia." },
    fr: { title: "Open source — tous les dépôts Krizaka | Krizaka", description: "Tous les dépôts publics de Krizaka, par produit et par rôle : composants Orazaka (utilisateurs, notifications, facturation, moteur IA…) et Orochia." },
  });
}

const GROUPS: { id: string; title: Record<Loc, string>; intro: Record<Loc, string> }[] = [
  { id: "workspace", title: { fr: "Orazaka — espace de travail", en: "Orazaka — workspace" }, intro: { fr: "Le point d'entrée : clone et construit tous les dépôts.", en: "The entry point: clones and builds every repository." } },
  { id: "foundation", title: { fr: "Orazaka — fondations réutilisables", en: "Orazaka — reusable foundation" }, intro: { fr: "Build, contrats, edge et kit UI pour toute application.", en: "Build, contracts, edge and UI kit for any application." } },
  { id: "domain", title: { fr: "Orazaka — services de domaine", en: "Orazaka — domain services" }, intro: { fr: "Utilisateurs, notifications et facturation, à brancher tels quels.", en: "Users, notifications and billing, ready to plug in." } },
  { id: "ai", title: { fr: "Orazaka — moteur IA", en: "Orazaka — AI engine" }, intro: { fr: "Le moteur cognitif, ses services et son worker natif.", en: "The cognitive engine, its services and its native worker." } },
  { id: "apps", title: { fr: "Orazaka — applications & packs", en: "Orazaka — applications & packs" }, intro: { fr: "Web, administration, mobile, CLI et packs du Studio.", en: "Web, admin, mobile, CLI and Studio packs." } },
  { id: "orochia", title: { fr: "Orochia", en: "Orochia" }, intro: { fr: "La plateforme vidéo des créateurs indépendants.", en: "The video platform for independent creators." } },
];

export default async function OpenSourcePage({ params }: Props) {
  const { locale } = await params;
  const loc: Loc = locale === "en" ? "en" : "fr";
  const repositories = orgRepositories();

  return (
    <main style={{ background: "var(--kz-surface-0)", minHeight: "100vh", color: "var(--kz-text-primary)" }}>
      <TopNavBar />
      <section className="kz-section" style={{ paddingTop: "clamp(112px, 13vw, 150px)" }}>
        <p className="kz-eyebrow">Open source · Apache-2.0</p>
        <h1 className="kz-h2" style={{ fontSize: "clamp(2rem, 5vw, 2.8rem)", marginBottom: 12 }}>
          {loc === "fr" ? `${repositories.length} dépôts publics.` : `${repositories.length} public repositories.`}
        </h1>
        <p style={{ margin: "0 0 40px", maxWidth: 680, fontSize: 15, lineHeight: 1.7, color: "var(--kz-text-secondary)" }}>
          {loc === "fr" ? "Chaque composant vit dans son propre dépôt, avec sa CI et sa documentation. Tout est dans " : "Every component lives in its own repository, with its own CI and documentation. Everything is on "}
          <a href={GITHUB_ORG_URL} style={{ color: "var(--kz-accent)" }}>github.com/krizaka</a>.
        </p>

        {GROUPS.map((group) => {
          const repos = repositories.filter((r) => r.group === group.id);
          if (repos.length === 0) return null;
          return (
            <div key={group.id} style={{ marginBottom: 40 }}>
              <h2 style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 700 }}>{group.title[loc]}</h2>
              <p style={{ margin: "0 0 14px", fontSize: 13, color: "var(--kz-text-muted)" }}>{group.intro[loc]}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: 12 }}>
                {repos.map((r) => (
                  <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer" className="kz-oss-card">
                    <span className="kz-oss-card-name">
                      {r.name} <ArrowUpRight size={14} aria-hidden />
                    </span>
                    <span className="kz-oss-card-desc">{r.description}</span>
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </section>
      <SiteFooter />
      <style>{`
        .kz-oss-card { display:flex; flex-direction:column; gap:8px; padding:16px 18px; border-radius:14px; text-decoration:none;
          background:var(--kz-surface-1); border:1px solid var(--kz-border-subtle); color:var(--kz-text-primary);
          transition:border-color var(--kz-transition-fast); }
        .kz-oss-card:hover { border-color: var(--kz-accent); }
        .kz-oss-card-name { display:flex; justify-content:space-between; align-items:center; font-family:var(--font-mono); font-size:13.5px; font-weight:700; }
        .kz-oss-card-desc { font-size:13px; line-height:1.6; color:var(--kz-text-secondary); }
      `}</style>
    </main>
  );
}
