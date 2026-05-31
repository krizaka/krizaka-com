import type { Metadata } from "next";
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
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const uc = getUseCaseBySlug(slug);
  if (!uc) return {};

  return {
    title: `${uc.title.fr} — Orasaka`,
    description: uc.metaDescription.fr,
    openGraph: {
      title: `${uc.title.fr} | Krizaka`,
      description: uc.metaDescription.fr,
    },
    alternates: {
      canonical: `/use-cases/${slug}`,
    },
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
