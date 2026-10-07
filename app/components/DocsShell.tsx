import type { ReactNode } from "react";
import TopNavBar from "./TopNavBar";
import DocsSidebar from "./DocsSidebar";
import SiteFooter from "./SiteFooter";

/* Documentation shell shared by every product: site navigation, the product's docs sidebar
   (grouped by category, in reading order) and the article column. */

const CATEGORY_ORDER = ["getting-started", "architecture", "api", "core-features", "operations", "ui-guidelines", "guidelines"];

interface DocMeta {
  slug: string;
  category: string;
  title: string;
  order: number;
}

export default function DocsShell({
  docs,
  product,
  children,
}: {
  docs: DocMeta[];
  product: { id: "orazaka" | "orochia"; name: string; kicker: string; overviewHref: string; docUrls: "category" | "flat" };
  children: ReactNode;
}) {
  const grouped: Record<string, DocMeta[]> = {};
  for (const d of docs) (grouped[d.category] ??= []).push(d);
  for (const c in grouped) grouped[c].sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
  const categories = Object.keys(grouped).sort((a, b) => {
    const ia = CATEGORY_ORDER.indexOf(a), ib = CATEGORY_ORDER.indexOf(b);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.localeCompare(b);
  });

  return (
    <div style={{ minHeight: "100dvh", background: "var(--kz-surface-0)", display: "flex", flexDirection: "column" }}>
      <TopNavBar />
      <div className="docs-layout-inner" style={{ flex: 1, display: "flex", maxWidth: 1400, margin: "0 auto", width: "100%", paddingTop: 80 }}>
        <DocsSidebar groupedDocs={grouped} sortedCategories={categories} product={product} />
        <main style={{ flex: 1, minWidth: 0, overflowX: "hidden" }}>
          <div className="docs-content-wrapper" style={{ maxWidth: 860, margin: "0 auto", padding: "32px 40px 80px" }}>
            {children}
          </div>
        </main>
      </div>
      <SiteFooter />
      <style>{`
        @media (max-width: 768px) { .docs-content-wrapper { padding: 20px 16px 60px !important; } }
        @media (min-width: 769px) and (max-width: 1024px) { .docs-content-wrapper { padding: 28px 24px 80px !important; } }
      `}</style>
    </div>
  );
}
