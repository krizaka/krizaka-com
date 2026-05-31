import type { Metadata } from "next";
import { localizedMetadata } from "@/lib/seo";
import TopNavBar from "../components/TopNavBar";
import HeroSection from "../components/HeroSection";
import EngineShowcaseSection from "../components/EngineShowcaseSection";
import SiteFooter from "../components/SiteFooter";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(locale, {
    path: "/",
    en: {
      title: "Krizaka — Sovereign On-Premise AI | Law 25 & GDPR Compliance",
      description:
        "Krizaka designs Orazaka, an open-source multi-modal AI orchestration engine. Deploy local LLMs in Montreal, Quebec with Ollama, conforming to Law 25 and GDPR.",
    },
    fr: {
      title: "Krizaka — IA souveraine on-premise | Loi 25 & RGPD Montréal",
      description:
        "Krizaka développe Orazaka, un moteur d'orchestration IA souverain et open source à Montréal. Déployez une IA locale conforme à la Loi 25 du Québec et au RGPD.",
    },
  });
}

/* ─────────────────────────────────────────────────────────────────────
   HOME PAGE — Simplified, developer-first landing page.
   Hero (with interactive pipeline illustration) → Showcase → Footer.
   ───────────────────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: "var(--kz-surface-0)" }}>
      <TopNavBar />
      <HeroSection />
      <EngineShowcaseSection />
      <SiteFooter />
    </main>
  );
}
