import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDocsList, getDocBySlugAndCategory } from "@/lib/docs";
import { buildAlternates } from "@/lib/seo";
import DocArticle from "@/app/components/DocArticle";
import OrochiaArchitecture from "@/app/components/OrochiaArchitecture";
import { verifiedJourneys } from "@/lib/orochia-journeys";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

async function load(slug: string) {
  const docs = await getDocsList("orochia");
  const meta = docs.find((d) => d.slug === slug);
  return meta ? getDocBySlugAndCategory(meta.category, slug, "orochia") : null;
}

export async function generateStaticParams() {
  const docs = await getDocsList("orochia");
  return ["fr", "en"].flatMap((locale) => docs.map((d) => ({ locale, slug: d.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const doc = await load(slug);
  if (!doc) return { title: "Orochia documentation | Krizaka" };
  return {
    title: `${doc.title} | Orochia | Krizaka`,
    description: doc.intro ?? doc.description,
    alternates: buildAlternates(locale, `/products/orochia/docs/${slug}`),
  };
}

/* The animated journeys open the docs they illustrate. */
const HERO_JOURNEYS: Record<string, string[]> = {
  architecture: ["playback", "unlock", "upload"],
  media_pipeline: ["upload", "playback"],
};

export default async function OrochiaDocPage({ params }: Props) {
  const { slug, locale } = await params;
  const doc = await load(slug);
  if (!doc) notFound();
  const ids = HERO_JOURNEYS[slug];
  const hero = ids ? (
    <div style={{ margin: "0 0 40px" }}>
      <OrochiaArchitecture journeys={verifiedJourneys().filter((j) => ids.includes(j.id)).sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id))} />
    </div>
  ) : undefined;
  return <DocArticle doc={doc} product={{ name: "Orochia", href: "/products/orochia" }} hero={hero} locale={locale} />;
}
