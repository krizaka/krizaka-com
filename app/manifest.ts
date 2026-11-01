import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Krizaka — Sovkora",
    short_name: "Krizaka",
    description: "Open-source sovereign AI orchestration engine — multimodal AI on your own infrastructure.",
    start_url: "/",
    display: "standalone",
    background_color: "#0d0d0f",
    theme_color: "#0d0d0f",
    icons: [
      { src: "/icon1.png", sizes: "192x192", type: "image/png" },
      { src: "/icon2.png", sizes: "512x512", type: "image/png" },
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
