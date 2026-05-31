"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/* ─────────────────────────────────────────────────────────────────────
   OrazakaPageClient — Framer Motion animation wrapper for the product
   page. Isolates all client-side interactivity so the parent page.tsx
   remains a pure Server Component for SEO.
   ───────────────────────────────────────────────────────────────────── */

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.15,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export default function OrazakaPageClient({
  children,
}: {
  children: ReactNode;
}) {
  /* Wrap each direct child section in a staggered motion container */
  const childArray = Array.isArray(children) ? children : [children];

  return (
    <>
      {childArray.map((child, i) => (
        <motion.div
          key={i}
          custom={i}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={sectionVariants}
        >
          {child}
        </motion.div>
      ))}
    </>
  );
}
