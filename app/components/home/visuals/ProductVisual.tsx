"use client";

/* The frame of a product row's mini-visual: a fixed box (no layout shift), decorative (`inert`, aria-hidden), filled
   only when the row comes near the viewport — the visuals' code (ProductVisuals, @krizaka/ui + @krizaka/charts pieces)
   is a separate chunk, never on the first screen's path. It plays while it is on screen, on every pointer (2026-10-20:
   no hover to wake it), and never under reduced motion: then it shows its still final frame. */

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ProductId } from "@/lib/products";

const ProductVisuals = dynamic(() => import("./ProductVisuals"), { ssr: false });

const REDUCE = "(prefers-reduced-motion: reduce)";
const readStill = () => window.matchMedia(REDUCE).matches;
const subscribe = (change: () => void) => {
  const q = window.matchMedia(REDUCE);
  q.addEventListener("change", change);
  return () => q.removeEventListener("change", change);
};

export default function ProductVisual({ id }: { id: ProductId }) {
  const box = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const still = useSyncExternalStore(subscribe, readStill, () => true);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) setNear(true);
        setOnScreen(entry.intersectionRatio > 0.4);
      },
      { rootMargin: "200px 0px", threshold: [0, 0.4] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const playing = !still && onScreen;
  return (
    <div ref={box} className="pv" data-visual={id} inert aria-hidden>
      {near && <ProductVisuals id={id} playing={playing} />}
    </div>
  );
}
