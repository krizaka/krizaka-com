import Link from "next/link";
import { CardGrid } from "@krizaka/ui/card-grid";
import { LinkCard } from "@krizaka/ui/link-card";
import { getPageTree, type ProductSection } from "@/lib/docs-source";
import { getDictionary, type Locale } from "@/lib/i18n";
import type * as PageTree from "fumadocs-core/page-tree";

/* The home of a product's documentation: its published docs by category, in reading order (the sidebar's tree) — each
   page a LinkCard of @krizaka/ui, the same cards as the documentation hub. */
export function ProductDocsIndex({ section, locale }: { section: ProductSection; locale: Locale }) {
  const t = getDictionary(locale).docs;
  const folders = getPageTree(section, locale).children.filter((node): node is PageTree.Folder => node.type === "folder");
  return (
    <div className="not-prose kz-doc-index">
      <p className="kz-docs-note">
        {t.productIndex.lead} <Link href={`/products/${section}`}>{t.productIndex.overview} →</Link>
      </p>
      {folders.map((folder) => (
        <section key={folder.$id} className="kz-doc-index-group" aria-labelledby={`group-${folder.$id}`}>
          <h2 id={`group-${folder.$id}`}>{folder.name}</h2>
          <CardGrid as="ul" min={220} reveal={false}>
            {folder.children.flatMap((node) =>
              node.type === "page" ? [<LinkCard key={node.url} href={node.url} linkAs={Link} title={node.name} titleAs="span" description={node.description} />] : [],
            )}
          </CardGrid>
        </section>
      ))}
    </div>
  );
}
