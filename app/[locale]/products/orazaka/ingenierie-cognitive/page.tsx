import type { Metadata } from "next";
import { localizedMetadata } from "@/lib/seo";
import CognitiveEngineeringPageClient from "./CognitiveEngineeringPageClient";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    ...localizedMetadata(locale, {
      path: "/products/orazaka/ingenierie-cognitive",
      en: {
        title: "Cognitive Engineering in AI — Sovereign Reasoning | Krizaka",
        description:
          "Beyond the prompt: Orazaka's 9-step deterministic pipeline enriches, refines, routes, and validates every AI interaction locally.",
        og: {
          title: "Cognitive Engineering in AI | Krizaka",
          description:
            "Beyond the prompt: a 9-step pipeline that enriches, refines, routes, and validates every AI interaction. Sovereign, open source, Law 25 compliant.",
        },
      },
      fr: {
        title: "Ingénierie Cognitive & IA Souveraine — Raisonnement Localisé | Krizaka",
        description:
          "Au-delà du prompt : découvrez l'ingénierie cognitive d'Orazaka. Un pipeline déterministe d'intercepteurs qui enrichit et valide chaque requête en local.",
        og: {
          title: "Ingénierie cognitive — Pipeline cognitif IA | Krizaka Montréal",
          description:
            "Au-delà du prompt : un pipeline à 9 étapes qui enrichit, route et valide chaque interaction IA en local. Conforme Loi 25.",
        },
      },
    }),
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
      "Orazaka",
      "Krizaka",
    ],
  };
}

export default function CognitiveEngineeringPage() {
  return <CognitiveEngineeringPageClient />;
}
