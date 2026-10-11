"use client";

import { useEffect, useRef } from "react";

/** The light that follows the pointer over the cards of a grid: one passive pointermove listener on the grid writes the
    pointer's position into the hovered card (`--mx`, `--my`), the card's CSS draws the light. Nothing runs on touch
    screens or under reduced motion, and nothing loops. */
export default function PointerLight() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const grid = ref.current?.parentElement;
    if (!grid || !window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;
    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest<HTMLElement>(".ps-card");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${Math.round(e.clientX - r.left)}px`);
      card.style.setProperty("--my", `${Math.round(e.clientY - r.top)}px`);
    };
    grid.addEventListener("pointermove", onMove, { passive: true });
    return () => grid.removeEventListener("pointermove", onMove);
  }, []);
  return <span ref={ref} hidden />;
}
