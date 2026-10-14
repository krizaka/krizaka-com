import type { Metadata } from "next";
import { ProductFaq } from "@/app/components/ProductFaq";
import { localizedMetadata } from "@/lib/seo";
import { orgRepositories } from "@/lib/org-data";
import { publicRepositoryCount } from "@/lib/org-stats";
import TopNavBar from "../components/TopNavBar";
import OrgHero from "../components/home/OrgHero";
import ProductCards from "../components/home/ProductCards";
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
      title: "Krizaka — open-source software studio in Montréal: Krizaka UI, Orazaka, Orochia, Yazakia, Yororis",
      description:
        "Krizaka is a Montréal open-source software studio: Krizaka UI and Krizaka Java, the building blocks of its products — Orazaka (sovereign on-premise AI), Orochia (a video platform for independent creators), Yazakia and Yororis — each on its own site.",
    },
    fr: {
      title: "Krizaka — studio logiciel open source à Montréal : Krizaka UI, Orazaka, Orochia, Yazakia, Yororis",
      description:
        "Krizaka est un studio logiciel open source montréalais : Krizaka UI et Krizaka Java, les briques de ses produits — Orazaka (IA souveraine sur site), Orochia (une plateforme vidéo pour créateurs indépendants), Yazakia et Yororis — chacun sur son propre site.",
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
      <ProductCards locale={locale} />
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
      <ProductFaq product="krizaka" locale={locale} />
      <SiteFooter />
    </main>
  );
}
