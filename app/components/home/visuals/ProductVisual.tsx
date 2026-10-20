"use client";

/* The frame of a product card's mini-visual: a fixed box (no layout shift), decorative (`inert`, aria-hidden), filled
   only when the card comes near the viewport — the visuals' code (ProductVisuals, @krizaka/ui + @krizaka/charts pieces)
   is a separate chunk, never on the first screen's path. It plays while on screen and hovered or focused (fine pointer)
   — always on screen on touch — and never under reduced motion: then it shows its still final frame. */

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ProductId } from "@/lib/products";

const ProductVisuals = dynamic(() => import("./ProductVisuals"), { ssr: false });

type Mode = "still" | "hover" | "screen";
const REDUCE = "(prefers-reduced-motion: reduce)";
const FINE = "(hover: hover) and (pointer: fine)";
const readMode = (): Mode => (window.matchMedia(REDUCE).matches ? "still" : window.matchMedia(FINE).matches ? "hover" : "screen");
const subscribe = (change: () => void) => {
  const queries = [window.matchMedia(REDUCE), window.matchMedia(FINE)];
  for (const q of queries) q.addEventListener("change", change);
  return () => queries.forEach((q) => q.removeEventListener("change", change));
};

export default function ProductVisual({ id }: { id: ProductId }) {
  const box = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [hover, setHover] = useState(false);
  const mode = useSyncExternalStore(subscribe, readMode, () => "still" as Mode);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const card = el.closest(".kz-pc, [data-pv-host]");
    const enter = () => setHover(true);
    const leave = () => setHover(false);
    card?.addEventListener("pointerenter", enter);
    card?.addEventListener("pointerleave", leave);
    card?.addEventListener("focusin", enter);
    card?.addEventListener("focusout", leave);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) setNear(true);
        setOnScreen(entry.intersectionRatio > 0.4);
      },
      { rootMargin: "200px 0px", threshold: [0, 0.4] },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      card?.removeEventListener("pointerenter", enter);
      card?.removeEventListener("pointerleave", leave);
      card?.removeEventListener("focusin", enter);
      card?.removeEventListener("focusout", leave);
    };
  }, []);

  const playing = mode !== "still" && onScreen && (mode === "screen" || hover);
  return (
    <div ref={box} className="pv" data-visual={id} inert aria-hidden>
      {near && <ProductVisuals id={id} playing={playing} />}
    </div>
  );
}
