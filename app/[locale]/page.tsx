import type { Metadata } from "next";
import { ProductFaq } from "@/app/components/ProductFaq";
import { localizedMetadata } from "@/lib/seo";
import { publicRepositoryCount } from "@/lib/org-stats";
import { mavenArtifactCount, npmPackages, npmWeeklyDownloads } from "@/lib/registry-versions";
import TopNavBar from "../components/TopNavBar";
import HomeHero from "../components/home/HomeHero";
import ProductShowcase from "../components/home/ProductShowcase";
import OpenStack from "../components/home/OpenStack";
import Principles from "../components/home/Principles";
import Company from "../components/home/Company";
import ContactCta from "../components/home/ContactCta";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";

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
   the centred hero (once-per-session intro, the film), the products — Orazaka the foundation, the products it powers —
   (the only place they are presented: /products answers 308 to #products), the open-source stack in brief, the
   principles in brief, Montréal, the contact, then the questions (folded; FAQPage JSON-LD). One primary action per
   section. Every figure is read at build: GitHub (lib/org-stats.ts), npm and Maven Central (lib/registry-versions.ts). */
export default async function Home({ params }: Props) {
  const { locale } = await params;
  const figures = { repositories: publicRepositoryCount(), npm: npmPackages().length, downloads: npmWeeklyDownloads(), maven: mavenArtifactCount() };
  return (
    <main className="min-h-screen" style={{ background: "var(--kz-surface-0)" }}>
      <TopNavBar />
      <HomeHero locale={locale} figures={figures} />
      <ProductShowcase locale={locale} />
      <OpenStack locale={locale} mavenArtifacts={figures.maven} />
      <Principles locale={locale} repositories={figures.repositories} />
      <Company locale={locale} />
      <SectionBackdrop className="bp-glide" dome={false}>
        <ContactCta />
      </SectionBackdrop>
      <ProductFaq product="krizaka" locale={locale} />
    </main>
  );
}
