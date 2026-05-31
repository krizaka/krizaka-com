"use client";

import type { ReactNode } from "react";
import TopNavBar from "./TopNavBar";
import SiteFooter from "./SiteFooter";

/* Shared page shell for the inner (non-home) routes. Guarantees one consistent
   top offset that clears the fixed floating nav (no content under the header),
   a single max-width container, horizontal gutters, and bottom breathing room
   before the footer — fixing the under-nav / footer collisions once, instead of
   per-page padding patches. */

const MAXW = {
  "4xl": "56rem",
  "5xl": "64rem",
  "6xl": "72rem",
  "7xl": "80rem",
} as const;

export default function PageShell({
  children,
  max = "6xl",
}: {
  children: ReactNode;
  max?: keyof typeof MAXW;
}) {
  return (
    <>
      <TopNavBar />
      {/* All spacing is inline on purpose: the global `* { margin: 0; padding: 0 }`
         reset in globals.css is unlayered, so it overrides Tailwind's layered spacing
         utilities (mx-auto, px-*, pt-*). Without this the container pins left and slides
         under the fixed floating nav. paddingTop clears the nav (top 12px + height 48px). */}
      <main
        style={{
          width: "100%",
          maxWidth: MAXW[max],
          marginInline: "auto",
          paddingInline: "24px",
          paddingTop: "112px",
          paddingBottom: "112px",
        }}
      >
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
