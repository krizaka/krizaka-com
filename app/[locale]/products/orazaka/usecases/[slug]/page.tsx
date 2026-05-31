import type { Metadata } from "next";
import { buildAlternates } from "@/lib/seo";
import { notFound } from "next/navigation";
import { getUseCaseBySlug, getAllUseCaseSlugs } from "@/lib/use-cases-data";
import UseCasePageClient from "./UseCasePageClient";

/* ─── Static params for SSG ─── */

export function generateStaticParams() {
  const locales = ["fr", "en"];
  return locales.flatMap((locale) =>
    getAllUseCaseSlugs().map((slug) => ({ locale, slug }))
  );
}

/* ─── Dynamic metadata ─── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const uc = getUseCaseBySlug(slug);
  if (!uc) return {};

  const isEn = locale === "en";
  const title = isEn ? (uc.title.en || uc.title.fr) : uc.title.fr;
  const desc = isEn ? (uc.metaDescription.en || uc.metaDescription.fr) : uc.metaDescription.fr;

  return {
    title: `${title} — Orazaka`,
    description: desc,
    openGraph: {
      title: `${title} | Krizaka`,
      description: desc,
    },
    alternates: buildAlternates(locale, `/products/orazaka/usecases/${slug}`),
  };
}

/* ─── Page ─── */

export default async function UseCaseSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const uc = getUseCaseBySlug(slug);
  if (!uc) notFound();

  return <UseCasePageClient slug={slug} />;
}
