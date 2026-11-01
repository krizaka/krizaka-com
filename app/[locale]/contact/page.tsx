import type { Metadata } from "next";
import { localizedMetadata } from "@/lib/seo";
import { publicChannels } from "@/lib/github-channels";
import ContactClient from "./ContactClient";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(locale, {
    path: "/contact",
    en: {
      title: "Contact & Partnerships — Krizaka Montreal",
      description:
        "Reach out to Krizaka in Montreal for custom integrations, sovereign AI audits, partnerships, or Sovkora support.",
    },
    fr: {
      title: "Contact & Partenariats — Krizaka Montréal",
      description:
        "Contactez Krizaka à Montréal pour des audits d'IA souveraine, des intégrations sur mesure ou le support de Sovkora.",
    },
  });
}

export default function ContactPage() {
  return <ContactClient groups={publicChannels()} />;
}
