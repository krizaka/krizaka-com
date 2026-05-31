import type { Metadata } from "next";
import UseCasesIndexClient from "./UseCasesIndexClient";

export const metadata: Metadata = {
  title: "Cas d'usage IA on-premise — Orasaka par Krizaka",
  description:
    "Découvrez comment Orasaka permet aux agences, cabinets juridiques, équipes de ventes, cliniques et courtiers immobiliers de déployer une IA souveraine conforme à la Loi 25 du Québec.",
  openGraph: {
    title: "Cas d'usage — IA souveraine on-premise | Krizaka",
    description:
      "Des solutions IA concrètes pour chaque métier. Aucune donnée ne quitte votre infrastructure.",
  },
};

export default function UseCasesPage() {
  return <UseCasesIndexClient />;
}
