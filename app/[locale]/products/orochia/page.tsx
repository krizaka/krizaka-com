import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CreditCard, ExternalLink, Film, Flame, Gavel, GitBranch, Heart, Lock, PlayCircle, ShieldCheck, UsersRound, Wallet } from "lucide-react";
import { OROCHIA_APP_URL } from "@/lib/site";
import type { LucideIcon } from "lucide-react";
import { localizedMetadata } from "@/lib/seo";
import orochia from "@/app/data/orochia-architecture.json";
import TopNavBar from "@/app/components/TopNavBar";
import SiteFooter from "@/app/components/SiteFooter";
import OrochiaArchitecture from "@/app/components/OrochiaArchitecture";
import ProductTour from "@/app/components/ProductTour";
import { format, getDictionary } from "@/lib/i18n";
import ContactCta from "@/app/components/home/ContactCta";
import { verifiedJourneys } from "@/lib/orochia-journeys";
import { OrochiaLogo } from "@krizaka/ui";

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
        "Orochia is Krizaka's open-source video platform for independent creators: signed 4K streaming, audiences the creator chooses (followers, contacts, paid unlock, invited lists), video auctions, challenges (goals, dares and open calls funded in escrow), collections, gateway-confirmed payments and 18+ compliance.",
    },
    fr: {
      title: "Orochia — Plateforme vidéo open source pour créateurs | Krizaka",
      description:
        "Orochia est la plateforme vidéo open source de Krizaka pour créateurs indépendants : diffusion 4K signée, publics choisis par le créateur (abonnés, contacts, déblocage payant, listes d'invités), enchères vidéo, défis (objectifs, défis lancés aux créateurs et appels ouverts financés sous séquestre), collections, paiements confirmés par la passerelle et conformité 18+.",
    },
  });
}


const PILLARS: { id: "cdn" | "access" | "audiences" | "engagement" | "payments" | "wallet" | "auctions" | "challenges" | "compliance"; icon: LucideIcon; color: string }[] = [
  { id: "cdn", icon: Film, color: "#a855f7" },
  { id: "access", icon: Lock, color: "#0ea5e9" },
  { id: "audiences", icon: UsersRound, color: "#d946ef" },
  { id: "engagement", icon: Heart, color: "#f43f5e" },
  { id: "payments", icon: CreditCard, color: "#10b981" },
  { id: "wallet", icon: Wallet, color: "#8b5cf6" },
  { id: "auctions", icon: Gavel, color: "#ec4899" },
  { id: "challenges", icon: Flame, color: "#f97316" },
  { id: "compliance", icon: ShieldCheck, color: "#f59e0b" },
];

/** Screen recordings of the real app; label and caption: messages → site.orochia.tour.<id>. */
const TOUR = ["feed", "unlock", "community", "studio", "admin"] as const;

export default async function OrochiaPage({ params }: Props) {
  const { locale } = await params;
  const t = getDictionary(locale).site.orochia;
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
        <p style={label}>{t.kicker}</p>
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
            {t.subtitle}
          </span>
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--kz-text-secondary)", maxWidth: 680, margin: "20px auto 0" }}>
          {t.lead}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 28 }}>
          <Link href="#tour" className="btn-sheen" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 12, background: "var(--kz-accent)", color: "var(--kz-on-accent)", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
            <PlayCircle size={16} /> {t.watchDemo}
          </Link>
          <a href={OROCHIA_APP_URL} target="_blank" rel="noopener" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 12, border: "1px solid var(--kz-border-default)", color: "var(--kz-text-primary)", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
            <ExternalLink size={16} /> {t.openApp}
          </a>
          <Link href="/products/orochia/docs" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 12, border: "1px solid var(--kz-border-default)", color: "var(--kz-text-primary)", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
            <BookOpen size={16} /> {t.docs}
          </Link>
          <a href="https://github.com/krizaka/orochia" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 12, border: "1px solid var(--kz-border-default)", color: "var(--kz-text-primary)", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
            <GitBranch size={16} /> krizaka/orochia
          </a>
        </div>
        <p style={{ fontSize: 12, color: "var(--kz-text-muted)", margin: "18px 0 0" }}>
          {t.audience}
        </p>
      </section>

      {/* ─── Product tour (screen recordings of the real app) ─── */}
      <section id="tour" style={{ ...section, marginBottom: 88, scrollMarginTop: 96 }}>
        <ProductTour
          clips={TOUR.map((id) => ({ id, src: `/assets/orochia/tour/${id}`, ...t.tour[id] }))}
          accent="#a855f7"
          frameLabel="orochia · localhost"
        />
      </section>

      {/* ─── Pillars ─── */}
      <section id="guarantees" style={{ ...section, marginBottom: 88, scrollMarginTop: 96 }}>
        <p style={label}>{t.pillarsEyebrow}</p>
        <h2 style={h2}>{t.pillarsTitle}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))", gap: 14, marginTop: 24 }}>
          {PILLARS.map(({ id, icon: Icon, color }) => (
            <div key={id} style={card}>
              <Icon size={20} style={{ color }} aria-hidden="true" />
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: "12px 0 8px" }}>{t.pillars[id].title}</h3>
              <p style={{ fontSize: 13.5, lineHeight: 1.65, color: "var(--kz-text-secondary)", margin: 0 }}>{t.pillars[id].body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── How it works: animated journeys ─── */}
      <section id="architecture" style={{ ...section, marginBottom: 88, scrollMarginTop: 96 }}>
        <p style={label}>{t.archEyebrow}</p>
        <h2 style={h2}>{t.archTitle}</h2>
        <p style={{ fontSize: 14.5, color: "var(--kz-text-secondary)", lineHeight: 1.7, maxWidth: 680, margin: "0 0 24px" }}>
          {t.archLead}
        </p>
        <OrochiaArchitecture journeys={journeys} />
      </section>

      {/* ─── Repositories & facts ─── */}
      <section style={{ ...section, marginBottom: 100 }}>
        <p style={label}>{t.sourceEyebrow}</p>
        <h2 style={h2}>{t.sourceTitle}</h2>
        <p style={{ fontSize: 14, color: "var(--kz-text-secondary)", lineHeight: 1.7, maxWidth: 680, margin: "0 0 24px" }}>
          {format(t.sourceLead, { endpoints: orochia.apiEndpoints.length, tables: tables.length })}
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
