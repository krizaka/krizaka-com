import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, CreditCard, Film, GitBranch, Lock, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { localizedMetadata } from "@/lib/seo";
import orochia from "@/app/data/orochia-architecture.json";
import TopNavBar from "@/app/components/TopNavBar";
import SiteFooter from "@/app/components/SiteFooter";

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

const FLOW: Record<Loc, string[]> = {
  fr: [
    "L'acheteur choisit un montant et une passerelle configurée.",
    "Orochia enregistre l'intention (acheteur, créateur, vidéo, montant) et renvoie la page de paiement du prestataire.",
    "Le prestataire notifie Orochia par un webhook signé — signature vérifiée en temps constant.",
    "Le règlement écrit le crédit au grand livre et l'accès, dans une seule transaction, une seule fois.",
  ],
  en: [
    "The buyer picks an amount and a configured gateway.",
    "Orochia records the intent (buyer, creator, video, amount) and returns the provider's checkout page.",
    "The provider notifies Orochia through a signed webhook — verified in constant time.",
    "Settlement writes the ledger credit and the access grant in one transaction, exactly once.",
  ],
};

export default async function OrochiaPage({ params }: Props) {
  const { locale } = await params;
  const loc: Loc = locale === "en" ? "en" : "fr";
  const isFr = loc === "fr";
  const tables = orochia.modules.find((m) => m.id === "data")?.tables ?? [];

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
          <Link href="/products/orochia/docs" className="btn-sheen" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 12, background: "var(--kz-accent)", color: "var(--kz-on-accent)", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
            <BookOpen size={16} /> {isFr ? "Lire la documentation" : "Read the docs"}
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

      {/* ─── Screenshot ─── */}
      <section style={{ ...section, marginBottom: 72 }}>
        <figure style={{ margin: 0 }}>
          <Image
            src="/assets/orochia/streams.png"
            width={3024}
            height={1478}
            sizes="(max-width: 1152px) 100vw, 1152px"
            alt={isFr ? "Fil de vidéos d'Orochia" : "Orochia video feed"}
            style={{ width: "100%", height: "auto", borderRadius: 18, border: "1px solid var(--kz-border-subtle)", boxShadow: "var(--kz-shadow-lg)" }}
          />
          <figcaption style={{ fontSize: 12, color: "var(--kz-text-muted)", textAlign: "center", marginTop: 10 }}>
            {isFr ? "Fil public — données de démonstration du seed de développement." : "Public feed — development seed data."}
          </figcaption>
        </figure>
      </section>

      {/* ─── Pillars ─── */}
      <section style={{ ...section, marginBottom: 80 }}>
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

      {/* ─── Payment flow ─── */}
      <section style={{ ...section, marginBottom: 80 }}>
        <p style={label}>{isFr ? "Parcours d'un déblocage" : "How an unlock works"}</p>
        <h2 style={h2}>{isFr ? "Le client ne dit jamais qu'il a payé." : "The client never says it paid."}</h2>
        <ol style={{ listStyle: "none", padding: 0, margin: "24px 0 0", display: "grid", gap: 10 }}>
          {FLOW[loc].map((step, i) => (
            <li key={step} style={{ ...card, display: "flex", gap: 14, alignItems: "baseline", padding: "14px 18px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: "var(--kz-accent)" }}>{String(i + 1).padStart(2, "0")}</span>
              <span style={{ fontSize: 14, lineHeight: 1.6, color: "var(--kz-text-secondary)" }}>{step}</span>
            </li>
          ))}
        </ol>
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

      <SiteFooter />
    </main>
  );
}
