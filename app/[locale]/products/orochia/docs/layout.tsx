import { ReactNode } from "react";
import Link from "next/link";
import { getDocsList } from "@/lib/docs";
import TopNavBar from "@/app/components/TopNavBar";
import SiteFooter from "@/app/components/SiteFooter";

/* Orochia documentation shell: synced docs (orochia-content/docs) with a simple side index. */
export default async function OrochiaDocsLayout({ children }: { children: ReactNode }) {
  const docs = await getDocsList("orochia");
  return (
    <div style={{ minHeight: "100dvh", background: "var(--kz-surface-0)", display: "flex", flexDirection: "column" }}>
      <TopNavBar />
      <div className="orochia-docs-inner" style={{ flex: 1, display: "flex", gap: 32, maxWidth: 1200, margin: "0 auto", width: "100%", padding: "112px 20px 80px" }}>
        <aside className="orochia-docs-aside" style={{ width: 220, flexShrink: 0 }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--kz-accent)", margin: "0 0 12px" }}>
            Orochia docs
          </p>
          <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Link href="/products/orochia/docs" className="orochia-docs-link">Overview</Link>
            {docs.map((d) => (
              <Link key={d.slug} href={`/products/orochia/docs/${d.slug}`} className="orochia-docs-link">
                {d.title}
              </Link>
            ))}
            <Link href="/products/orochia" className="orochia-docs-link" style={{ marginTop: 12 }}>
              ← Orochia
            </Link>
          </nav>
        </aside>
        <main style={{ flex: 1, minWidth: 0, overflowX: "hidden" }}>{children}</main>
      </div>
      <SiteFooter />
      <style>{`
        .orochia-docs-link { display:block; padding:6px 10px; border-radius:8px; font-size:13.5px; color:var(--kz-text-secondary); text-decoration:none; }
        .orochia-docs-link:hover { color:var(--kz-text-primary); background:var(--kz-surface-1); }
        @media (max-width: 820px) {
          .orochia-docs-inner { flex-direction: column; padding-top: 96px !important; }
          .orochia-docs-aside { width: 100% !important; }
        }
      `}</style>
    </div>
  );
}
