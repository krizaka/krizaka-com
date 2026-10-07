import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CreditCard, Film, GitBranch, Lock, PlayCircle, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { localizedMetadata } from "@/lib/seo";
import orochia from "@/app/data/orochia-architecture.json";
import TopNavBar from "@/app/components/TopNavBar";
import SiteFooter from "@/app/components/SiteFooter";
import OrochiaLogo from "@/app/components/OrochiaLogo";
import OrochiaArchitecture from "@/app/components/OrochiaArchitecture";
import ProductTour, { type TourClip } from "@/app/components/ProductTour";
import ContactCta from "@/app/components/home/ContactCta";
import { verifiedJourneys } from "@/lib/orochia-journeys";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(locale, {
    path: "/products/orochia",
    en: {
      title: "Orochia — Open-Source Creator Video Platform | Krizaka",
      description:
        "Orochia is Krizaka's open-source video platform for independent creators: direct-to-CDN streaming, server-side access control, gateway-confirmed payments and 18+ compliance records.",
    },
    fr: {
      title: "Orochia — Plateforme vidéo open source pour créateurs | Krizaka",
      description:
        "Orochia est la plateforme vidéo open source de Krizaka pour créateurs indépendants : diffusion directe CDN, contrôle d'accès côté serveur, paiements confirmés par la passerelle et conformité 18+.",
    },
  });
}

type Loc = "fr" | "en";

const PILLARS: { icon: LucideIcon; color: string; title: Record<Loc, string>; body: Record<Loc, string> }[] = [
  {
    icon: Film,
    color: "#a855f7",
    title: { fr: "Vidéo directe sur le CDN", en: "Direct-to-CDN video" },
    body: {
      fr: "Les créateurs téléversent directement sur Bunny Stream (protocole Tus, reprise sur coupure). La lecture passe par des URL HLS signées qui expirent après 5 minutes : aucune vidéo ne transite par les serveurs applicatifs.",
      en: "Creators upload straight to Bunny Stream (resumable Tus). Playback uses signed HLS URLs that expire after 5 minutes: video never goes through the application servers.",
    },
  },
  {
    icon: Lock,
    color: "#0ea5e9",
    title: { fr: "Contrôle d'accès côté serveur", en: "Server-side access control" },
    body: {
      fr: "Chaque lecture est autorisée sur le serveur selon la visibilité : publique, contacts seulement ou déblocage payant. Aucune URL brute n'est jamais exposée.",
      en: "Every play is authorised on the server against the video's visibility — public, contacts only or paid unlock. No raw media URL is ever exposed.",
    },
  },
  {
    icon: CreditCard,
    color: "#10b981",
    title: { fr: "Paiements confirmés par la passerelle", en: "Gateway-confirmed payments" },
    body: {
      fr: "Un déblocage crée une intention de paiement puis redirige vers CCBill, Segpay, NowPayments ou Stripe. L'accès n'est accordé qu'au webhook signé du prestataire — une seule fois, même si le webhook est rejoué.",
      en: "An unlock records a payment intent, then redirects to CCBill, Segpay, NowPayments or Stripe. Access is granted only on the provider's signed webhook — exactly once, even if the webhook is replayed.",
    },
  },
  {
    icon: ShieldCheck,
    color: "#f59e0b",
    title: { fr: "Conformité 18+ intégrée", en: "Built-in 18+ compliance" },
    body: {
      fr: "Certification 18+ à l'inscription, vérification des registres 18 U.S.C. § 2257 avant tout téléversement, signalements (mineur présumé, contenu non consenti, DMCA) persistés et traités en priorité.",
      en: "18+ certification at sign-up, 18 U.S.C. § 2257 record checks before any upload, and content reports (suspected minors, non-consensual content, DMCA) persisted and triaged first.",
    },
  },
];

