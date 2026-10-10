import type { Metadata } from "next";
import { localizedMetadata } from "@/lib/seo";
import TopNavBar from "@/app/components/TopNavBar";
import SiteFooter from "@/app/components/SiteFooter";
import StoryClient from "./StoryClient";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(locale, {
    path: "/story",
    en: {
      title: "Our story — why Krizaka, Orazaka and Orochia exist",
      description: "A blade folded in the open, an AI that never leaves home, a video platform where creators keep 90% — told like an arcade fight, and everything open source.",
    },
    fr: {
      title: "Notre histoire — pourquoi Krizaka, Orazaka et Orochia existent",
      description: "Une lame pliée au grand jour, une IA qui ne quitte jamais la maison, une plateforme vidéo où les créateurs gardent 90 % — racontées comme un combat d'arcade, et tout en open source.",
    },
  });
}

export default function StoryPage() {
  return (
    <main style={{ background: "var(--kz-surface-0)", minHeight: "100vh" }}>
      <TopNavBar />
      <StoryClient />
      <SiteFooter />
    </main>
  );
}
