import type { Metadata } from "next";
import { localizedMetadata } from "@/lib/seo";
import OrochiaPageClient from "./OrochiaPageClient";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(locale, {
    path: "/products/orochia",
    en: {
      title: "Orochia — Sovereign 4K Video Streaming & Creator Platform | Krizaka",
      description:
        "Open-source adult-friendly video streaming and creator community platform with Bunny.net 4K HLS delivery, 18 U.S.C. § 2257 compliance vault, and 4-tier admin monetization.",
    },
    fr: {
      title: "Orochia — Streaming Vidéo 4K Souverain & Économie Créateur | Krizaka",
      description:
        "Plateforme open-source de streaming vidéo 4K et communauté de créateurs avec diffusion Bunny.net, coffre-fort de conformité 18 U.S.C. § 2257 et monétisation administrateur 4 niveaux.",
    },
  });
}

export default function OrochiaPage() {
  return <OrochiaPageClient />;
}
