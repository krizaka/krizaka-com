import type { Metadata } from "next";
import { localizedMetadata } from "@/lib/seo";
import { orgRepositories } from "@/lib/org-data";
import TopNavBar from "../components/TopNavBar";
import OrgHero from "../components/home/OrgHero";
import ProductsShowcase from "../components/home/ProductsShowcase";
import ExpertiseSection from "../components/home/ExpertiseSection";
import OpenSourceSection from "../components/home/OpenSourceSection";
import ContactCta from "../components/home/ContactCta";
import StoryTeaser from "../components/home/StoryTeaser";
import SiteFooter from "../components/SiteFooter";

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
        "Krizaka is a Montréal software studio building open-source platforms: Orazaka, sovereign on-premise AI (Law 25, GDPR), and Orochia, the video platform for independent creators.",
    },
    fr: {
      title: "Krizaka — Open source. Fermé aux compromis.",
      description:
        "Krizaka est un studio logiciel montréalais qui conçoit des plateformes open source : Orazaka, l'IA souveraine sur site (Loi 25, RGPD), et Orochia, la plateforme vidéo des créateurs indépendants.",
    },
  });
}

/* HOME — the organisation first: who we are, our two products, our know-how, our open source. */
export default function Home() {
  const repositories = orgRepositories();
  const orazaka = repositories.filter((r) => r.product === "orazaka").length;
  const orochia = repositories.filter((r) => r.product === "orochia").length;
  return (
    <main className="min-h-screen" style={{ background: "var(--kz-surface-0)" }}>
      <TopNavBar />
      <OrgHero repositoryCount={repositories.length} />
      <ProductsShowcase />
      <StoryTeaser />
      <ExpertiseSection />
      <OpenSourceSection orazakaRepos={orazaka} orochiaRepos={orochia} />
      <ContactCta />
      <SiteFooter />
    </main>
  );
}
