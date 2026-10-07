"use client";

/* A word that rolls through alternatives — the hero's punchline. Server render and first client
   render show the first word (no hydration mismatch); under prefers-reduced-motion it stays put.
   Purely decorative: the heading carries a stable aria-label. */

import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const noop = () => () => {};

export default function RotatingWord({ words, interval = 2400, className }: { words: string[]; interval?: number; className?: string }) {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const still = !mounted || !!reduce;

  useEffect(() => {
    if (still) return;
    const t = setInterval(() => setI((k) => (k + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [still, words.length, interval]);

  return (
    <span aria-hidden style={{ display: "inline-grid", verticalAlign: "bottom", overflow: "hidden", paddingBottom: "0.08em" }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={still ? 0 : i}
          initial={{ y: "100%", opacity: 0, filter: "blur(6px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-100%", opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className={className}
          style={{ gridArea: "1 / 1", whiteSpace: "nowrap" }}
        >
          {words[still ? 0 : i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