const TOUR: TourClip[] = [
  {
    id: "feed",
    src: "/assets/orochia/tour/feed",
    label: { fr: "Fil public", en: "Public feed" },
    caption: { fr: "Porte d'âge 18+, fil des créateurs, profil créatrice — enregistré sur la dernière version d'Orochia.", en: "18+ age gate, creator feed, creator profile — recorded on the latest Orochia build." },
  },
  {
    id: "unlock",
    src: "/assets/orochia/tour/unlock",
    label: { fr: "Lecture & pourboire", en: "Watch & tip" },
    caption: { fr: "Lecture protégée et pourboire : montant, passerelle configurée, confirmation par la passerelle.", en: "Protected playback and tipping: amount, configured gateway, gateway confirmation." },
  },
  {
    id: "community",
    src: "/assets/orochia/tour/community",
    label: { fr: "Explorer & playlists", en: "Explore & playlists" },
    caption: { fr: "Recherche et tags, une vidéo réservée aux abonnés approuvés, l'enregistrement dans une playlist.", en: "Search and tags, a video for approved followers, saving it to a playlist." },
  },
  {
    id: "studio",
    src: "/assets/orochia/tour/studio",
    label: { fr: "Studio créateur", en: "Creator studio" },
    caption: { fr: "Tableau de bord, approbation des abonnés, édition d'une vidéo, téléversement direct vers Bunny.", en: "Dashboard, approving followers, editing a video, direct-to-Bunny upload." },
  },
  {
    id: "admin",
    src: "/assets/orochia/tour/admin",
    label: { fr: "Console d'administration", en: "Admin console" },
    caption: { fr: "orochia-admin : vérification 2257, signalements, catalogue et retraits, comptes, trésorerie.", en: "orochia-admin: 2257 verification, reports, catalogue and takedowns, accounts, treasury." },
  },
];

