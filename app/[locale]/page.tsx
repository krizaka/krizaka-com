import type { Metadata } from "next";
import { localizedMetadata } from "@/lib/seo";
import { publicRepositoryCount } from "@/lib/org-stats";
import { mavenArtifactCount, npmPackages, npmWeeklyDownloads } from "@/lib/registry-versions";
import TopNavBar from "../components/TopNavBar";
import HomeHero from "../components/home/HomeHero";
import ProductShowcase, { EngineSection } from "../components/home/ProductShowcase";
import OpenStack from "../components/home/OpenStack";
import Principles from "../components/home/Principles";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(locale, {
    path: "/",
    en: {
      title: "Krizaka — open-source software studio in Montréal",
      description:
        "Krizaka is a Montréal software studio building open-source products — Orazaka, Orochia, Yasakia, Yororis, Yomizaka, Kachizaka and Akinaza — and the stack under them: Krizaka UI and Krizaka Java.",
    },
    fr: {
      title: "Krizaka — studio logiciel open source à Montréal",
      description:
        "Krizaka est un studio logiciel montréalais qui construit des produits open source — Orazaka, Orochia, Yasakia, Yororis, Yomizaka, Kachizaka et Akinaza — et la pile qui les porte : Krizaka UI et Krizaka Java.",
    },
  });
}

/* HOME — one of the site's two views (the other is Open source; 2026-10-17), on the landing template, in this order:
   the hero (once-per-session intro, the film), the honest chronology: Orazaka, our first build (EngineSection), the
   open-source stack born from it, the products built on both (the only place they are presented: /products answers
   308 to #products), the principles in brief, and it stops there (no Montréal, no contact panel, no FAQ; 2026-10-22). One primary action per
   section. Every figure is read at build: GitHub (lib/org-stats.ts), npm and Maven Central (lib/registry-versions.ts). */
export default async function Home({ params }: Props) {
  const { locale } = await params;
  const figures = { repositories: publicRepositoryCount(), npm: npmPackages().length, downloads: npmWeeklyDownloads(), maven: mavenArtifactCount() };
  return (
    <main className="min-h-screen" style={{ background: "var(--kz-surface-0)" }}>
      <TopNavBar />
      <HomeHero locale={locale} figures={figures} />
      <EngineSection locale={locale} />
      <OpenStack locale={locale} mavenArtifacts={figures.maven} />
      <ProductShowcase locale={locale} />
      <Principles locale={locale} figures={figures} />
    </main>
  );
}
