import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { BUILDING_BLOCKS } from "@/lib/building-blocks";
import { lastModified } from "@/lib/lastmod";

// A single sitemap is correct here: the protocol limit is 50k URLs / 50 MB, and
// this site has ~50. A sitemap index buys nothing until we blow past that.
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;
  const locales = ["fr", "en"] as const;

  // Base list of static paths
  const staticPaths = [
    "",
    "/open-source",
    ...BUILDING_BLOCKS.filter((b) => b.forum === "ui").map((b) => `/open-source/${b.id}`),
    "/story",
    "/changelog",
    "/contact",
    "/privacy",
    "/terms",
  ];

  // Helper to build localized entries
  const buildEntries = (
    path: string,
    priority: number,
    changeFrequency: "weekly" | "monthly" | "yearly" = "weekly"
  ): MetadataRoute.Sitemap => {
    // hreflang codes must match the page-level alternates: fr-CA / en / x-default.
    const languages = {
      "fr-CA": `${baseUrl}/fr${path}`,
      en: `${baseUrl}/en${path}`,
      "x-default": `${baseUrl}/fr${path}`,
    };
    return locales.map((loc) => ({
      url: `${baseUrl}/${loc}${path}`,
      lastModified: lastModified(path),
      changeFrequency,
      priority,
      alternates: { languages },
    }));
  };

  /* Static pages */
  const staticPages = staticPaths.flatMap((path) => {
    let priority = 0.8;
    let freq: "weekly" | "monthly" | "yearly" = "weekly";
    if (path === "") {
      priority = 1.0;
    } else if (path === "/open-source") {
      priority = 0.9;
    } else if (path === "/contact" || path === "/privacy" || path === "/terms") {
      priority = 0.5;
      freq = "yearly";
    }
    return buildEntries(path, priority, freq);
  });

  // The documentation lives on its own sites (ui.krizaka.com, java.krizaka.com), each with its sitemap.
  return staticPages;
}
