import type { Metadata } from "next";
import { buildAlternates } from "@/lib/seo";
import { getDictionary } from "@/lib/i18n";
import LegalPage from "@/app/components/LegalPage";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const doc = getDictionary(locale).site.legal.terms;
  return { title: doc.metaTitle, description: doc.metaDescription, alternates: buildAlternates(locale, "/terms") };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <LegalPage locale={locale} page="terms" />;
}
