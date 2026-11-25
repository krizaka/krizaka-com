import type { Metadata } from "next";
import { localizedMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/i18n";
import { publicChannels } from "@/lib/github-channels";
import ContactClient from "./ContactClient";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(locale, {
    path: "/contact",
    en: getDictionary("en").site.contactPage.meta,
    fr: getDictionary("fr").site.contactPage.meta,
  });
}

export default function ContactPage() {
  return <ContactClient groups={publicChannels()} />;
}
