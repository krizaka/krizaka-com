"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("@/app/components/ArchitectureScene3D"), {
  ssr: false,
  loading: () => (
    <div
      className="kz-arch3d"
      style={{
        display: "grid",
        placeItems: "center",
        color: "var(--kz-text-muted)",
        fontSize: 13,
      }}
    >
      Loading the 3D architecture…
    </div>
  ),
});

export default function ArchitectureClient() {
  return <Scene />;
}
