import type { Metadata } from "next";
import PackagesPageClient from "./PackagesPageClient";

export const metadata: Metadata = {
  title: "Packages — solutions sur mesure par domaine",
  description:
    "Un Package Orasaka assemble des intercepteurs pré-configurés en une solution par domaine : Conformité Loi 25, Support client, Analyse documentaire, Création de contenu. Composables dans Community, en un clic dans Cloud.",
  alternates: { canonical: "/packages" },
};

export default function PackagesPage() {
  return <PackagesPageClient />;
}
