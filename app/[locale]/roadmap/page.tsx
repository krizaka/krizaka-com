import type { Metadata } from "next";
import RoadmapClient from "./RoadmapClient";

export const metadata: Metadata = {
  title: "Roadmap — Krizaka",
  description:
    "La feuille de route du moteur Orasaka : stable, en cours, recherche. Construite au grand jour, alignée sur le code réel.",
};

export default function RoadmapPage() {
  return <RoadmapClient />;
}
