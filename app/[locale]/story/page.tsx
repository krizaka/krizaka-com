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
      title: "Our story — where Krizaka, Orazaka and Orochia get their names",
      description: "A forge on a slope, an oracle that stays home, an eight-headed serpent from myth and arcade legend — and the flock that keeps watch.",
    },
    fr: {
      title: "Notre histoire — d'où viennent les noms Krizaka, Orazaka et Orochia",
      description: "Une forge à mi-pente, un oracle qui ne quitte pas la maison, un serpent à huit têtes venu du mythe et de l'arcade — et la volée qui veille.",
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