export default async function OrochiaPage({ params }: Props) {
  const { locale } = await params;
  const loc: Loc = locale === "en" ? "en" : "fr";
  const isFr = loc === "fr";
  const tables = orochia.modules.find((m) => m.id === "data")?.tables ?? [];
  const journeys = verifiedJourneys();

  const section: React.CSSProperties = { maxWidth: "72rem", margin: "0 auto", padding: "0 20px" };
  const h2: React.CSSProperties = {
    fontFamily: "var(--font-display), system-ui, sans-serif",
    fontSize: "clamp(1.5rem, 3.5vw, 2rem)",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    color: "var(--kz-text-primary)",
    margin: "0 0 12px",
  };
  const label: React.CSSProperties = {
    fontFamily: "var(--font-mono, monospace)",
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.16em",
    color: "var(--kz-accent)",
    margin: "0 0 10px",
  };
  const card: React.CSSProperties = {
    padding: 22,
    borderRadius: 18,
    border: "1px solid var(--kz-border-subtle)",
    background: "var(--kz-surface-1)",
  };

  return (
    <main style={{ background: "var(--kz-surface-0)", color: "var(--kz-text-primary)", minHeight: "100vh" }}>
      <TopNavBar />

      {/* ─── Hero ─── */}
      <section style={{ ...section, padding: "clamp(112px, 13vw, 156px) 20px 56px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
          <OrochiaLogo size={112} />
        </div>
        <p style={label}>{isFr ? "Produit Krizaka · open source" : "Krizaka product · open source"}</p>
        <h1
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(2.2rem, 6vw, 3.4rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
            margin: "0 auto",
            maxWidth: 820,
          }}
        >
          Orochia
          <span style={{ display: "block", color: "var(--kz-text-secondary)", fontSize: "0.55em", fontWeight: 700, marginTop: 10 }}>
            {isFr ? "La plateforme vidéo des créateurs indépendants." : "The video platform for independent creators."}
          </span>
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--kz-text-secondary)", maxWidth: 680, margin: "20px auto 0" }}>
          {isFr
            ? "Diffusion 4K, paywalls, pourboires et versements créateurs — avec la rigueur d'une infrastructure financière : accès décidé sur le serveur, paiements confirmés par la passerelle, grand livre en partie double. Conçue pour les contenus adultes (18+), sous licence Apache-2.0."
            : "4K streaming, paywalls, tips and creator payouts — with the rigour of financial infrastructure: access decided on the server, payments confirmed by the gateway, a double-entry ledger. Designed for adult (18+) content, Apache-2.0 licensed."}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 28 }}>
          <Link href="#tour" className="btn-sheen" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 12, background: "var(--kz-accent)", color: "var(--kz-on-accent)", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
            <PlayCircle size={16} /> {isFr ? "Voir la démo" : "Watch the demo"}
          </Link>
          <Link href="/products/orochia/docs" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 12, border: "1px solid var(--kz-border-default)", color: "var(--kz-text-primary)", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
            <BookOpen size={16} /> {isFr ? "Documentation" : "Documentation"}
          </Link>
          <a href="https://github.com/krizaka/orochia" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 12, border: "1px solid var(--kz-border-default)", color: "var(--kz-text-primary)", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
            <GitBranch size={16} /> krizaka/orochia
          </a>
        </div>
        <p style={{ fontSize: 12, color: "var(--kz-text-muted)", margin: "18px 0 0" }}>
          {isFr
            ? "Logiciel destiné aux exploitants de plateformes ; les contenus adultes sont réservés aux personnes majeures."
            : "Software for platform operators; adult content is restricted to adults."}
        </p>
      </section>

      {/* ─── Product tour (screen recordings of the real app) ─── */}
      <section id="tour" style={{ ...section, marginBottom: 88, scrollMarginTop: 96 }}>
        <ProductTour clips={TOUR} accent="#a855f7" frameLabel="orochia · localhost" />
      </section>

      {/* ─── Pillars ─── */}
      <section id="guarantees" style={{ ...section, marginBottom: 88, scrollMarginTop: 96 }}>
        <p style={label}>{isFr ? "Ce qui la rend prête pour la production" : "What makes it production-ready"}</p>
        <h2 style={h2}>{isFr ? "Quatre garanties, appliquées dans le code." : "Four guarantees, enforced in code."}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 250px), 1fr))", gap: 14, marginTop: 24 }}>
          {PILLARS.map(({ icon: Icon, color, title, body }) => (
            <div key={title.en} style={card}>
              <Icon size={20} style={{ color }} aria-hidden="true" />
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: "12px 0 8px" }}>{title[loc]}</h3>
              <p style={{ fontSize: 13.5, lineHeight: 1.65, color: "var(--kz-text-secondary)", margin: 0 }}>{body[loc]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── How it works: animated journeys ─── */}
      <section id="architecture" style={{ ...section, marginBottom: 88, scrollMarginTop: 96 }}>
        <p style={label}>{isFr ? "Fonctionnement" : "How it works"}</p>
        <h2 style={h2}>{isFr ? "Suivez une requête à travers la plateforme." : "Follow a request through the platform."}</h2>
        <p style={{ fontSize: 14.5, color: "var(--kz-text-secondary)", lineHeight: 1.7, maxWidth: 680, margin: "0 0 24px" }}>
          {isFr
            ? "Trois parcours, étape par étape. Chaque point d'API cité est vérifié contre le code d'Orochia à chaque build du site."
            : "Three journeys, step by step. Every API endpoint named here is checked against Orochia's code on every build of this site."}
        </p>
        <OrochiaArchitecture journeys={journeys} />
      </section>

      {/* ─── Repositories & facts ─── */}
      <section style={{ ...section, marginBottom: 100 }}>
        <p style={label}>{isFr ? "Code source" : "Source code"}</p>
        <h2 style={h2}>{isFr ? "Trois dépôts, une plateforme." : "Three repositories, one platform."}</h2>
        <p style={{ fontSize: 14, color: "var(--kz-text-secondary)", lineHeight: 1.7, maxWidth: 680, margin: "0 0 24px" }}>
          {isFr
            ? `L'application expose ${orochia.apiEndpoints.length} points d'API et ${tables.length} tables, extraits du code par le générateur de documentation.`
            : `The app exposes ${orochia.apiEndpoints.length} API endpoints and ${tables.length} tables, extracted from the code by the documentation generator.`}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: 14 }}>
          {orochia.repositories.map((r) => (
            <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer" className="kz-repo-card" style={{ ...card, display: "flex", flexDirection: "column", gap: 8, textDecoration: "none", color: "var(--kz-text-primary)" }}>
              <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 13.5 }}>
                {r.repo} <ArrowRight size={14} style={{ color: "var(--kz-text-muted)" }} />
              </span>
              <span style={{ fontSize: 12, color: "var(--kz-accent)", fontWeight: 600 }}>{r.role}</span>
              <span style={{ fontSize: 13, lineHeight: 1.6, color: "var(--kz-text-secondary)" }}>{r.description}</span>
              <span style={{ marginTop: "auto", fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--kz-text-muted)" }}>{r.stack.join(" · ")}</span>
            </a>
          ))}
        </div>
        <style>{`.kz-repo-card:hover{border-color:var(--kz-accent)!important}`}</style>
      </section>

      <ContactCta topic="orochia" />
      <SiteFooter />
    </main>
  );
}
