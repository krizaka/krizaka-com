"use client";

import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { Terminal } from "lucide-react";

const BOOT_MESSAGES = [
  "KRIZAKA BIOS v4.2.1 — POST SEQUENCE INITIATED",
  "SCANNING MEMORY BANKS ............... 128 GB OK",
  "LOADING NEURAL MESH FIRMWARE ........ VALID",
  "BINDING PERSISTENCE LAYER ........... CONNECTED",
  "AUTHENTICATING CORE CERTIFICATES .... VERIFIED",
  "INITIALIZING MULTI-AGENT CONTEXT .... STAGED",
  "SYSTEM NOMINAL. TRANSFERRING CONTROL.",
];

const lineVariant: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.15 } },
};

export default function BootSequence({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < BOOT_MESSAGES.length) {
        setLines((prev) => [...prev, BOOT_MESSAGES[i]]);
        setProgress(((i + 1) / BOOT_MESSAGES.length) * 100);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 600);
      }
    }, 320);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="w-full h-full"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(245,158,11,0.04) 2px, rgba(245,158,11,0.04) 4px)",
          }}
        />
      </div>

      {/* Terminal output */}
      <div className="w-full max-w-2xl px-6 md:px-8">
        <div className="mb-6 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-kz-primary-container" />
          <span className="font-mono text-xs tracking-[0.15em] uppercase text-kz-primary-container">
            KRIZAKA SYSTEM BOOTSTRAP
          </span>
        </div>

        <div className="space-y-1 font-mono text-[11px] md:text-xs leading-relaxed">
          {lines.map((line, idx) => (
            <motion.div
              key={idx}
              variants={lineVariant}
              initial="hidden"
              animate="visible"
              className="text-kz-on-surface-variant"
            >
              <span className="text-kz-technical-line mr-2">
                [{String(idx).padStart(2, "0")}]
              </span>
              {line}
            </motion.div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-8 h-[2px] w-full bg-kz-surface-raised overflow-hidden">
          <motion.div
            className="h-full bg-kz-primary-container"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
        <div className="mt-2 flex justify-between font-mono text-[9px] tracking-widest uppercase text-kz-technical-line">
          <span>BOOT PROGRESS</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>
    </motion.div>
  );
}
