import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { BUILDING_BLOCKS } from "@/lib/building-blocks";
import { lastModified } from "@/lib/lastmod";
import { video } from "@/lib/cdn";
import { format, getDictionary } from "@/lib/i18n";
import { watchPath, WATCH_FILMS } from "@/lib/watch-films";

// A single sitemap is correct here: the protocol limit is 50k URLs / 50 MB, and
// this site has ~50. A sitemap index buys nothing until we blow past that.
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;
  const locales = ["fr", "en"] as const;

  // Base list of static paths
  const staticPaths = [
    "",
    "/docs",
    ...BUILDING_BLOCKS.filter((b) => b.forum === "ui").map((b) => `/open-source/${b.id}`),
    "/services",
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
    changeFrequency: "weekly" | "monthly" | "yearly" = "weekly",
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
    } else if (path === "/docs") {
      priority = 0.9;
    } else if (path === "/contact" || path === "/privacy" || path === "/terms") {
      priority = 0.5;
      freq = "yearly";
    }
    return buildEntries(path, priority, freq);
  });

  // The watch page of each film: the video is the page's main content, so the sitemap says so (video tags).
  const filmPages = WATCH_FILMS.flatMap((f) => {
    const media = video(f.base);
    return locales.flatMap((loc) =>
      buildEntries(watchPath(f.id), 0.6, "monthly")
        .filter((e) => e.url === `${baseUrl}/${loc}${watchPath(f.id)}`)
        .map((e) => {
          const t = getDictionary(loc).site.story.watch[f.id];
          return {
            ...e,
            videos: [
              {
                title: t.title,
                description: format(t.description, { seconds: f.seconds }),
                thumbnail_loc: media.poster,
                content_loc: media.mp4,
                duration: f.seconds,
                publication_date: f.uploadDate,
              },
            ],
          };
        }),
    );
  });

  // The documentation lives on its own sites (ui.krizaka.com, java.krizaka.com), each with its sitemap.
  return [...staticPages, ...filmPages];
}
