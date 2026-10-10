import { createSearchAPI } from "fumadocs-core/search/server";
import { DOCS_SECTIONS, getSource, isProductSection, pageKey, pageText, PRODUCT_MANIFESTS } from "@/lib/docs-source";
import { getDictionary } from "@/lib/i18n";

/* The docs search index, built once at build time and downloaded by the search dialog (static: no server).
   One index for every section; its URLs carry no locale, so a result opens in the reader's language (proxy.ts). */
export const revalidate = false;

const t = getDictionary("en");

export const { staticGET: GET } = createSearchAPI("advanced", {
  language: "english",
  indexes: DOCS_SECTIONS.flatMap((section) =>
    getSource(section, "en")
      .getPages()
      .filter((page) => !isProductSection(section) || pageKey(page.slugs) in PRODUCT_MANIFESTS[section])
      .map((page) => {
        const { title, description } = pageText(section, page, t);
        return {
          id: page.url,
          title,
          description,
          url: page.url.replace(/^\/en/, ""),
          tag: section,
          structuredData: page.data.structuredData,
        };
      }),
  ),
});
