"use client";

import TopNavBar from "../../../../components/TopNavBar";
import SiteFooter from "../../../../components/SiteFooter";
import PackagesSection from "../../../../components/PackagesSection";

export default function PackagesPageClient() {
  return (
    <main className="min-h-screen ambient-grid relative overflow-hidden" style={{ display: "flex", flexDirection: "column" }}>
      <TopNavBar />
      
      {/* Top ambient radial glow */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(900px, 95vw)",
          height: "400px",
          background: "radial-gradient(ellipse at center, hsla(217, 92%, 60%, 0.08) 0%, transparent 65%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ height: "60px", zIndex: 1 }} />
      
      <div style={{ flex: 1, zIndex: 1 }}>
        <PackagesSection full />
      </div>



      <SiteFooter />

      <style>{`
        .btn-premium-primary:hover {
          background: var(--kz-accent-hover) !important;
          transform: translateY(-1px);
        }
      `}</style>
    </main>
  );
}
