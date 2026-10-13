import type { Metadata } from "next";
import { localizedMetadata } from "@/lib/seo";
import { orgRepositories } from "@/lib/org-data";
import { publicRepositoryCount } from "@/lib/org-stats";
import TopNavBar from "../components/TopNavBar";
import OrgHero from "../components/home/OrgHero";
import ProductsShowcase from "../components/home/ProductsShowcase";
import ExpertiseSection from "../components/home/ExpertiseSection";
import OpenSourceSection from "../components/home/OpenSourceSection";
import ContactCta from "../components/home/ContactCta";
import StoryTeaser from "../components/home/StoryTeaser";
import BuildWithKrizaka from "../components/home/BuildWithKrizaka";
import SiteFooter from "../components/SiteFooter";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(locale, {
    path: "/",
    en: {
      title: "Krizaka — Open source. Closed to compromise.",
      description:
        "Krizaka is a Montréal software studio building open-source platforms: Orazaka, sovereign on-premise AI (Law 25, GDPR), Orochia, the video platform for independent creators, Yazakia, the dating app where you talk first (coming soon), and Yororis, a listening space with a face and a voice (under construction).",
    },
    fr: {
      title: "Krizaka — Open source. Fermé aux compromis.",
      description:
        "Krizaka est un studio logiciel montréalais qui conçoit des plateformes open source : Orazaka, l'IA souveraine sur site (Loi 25, RGPD), Orochia, la plateforme vidéo des créateurs indépendants, Yazakia, l'app de rencontre où l'on se parle d'abord (bientôt), et Yororis, un espace d'écoute avec un visage et une voix (en construction).",
    },
  });
}

/* HOME — the organisation first: who we are, our products, our know-how, our open source. */
export default async function Home({ params }: Props) {
  const { locale } = await params;
  const repositories = orgRepositories();
  const orazaka = repositories.filter((r) => r.product === "orazaka").length;
  const orochia = repositories.filter((r) => r.product === "orochia").length;
  const publicRepositories = publicRepositoryCount();
  return (
    <main className="min-h-screen" style={{ background: "var(--kz-surface-0)" }}>
      <TopNavBar />
      <OrgHero locale={locale} repositoryCount={publicRepositories} />
      <ProductsShowcase />
      <BuildWithKrizaka locale={locale} />
      <StoryTeaser />
      <ExpertiseSection />
      <OpenSourceSection
        orazakaRepos={orazaka}
        orochiaRepos={orochia}
        publicRepositories={publicRepositories}
        repositories={repositories.map(({ name }) => ({ name }))}
      />
      <SectionBackdrop className="bp-glide" dome={false}>
        <ContactCta />
      </SectionBackdrop>
      <SiteFooter />
    </main>
  );
}
