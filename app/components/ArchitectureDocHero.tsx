"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowUpRight, Move3d } from "lucide-react";
import { useI18n } from "./I18nProvider";

const Scene = dynamic(() => import("@/app/components/ArchitectureScene3D"), {
  ssr: false,
  loading: () => (
    <div
      className="kz-arch3d"
      style={{ display: "grid", placeItems: "center", color: "var(--kz-text-muted)", fontSize: 13 }}
    >
      Loading the 3D architecture…
    </div>
  ),
});

const COPY = {
  fr: {
    label: "Architecture interactive",
    hint: "Glisse pour pivoter · molette pour zoomer",
    full: "Vue plein écran",
  },
  en: {
    label: "Interactive architecture",
    hint: "Drag to orbit · scroll to zoom",
    full: "Full-screen view",
  },
} as const;

/** Signature 3D model of the engine, surfaced above the generated architecture
 *  doc. Lazy-loaded (ssr:false); the 2D diagrams below remain as detail. */
export default function ArchitectureDocHero() {
  const { locale } = useI18n();
  const c = COPY[locale];
  return (
    <div style={{ margin: "0 0 40px" }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
        <span
          className="inline-flex items-center gap-2"
          style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--kz-text-muted)" }}
        >
          <Move3d size={14} strokeWidth={1.6} style={{ color: "var(--kz-accent)" }} />
          {c.label}
        </span>
        <Link
          href="/architecture"
          className="inline-flex items-center gap-1"
          style={{ fontSize: 12, fontWeight: 600, color: "var(--kz-accent)", textDecoration: "none" }}
        >
          {c.full}
          <ArrowUpRight size={13} strokeWidth={2} />
        </Link>
      </div>
      <Scene />
      <p style={{ marginTop: 10, fontSize: 12, color: "var(--kz-text-muted)", textAlign: "center" }}>
        {c.hint}
      </p>
    </div>
  );
}
