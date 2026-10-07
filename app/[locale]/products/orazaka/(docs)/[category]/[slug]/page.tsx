import { Metadata } from "next";
import { buildAlternates } from "@/lib/seo";
import { getDocsList, getDocBySlugAndCategory } from "../../../../../../../lib/docs";
import { notFound } from "next/navigation";
import DocArticle from "../../../../../../components/DocArticle";
import ArchitectureDocHero from "../../../../../../components/ArchitectureDocHero";

export async function generateStaticParams() {
  const locales = ["fr", "en"];
  const docs = await getDocsList();
  return locales.flatMap((locale) =>
    docs.map((doc) => ({
      locale,
      category: doc.category,
      slug: doc.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const doc = await getDocBySlugAndCategory(
    resolvedParams.category,
    resolvedParams.slug
  );
  if (!doc) return { title: "Documentation | Krizaka" };

  return {
    title: `${doc.title} | Orazaka Products | Krizaka`,
    description: doc.description,
    alternates: buildAlternates(
      resolvedParams.locale,
      `/products/orazaka/${resolvedParams.category}/${resolvedParams.slug}`
    ),
  };
}

export default async function OrazakaDocSlugPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const resolvedParams = await params;
  const doc = await getDocBySlugAndCategory(
    resolvedParams.category,
    resolvedParams.slug
  );

  if (!doc) {
    notFound();
  }

  const hero =
    resolvedParams.category === "architecture" && resolvedParams.slug === "architecture" ? <ArchitectureDocHero /> : undefined;
  return <DocArticle doc={doc} product={{ name: "Orazaka", href: "/products/orazaka" }} hero={hero} />;
}
