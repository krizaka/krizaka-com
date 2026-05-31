import { Metadata } from "next";
import OrasakaOverview from "./OrasakaOverview";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Orasaka — Sovereign AI Orchestration Engine | Krizaka",
    description:
      "Ship enterprise-grade, multi-modal AI products — Chat, Image, Video, Speech, RAG, PromptOps, Tool Calling, MCP — entirely on your own infrastructure.",
  };
}

export default function OrasakaIndexPage() {

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Orasaka",
    description:
      "Sovereign AI Orchestration Engine for enterprise-grade, multi-modal AI products.",
    brand: { "@type": "Brand", name: "Krizaka" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <OrasakaOverview />
    </>
  );
}
