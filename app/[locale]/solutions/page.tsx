import type { Metadata } from "next";
import SolutionsClient from "./SolutionsClient";

export const metadata: Metadata = {
  title: "Solutions — Krizaka",
  description:
    "Des packages Orasaka prêts à déployer par domaine : intelligence documentaire, automatisation du support, assistant de connaissance, génération média, agents autonomes. Vos données restent chez vous.",
};

export default function SolutionsPage() {
  return <SolutionsClient />;
}
