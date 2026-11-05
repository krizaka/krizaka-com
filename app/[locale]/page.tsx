import type { Metadata } from "next";
import { localizedMetadata } from "@/lib/seo";
import { publicRepositoryCount } from "@/lib/org-stats";
import { npmPackages } from "@/lib/registry-versions";
import SiteBar from "../components/SiteBar";
import HomeHero from "../components/home/HomeHero";
import ProductShowcase, { EngineSection } from "../components/home/ProductShowcase";
import ServicesLine from "../components/home/ServicesLine";
import HomeAbout from "../components/home/HomeAbout";
import HomeContact from "../components/home/HomeContact";
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
        "Krizaka is a Montréal software studio building open-source products — Sovkora, Verikora and Folioviv — and the stack under them: Krizaka UI and Krizaka Java.",
    },
    fr: {
      title: "Krizaka — studio logiciel open source à Montréal",
      description:
        "Krizaka est un studio logiciel montréalais qui construit des produits open source — Sovkora, Verikora et Folioviv — et la pile qui les porte : Krizaka UI et Krizaka Java.",
    },
  });
}

/* HOME — on the landing template, for one reader, the Montréal property manager (founder, 2026-11-05, krizaka-internal#2445):
   the hero (Verikora first, write to us, Fig. 1), how Verikora checks a file (#products, the only place the products are
   presented: /products answers 308 there), the principles, the engine in one line, who we are, the Entreprise line, then
   contact. Krizaka's figures and the roadmap live on /docs. One primary action per section. The order is
   lib/home-sections.ts. */
export default async function Home({ params }: Props) {
  const { locale } = await params;
  const figures = { repositories: publicRepositoryCount(), npm: npmPackages().length };
  return (
    <main className="kz-site-main">
      <SiteBar />
      <HomeHero locale={locale} />
      <ProductShowcase locale={locale} />
      <Principles locale={locale} figures={figures} />
      <EngineSection locale={locale} />
      <HomeAbout locale={locale} />
      <ServicesLine locale={locale} />
      <HomeContact locale={locale} />
    </main>
  );
}
