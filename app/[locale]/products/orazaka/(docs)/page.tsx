import { Metadata } from "next";
import { buildAlternates } from "@/lib/seo";
import OrazakaOverview from "./OrazakaOverview";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Orazaka — Sovereign AI Orchestration Engine | Krizaka",
    description:
      "Ship production-grade, multi-modal AI products — Chat, Image, Video, Speech, RAG, PromptOps, Tool Calling, MCP — entirely on your own infrastructure.",
    alternates: buildAlternates(locale, "/products/orazaka"),
  };
}

export default function OrazakaIndexPage() {

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Orazaka",
    description:
      "Sovereign AI Orchestration Engine for production-grade, multi-modal AI products.",
    brand: { "@type": "Brand", name: "Krizaka" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <OrazakaOverview />
    </>
  );
}
