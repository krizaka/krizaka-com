import type { Metadata } from "next";
import TopNavBar from "../../components/TopNavBar";
import DemosGallery from "../../components/DemosGallery";
import SiteFooter from "../../components/SiteFooter";
import InterceptorMesh from "../../components/demos/InterceptorMesh";

export const metadata: Metadata = {
  title: "Démos IA souveraine — Orasaka par Krizaka",
  description:
    "Découvrez le pipeline d'ingénierie cognitive d'Orasaka en action. Démos CLI, modélisation Stable Diffusion et simulations vidéo loop.",
  openGraph: {
    title: "Démos interactifs — IA souveraine | Krizaka",
    description:
      "Visualisez les capacités d'Orasaka : terminaux CLI, génération d'images et animations de flux RAG.",
  },
};

export default function DemosPage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--kz-surface-0)", color: "var(--kz-text-primary)" }}>
      <TopNavBar />
      
      {/* Title Header */}
      <section
        style={{
          padding: "140px 24px 20px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 800,
            letterSpacing: "-0.035em",
            color: "var(--kz-text-primary)",
            marginBottom: "16px",
          }}
        >
          Démos & Visualisation
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "var(--kz-text-secondary)",
            maxWidth: "520px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          Visual proof of the local orchestration engine and cognitive pipeline execution.
        </p>
      </section>

      {/* Featured interactive demo — Cognitive InterceptorMesh console */}
      <section
        style={{
          maxWidth: "1180px",
          margin: "0 auto 40px",
          padding: "0 24px 56px",
        }}
      >
        <InterceptorMesh compact={false} />
      </section>

      {/* Demos Gallery Component */}
      <DemosGallery />

      <SiteFooter />
    </main>
  );
}
