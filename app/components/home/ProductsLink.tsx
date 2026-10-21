"use client";

/* Ties each product row of the home to its node in the engine flow (2026-10-20): the row in the middle of the screen —
   only where the flow sits beside the list (≥ 1024 px, sticky) — or the row pointed at or focused lights its node and
   conduit, and pointing at a node lights its row. It only sets `data-lit` (the CSS in home.css says what lit looks like;
   no motion of its own, so nothing changes under reduced motion). No scroll listener, no animation frame: one
   IntersectionObserver and delegated pointer/focus events. Nodes are found by the `kz-home-n-<id>` class EngineFlowView
   gives them; rows by their `data-product`. */

import { useEffect, useRef, type ReactNode } from "react";

const WIDE = "(min-width: 1024px)";
const NODE_PREFIX = "kz-home-n-";

const nodeId = (el: Element) => [...el.classList].find((c) => c.startsWith(NODE_PREFIX))?.slice(NODE_PREFIX.length);

export default function ProductsLink({ className, children }: { className?: string; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let current: string | undefined; // the row in the middle of the screen
    let pointed: string | undefined; // the row or node under the pointer or focus

    const light = () => {
      const id = pointed ?? current;
      if (id) el.dataset.lit = id;
      else delete el.dataset.lit;
      for (const n of el.querySelectorAll(".kz-flow-node, .kz-flow-link")) n.toggleAttribute("data-lit", nodeId(n) === id);
      for (const r of el.querySelectorAll<HTMLElement>("[data-product]")) r.toggleAttribute("data-lit", r.dataset.product === id);
      // The flock above the section (ProductsFlock) shows the same product: its bird looks up.
      window.dispatchEvent(new CustomEvent("kz-products-lit", { detail: id ?? null }));
    };

    const target = (e: Event) => {
      const t = e.target instanceof Element ? e.target : null;
      const node = t?.closest(".kz-flow-node");
      if (node) return nodeId(node);
      return t?.closest<HTMLElement>("[data-product]")?.dataset.product;
    };
    const enter = (e: Event) => {
      pointed = target(e);
      light();
    };
    const leave = (e: Event) => {
      const next = (e as PointerEvent | FocusEvent).relatedTarget;
      if (next instanceof Node && el.contains(next)) return;
      pointed = undefined;
      light();
    };
    // …and the reverse: a bird of the flock pointed at or focused lights its row and its node.
    const fromFlock = (e: Event) => {
      pointed = (e as CustomEvent<string | null>).detail ?? undefined;
      light();
    };
    window.addEventListener("kz-products-point", fromFlock);
    el.addEventListener("pointerover", enter);
    el.addEventListener("focusin", enter);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("focusout", leave);

    const wide = window.matchMedia(WIDE);
    let io: IntersectionObserver | undefined;
    const observe = () => {
      io?.disconnect();
      io = undefined;
      current = undefined;
      light();
      if (!wide.matches) return;
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const id = (entry.target as HTMLElement).dataset.product;
            if (entry.isIntersecting) current = id;
            else if (current === id) current = undefined;
          }
          light();
        },
        { rootMargin: "-45% 0px -45% 0px" },
      );
      for (const r of el.querySelectorAll(".kz-entry[data-product]")) io.observe(r);
    };
    observe();
    wide.addEventListener("change", observe);

    return () => {
      io?.disconnect();
      wide.removeEventListener("change", observe);
      window.removeEventListener("kz-products-point", fromFlock);
      el.removeEventListener("pointerover", enter);
      el.removeEventListener("focusin", enter);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("focusout", leave);
    };
  }, []);

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
