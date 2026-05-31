import { ReactNode } from "react";
import { getDocsList } from "../../../../lib/docs";
import TopNavBar from "../../../components/TopNavBar";
import DocsSidebar from "../../../components/DocsSidebar";

export default async function DocsLayout({ children }: { children: ReactNode }) {
  const docsList = await getDocsList();

  const groupedDocs: Record<string, typeof docsList> = {};
  for (const doc of docsList) {
    if (!groupedDocs[doc.category]) groupedDocs[doc.category] = [];
    groupedDocs[doc.category].push(doc);
  }

  for (const category in groupedDocs) {
    groupedDocs[category].sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return a.title.localeCompare(b.title);
    });
  }

  const sortedCategories = Object.keys(groupedDocs).sort((a, b) => {
    const order = [
      "getting-started",
      "architecture",
      "api",
      "core-features",
      "operations",
      "ui-guidelines",
      "guidelines",
    ];
    const idxA = order.indexOf(a);
    const idxB = order.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  });

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--kz-surface-0)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TopNavBar />

      <div
        className="docs-layout-inner"
        style={{
          flex: 1,
          display: "flex",
          maxWidth: 1400,
          margin: "0 auto",
          width: "100%",
          paddingTop: 80,
        }}
      >
        <DocsSidebar
          groupedDocs={groupedDocs}
          sortedCategories={sortedCategories}
        />

        <main style={{ flex: 1, minWidth: 0, overflowX: "hidden" }}>
          <div
            className="docs-content-wrapper"
            style={{
              maxWidth: 820,
              margin: "0 auto",
              padding: "32px 40px 80px",
            }}
          >
            {children}
          </div>
        </main>
      </div>

      {/* Responsive layout overrides */}
      <style>{`
        @media (max-width: 768px) {
          .docs-content-wrapper {
            padding: 20px 16px 60px !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .docs-content-wrapper {
            padding: 28px 24px 80px !important;
          }
        }
      `}</style>
    </div>
  );
}
