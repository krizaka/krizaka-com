import type { MetadataRoute } from "next";
import { getAllUseCaseSlugs } from "@/lib/use-cases-data";
import { DOCS_MANIFEST } from "@/lib/docs-manifest";
import { SITE_URL } from "@/lib/site";

// A single sitemap is correct here: the protocol limit is 50k URLs / 50 MB, and
// this site has ~50. A sitemap index buys nothing until we blow past that.
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;
  const now = new Date();
  const locales = ["fr", "en"] as const;

  // Base list of static paths
  const staticPaths = [
    "",
    "/products/orazaka",
    "/products/orazaka/packages",
    "/products/orazaka/usecases",
    "/products/orazaka/ingenierie-cognitive",
    "/products/orazaka/demos",
    "/products/orazaka/architecture",
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
      "x-default": `${baseUrl}/en${path}`,
    };
    return locales.map((loc) => ({
      url: `${baseUrl}/${loc}${path}`,
      lastModified: now,
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
    } else if (path === "/products/orazaka" || path === "/products/orazaka/packages") {
      priority = 0.9;
    } else if (path === "/contact" || path === "/privacy" || path === "/terms") {
      priority = 0.5;
      freq = "yearly";
    } else if (path === "/products/orazaka/demos" || path === "/products/orazaka/architecture" || path === "/products/orazaka/ingenierie-cognitive") {
      priority = 0.7;
      freq = "monthly";
    }
    return buildEntries(path, priority, freq);
  });

  /* Dynamic use case pages */
  const useCasePages = getAllUseCaseSlugs().flatMap((slug) =>
    buildEntries(`/products/orazaka/usecases/${slug}`, 0.7, "monthly")
  );

  /* Dynamic documentation pages */
  const docPages = Object.entries(DOCS_MANIFEST).flatMap(([slug, doc]) =>
    buildEntries(`/products/orazaka/${doc.category}/${slug}`, 0.8, "weekly")
  );

  return [...staticPages, ...useCasePages, ...docPages];
}
