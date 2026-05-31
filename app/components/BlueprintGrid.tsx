"use client";

import { motion } from "framer-motion";
import { Cpu } from "lucide-react";

/* ─── MODULE CARD ─── */

function ModuleCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative border border-kz-technical-line/40 bg-kz-deep-slate/60 p-4 hover:border-kz-primary-container/40 transition-colors duration-300 w-full max-w-xs"
    >
      <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-kz-technical-line/60" />
      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-kz-technical-line/60" />

      <div className="flex items-start justify-between mb-3">
        <Cpu className="w-4 h-4 text-kz-outline opacity-70 group-hover:text-kz-primary-container group-hover:opacity-100 transition-all duration-300" />
        <span className="font-mono text-[9px] font-bold tracking-[0.15em] text-kz-technical-line">
          v4.2.1
        </span>
      </div>

      <h3 className="font-mono text-[10px] md:text-[11px] font-bold tracking-[0.12em] uppercase text-kz-on-surface mb-2">
        ORASAKA CORE ENGINE
      </h3>

      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full status-dot bg-kz-alert-amber" />
        <span className="font-mono text-[9px] font-bold tracking-[0.18em] uppercase text-kz-alert-amber">
          STAGED
        </span>
      </div>
    </motion.div>
  );
}

/* ─── BLUEPRINT GRID ─── */

export default function BlueprintGrid() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.9 }}
      className="mt-16 md:mt-20 w-full max-w-4xl"
      aria-label="System Blueprint Status"
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="h-px flex-1 bg-kz-technical-line/30" />
        <span className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-kz-technical-line">
          SYSTEM BLUEPRINT
        </span>
        <div className="h-px flex-1 bg-kz-technical-line/30" />
      </div>

      <div className="flex justify-center">
        <ModuleCard />
      </div>
    </motion.section>
  );
}
