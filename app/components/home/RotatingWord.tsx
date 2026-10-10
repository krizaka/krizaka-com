"use client";

/* A word that rolls through alternatives — the hero's punchline. Every word is laid in the same grid cell, so the
   line keeps the width of the longest one from the first paint: changing word never moves the heading (no CLS) and
   the first word is the server-rendered LCP text. The change is opacity + transform only (composited), in CSS — no
   animation library. Still under prefers-reduced-motion. Decorative: the heading carries a stable aria-label. */

import { useEffect, useState } from "react";
import { cn } from "@krizaka/ui/cn";

export default function RotatingWord({ words, interval = 2600, className }: { words: string[]; interval?: number; className?: string }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((k) => (k + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [words.length, interval]);

  return (
    <span aria-hidden className="kz-rot">
      {words.map((word, k) => (
        <span key={word} className={cn("kz-rot-word", className)} data-on={k === i ? "" : undefined}>
          {word}
        </span>
      ))}
      <style>{`
        .kz-rot { display: inline-grid; justify-items: start; vertical-align: bottom; overflow: hidden; padding-bottom: .08em; }
        .kz-rot-word { grid-area: 1 / 1; white-space: nowrap; opacity: 0; transform: translateY(.45em);
          transition: opacity 600ms cubic-bezier(.16,1,.3,1), transform 600ms cubic-bezier(.16,1,.3,1); }
        .kz-rot-word[data-on] { opacity: 1; transform: none; }
        @media (prefers-reduced-motion: reduce) { .kz-rot-word { transition: none; } }
      `}</style>
    </span>
  );
}
