import type { Metadata } from "next";
import { localizedMetadata } from "@/lib/seo";
import { publicRepositoryCount } from "@/lib/org-stats";
import { publishedCount, publishedVersion } from "@/lib/registry-versions";
import { KIT_PACKAGES } from "@/lib/story";
import { getRegistryIndex } from "@/lib/ui-registry";
import TopNavBar from "@/app/components/TopNavBar";
import SiteFooter from "@/app/components/SiteFooter";
import StoryClient, { type StoryKit } from "./StoryClient";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(locale, {
    path: "/story",
    en: {
      title: "Our story — one studio, one engine, every product on the same blocks",
      description:
        "Krizaka forges open building blocks, builds a sovereign AI engine on them — Orazaka — and ships its products on both. Told like an arcade fight, and everything open source.",
    },
    fr: {
      title: "Notre histoire — un studio, un moteur, tous les produits sur les mêmes briques",
      description:
        "Krizaka forge des briques ouvertes, construit dessus un moteur d'IA souverain — Orazaka — et livre ses produits sur les deux. Racontée comme un combat d'arcade, et tout en open source.",
    },
  });
}

export default function StoryPage() {
  // Every figure of the page is read at build: the organisation's repositories, the components of the published
  // @krizaka/ui registry, the packages on npm and Maven Central, the version of each block — never typed by hand.
  const figures = { repos: publicRepositoryCount(), components: getRegistryIndex().items.length, packages: publishedCount() };
  const kits: StoryKit[] = (Object.keys(KIT_PACKAGES) as StoryKit["id"][]).map((id) => ({
    id,
    packages: KIT_PACKAGES[id].map((name) => ({ name: name.replace(/^com\.krizaka:/, ""), version: publishedVersion(name) })),
  }));
  return (
    <main style={{ background: "var(--kz-surface-0)", minHeight: "100vh" }}>
      <TopNavBar />
      <StoryClient figures={figures} kits={kits} />
      <SiteFooter />
    </main>
  );
}
