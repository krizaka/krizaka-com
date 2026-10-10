"use client";

import dynamic from "next/dynamic";

/* Mermaid (and React Flow behind it) is heavy: loaded only on the pages that draw a diagram. */
const Mermaid = dynamic(() => import("../Mermaid"), {
  ssr: false,
  loading: () => <div className="kz-mermaid-placeholder" aria-hidden />,
});

export default function LazyMermaid({ chart }: { chart: string }) {
  return <Mermaid chart={chart} />;
}
