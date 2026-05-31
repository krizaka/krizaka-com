import type { MetadataRoute } from "next";
import { getAllUseCaseSlugs } from "@/lib/use-cases-data";
import { DOCS_MANIFEST } from "@/lib/docs-manifest";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://krizaka.com";
  const now = new Date();
  const locales = ["fr", "en"] as const;

  // Base list of static paths
  const staticPaths = [
    "",
    "/products/orasaka",
    "/editions",
    "/solutions",
    "/use-cases",
    "/roadmap",
    "/ingenierie-cognitive",
    "/demos",
    "/architecture",
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
    return locales.map((loc) => ({
      url: `${baseUrl}/${loc}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
      alternates: {
        languages: {
          fr: `${baseUrl}/fr${path}`,
          en: `${baseUrl}/en${path}`,
        },
      },
    }));
  };

  /* Static pages */
  const staticPages = staticPaths.flatMap((path) => {
    let priority = 0.8;
    let freq: "weekly" | "monthly" | "yearly" = "weekly";
    if (path === "") {
      priority = 1.0;
    } else if (path === "/products/orasaka" || path === "/editions") {
      priority = 0.9;
    } else if (path === "/contact" || path === "/privacy" || path === "/terms") {
      priority = 0.5;
      freq = "yearly";
    } else if (path === "/demos" || path === "/architecture" || path === "/ingenierie-cognitive") {
      priority = 0.7;
      freq = "monthly";
    }
    return buildEntries(path, priority, freq);
  });

  /* Dynamic use case pages */
  const useCasePages = getAllUseCaseSlugs().flatMap((slug) =>
    buildEntries(`/use-cases/${slug}`, 0.7, "monthly")
  );

  /* Dynamic documentation pages */
  const docPages = Object.entries(DOCS_MANIFEST).flatMap(([slug, doc]) =>
    buildEntries(`/products/orasaka/${doc.category}/${slug}`, 0.8, "weekly")
  );

  return [...staticPages, ...useCasePages, ...docPages];
}
