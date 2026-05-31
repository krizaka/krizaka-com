import type { Metadata } from "next";
import { buildAlternates } from "@/lib/seo";
import architecture from "@/app/data/architecture.json";
import ArchitectureMesh from "../../../../components/illustrations/ArchitectureMesh";
import HowOrazakaWorks from "../../../../components/HowOrazakaWorks";
import TopNavBar from "../../../../components/TopNavBar";
import SiteFooter from "../../../../components/SiteFooter";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === "fr" ? "Fonctionnement d'Orazaka — Krizaka" : "How Orazaka Works — Krizaka";
  const description = locale === "fr"
    ? "Schéma interactif du fonctionnement interne de la plateforme d'orchestration d'IA souveraine Orazaka."
    : "Interactive schema of the operational inner workings of the Orazaka sovereign AI orchestration platform.";
  return {
    title,
    description,
    alternates: buildAlternates(locale, `/products/orazaka/architecture`),
  };
}

/* The six-stage journey — mirrors the stage colors in ArchitectureMesh so the
   header hints at the flow the reader is about to explore. */
const STAGE_HINTS: { color: string; fr: string; en: string }[] = [
  { color: "#0ea5e9", fr: "Présentation", en: "Presentation" },
  { color: "#8b5cf6", fr: "Portail", en: "Gateway" },
  { color: "#f59e0b", fr: "Sécurité", en: "Security" },
  { color: "#6366f1", fr: "Moteur", en: "Engine" },
  { color: "#10b981", fr: "Workers", en: "Workers" },
  { color: "#f43f5e", fr: "Stockage", en: "Persistence" },
];

export default async function ArchitecturePage({ params }: Props) {
  const { locale } = await params;
  const isFr = locale === "fr";

  return (
    <main style={{ background: "var(--kz-surface-0)", color: "var(--kz-text-primary)", minHeight: "100vh" }}>
      <TopNavBar />

      {/* ─── Premium, calm hero header ─── */}
      <section
        style={{
          position: "relative",
          padding: "clamp(104px, 12vw, 148px) 20px 40px",
          textAlign: "center",
          maxWidth: "1120px",
          margin: "0 auto",
          overflow: "hidden",
        }}
      >
        {/* soft accent glow */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(720px, 92vw)",
            height: "360px",
            background: "radial-gradient(60% 60% at 50% 30%, color-mix(in srgb, var(--kz-accent) 14%, transparent) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        {/* faint blueprint grid, masked to fade at the edges */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(var(--kz-grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--kz-grid-color) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(80% 70% at 50% 30%, black 40%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(80% 70% at 50% 30%, black 40%, transparent 100%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "700px", margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "var(--kz-accent)",
              margin: 0,
            }}
          >
            {isFr ? "Fonctionnement" : "How it works"}
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "clamp(2rem, 5.5vw, 2.75rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "var(--kz-text-primary)",
              margin: "14px 0 0",
            }}
          >
            {isFr ? "Le parcours d'une requête." : "The journey of a request."}
          </h1>
          <p style={{ fontSize: "15px", lineHeight: 1.7, color: "var(--kz-text-secondary)", margin: "16px 0 0" }}>
            {isFr
              ? "Orazaka orchestre un flux cognitif modulaire, sécurisé et entièrement souverain. Suivez une requête à travers six étapes — de l'interface jusqu'au stockage."
              : "Orazaka orchestrates a modular, secure, and fully sovereign cognitive flow. Follow a request through six stages — from the interface all the way to storage."}
          </p>

          {/* six-stage hint chips */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "8px",
              margin: "24px auto 0",
              maxWidth: "620px",
            }}
          >
            {STAGE_HINTS.map((s, i) => (
              <span
                key={s.en}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "5px 11px 5px 9px",
                  borderRadius: "999px",
                  fontSize: "11.5px",
                  fontWeight: 600,
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  color: "var(--kz-text-secondary)",
                  background: "color-mix(in srgb, var(--kz-surface-2) 55%, transparent)",
                  border: "1px solid var(--kz-border-subtle)",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "9px",
                    fontWeight: 700,
                    color: "var(--kz-text-muted)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span aria-hidden="true" style={{ width: "7px", height: "7px", borderRadius: "50%", background: s.color }} />
                {isFr ? s.fr : s.en}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Evangelist teaching layer — the mental model + a narrated request ─── */}
      <HowOrazakaWorks />

      {/* ─── Interactive journey schema (the live map to explore) ─── */}
      <section style={{ maxWidth: "80rem", margin: "0 auto", padding: "32px 20px 100px" }}>
        <ArchitectureMesh modules={architecture.modules} dependencies={architecture.dependencies} />
      </section>

      <SiteFooter />
    </main>
  );
}
