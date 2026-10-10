import Link from "next/link";
import { getPageTree, type ProductSection } from "@/lib/docs-source";
import { getDictionary, type Locale } from "@/lib/i18n";
import type * as PageTree from "fumadocs-core/page-tree";

/* The home of a product's documentation: its published docs by category, in reading order (the sidebar's tree). */
export function ProductDocsIndex({ section, locale }: { section: ProductSection; locale: Locale }) {
  const t = getDictionary(locale).docs;
  const folders = getPageTree(section, locale).children.filter((node): node is PageTree.Folder => node.type === "folder");
  return (
    <div className="not-prose kz-doc-index">
      <p className="kz-docs-note">
        {t.productIndex.lead} <Link href={`/products/${section}`}>{t.productIndex.overview} →</Link>
      </p>
      {folders.map((folder) => (
        <section key={folder.$id} className="kz-doc-index-group">
          <h2>{folder.name}</h2>
          <ul>
            {folder.children.map((node) =>
              node.type === "page" ? (
                <li key={node.url}>
                  <Link href={node.url}>{node.name}</Link>
                </li>
              ) : null,
            )}
          </ul>
        </section>
      ))}
    </div>
  );
}
