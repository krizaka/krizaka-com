import type { Metadata } from "next";
import { localizedMetadata } from "@/lib/seo";
import { publicRepositoryCount } from "@/lib/org-stats";
import { npmPackages, npmWeeklyDownloads } from "@/lib/registry-versions";
import SiteBar from "../components/SiteBar";
import HomeHero from "../components/home/HomeHero";
import ProductShowcase from "../components/home/ProductShowcase";
import ServicesLine from "../components/home/ServicesLine";
import Direction from "../components/home/Direction";
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
        "Krizaka is a Montréal software studio building products — Sovkora, Verikora and Folioviv — and the open-source stack under them: Krizaka UI and Krizaka Java.",
    },
    fr: {
      title: "Krizaka — studio logiciel open source à Montréal",
      description:
        "Krizaka est un studio logiciel montréalais qui construit des produits — Sovkora, Verikora et Folioviv — et la pile open source qui les porte : Krizaka UI et Krizaka Java.",
    },
  });
}

/* HOME — one of the site's two views (the other is Docs), on the landing template, in this order (founder, 2026-11-05,
   krizaka-internal#2450): the hero (one action, its carousel), the products in one row — Verikora, Sovkora in the centre,
   Folioviv — each with its carousel (the only place they are presented: /products answers 308 to #products), one line to
   Krizaka Entreprise (/services), where we are going (now / next / later), the principles in brief, and it stops there.
   One primary action per section. Every figure is read at build: GitHub (lib/org-stats.ts), npm (lib/registry-versions.ts). */
export default async function Home({ params }: Props) {
  const { locale } = await params;
  const figures = {
    repositories: publicRepositoryCount(),
    npm: npmPackages().length,
    downloads: npmWeeklyDownloads(),
  };
  return (
    <main className="kz-site-main">
      <SiteBar />
      <HomeHero locale={locale} figures={figures} />
      <ProductShowcase locale={locale} />
      <ServicesLine locale={locale} />
      <Direction locale={locale} />
      <Principles locale={locale} figures={figures} />
    </main>
  );
}
