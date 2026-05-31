import type { Metadata } from "next";
import CognitiveEngineeringPageClient from "./CognitiveEngineeringPageClient";

export const metadata: Metadata = {
  title: "Ingénierie cognitive IA — Pipeline cognitif Orasaka | Krizaka",
  description:
    "Découvrez l'ingénierie cognitive appliquée à l'IA d'entreprise. Pipeline à 9 intercepteurs, enrichissement contextuel, mémoire architecturale, routage intentionnel — Orasaka par Krizaka.",
  keywords: [
    "ingénierie cognitive",
    "cognitive engineering",
    "pipeline cognitif",
    "enrichissement contextuel IA",
    "orchestration IA",
    "routage intentionnel",
    "mémoire conversationnelle IA",
    "RAG pipeline",
    "MCP protocol",
    "validation multi-agents",
    "IA on-premise",
    "Orasaka",
    "Krizaka",
  ],
  openGraph: {
    title: "Ingénierie cognitive — Pipeline cognitif IA | Krizaka",
    description:
      "Au-delà du prompt : un pipeline à 9 étapes qui enrichit, raffine, route et valide chaque interaction IA. Souverain, open source, conforme Loi 25.",
  },
  alternates: {
    canonical: "/ingenierie-cognitive",
  },
};

export default function CognitiveEngineeringPage() {
  return <CognitiveEngineeringPageClient />;
}
