import type { Metadata } from "next";
import { localizedMetadata } from "@/lib/seo";
import { video } from "@/lib/cdn";
import { FILM_BASE, TOUR_BASE } from "@/lib/film-captions";
import { asLocale, getDictionary } from "@/lib/i18n";
import { publicRepositoryCount } from "@/lib/org-stats";
import { mavenArtifactCount, publishedCount } from "@/lib/registry-versions";
import { PROVES_FIRST, ROSTER } from "@/lib/story";
import { uiFacts } from "@/lib/ui-facts";
import TopNavBar from "@/app/components/TopNavBar";
import ProductGrid, { EngineCard } from "@/app/components/ProductCard";
import FigureTiles from "@/app/components/FigureTiles";
import { StackCards } from "@/app/components/home/OpenStack";
import StoryClient from "./StoryClient";

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
        "Krizaka forges open building blocks, builds a sovereign AI engine on them — Orazaka — and ships its products on both. The founder, the refusal, the engine, what it proves first, and everything open source.",
    },
    fr: {
      title: "Notre histoire — un studio, un moteur, tous les produits sur les mêmes briques",
      description:
        "Krizaka forge des briques ouvertes, construit dessus un moteur d'IA souverain — Orazaka — et livre ses produits sur les deux. Le fondateur, le refus, le moteur, ce qu'il prouve d'abord, et tout en open source.",
    },
  });
}

/* /story (longform) — the page is read on the server: the cards, the figures and the stack are rendered here and handed
   to StoryClient, which lays out the stages. Every figure is read at build: the organisation's repositories, the
   components of the published @krizaka/ui registry, the packages on npm and Maven Central. */
export default async function StoryPage({ params }: Props) {
  const locale = asLocale((await params).locale);
  const s = getDictionary(locale).site.story.stages.open;
  const figures = [
    { id: "repos", label: s.figures.repos, value: publicRepositoryCount() },
    { id: "components", label: s.figures.components, value: uiFacts().components },
    { id: "packages", label: s.figures.packages, value: publishedCount() },
  ].filter((f) => f.value > 0);
  const { mp4, poster } = video(FILM_BASE);
  const tour = video(TOUR_BASE);
  return (
    <main style={{ background: "var(--kz-surface-0)", minHeight: "100vh" }}>
      <TopNavBar />
      <StoryClient
        parts={{
          engine: <EngineCard locale={locale} />,
          proves: <ProductGrid locale={locale} only={PROVES_FIRST} />,
          roster: <ProductGrid locale={locale} only={ROSTER} />,
          figures: <FigureTiles figures={figures} label={s.figuresAria} locale={locale} />,
          stack: <StackCards locale={locale} mavenArtifacts={mavenArtifactCount()} />,
        }}
        film={{ mp4, poster, captions: { en: "/en/story/film.vtt", fr: "/fr/story/film.vtt" } }}
        tour={{ mp4: tour.mp4, poster: tour.poster, captions: { en: "/en/story/tour.vtt", fr: "/fr/story/tour.vtt" } }}
      />
    </main>
  );
}
