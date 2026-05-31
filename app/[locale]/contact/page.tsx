import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact & partenariats",
  description:
    "Contributions, partenariats, presse ou questions sur Orasaka — voici comment nous joindre. Projet open source, échanges publics par défaut.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactClient />;
}
