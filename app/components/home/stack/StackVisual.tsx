"use client";

/* The frame of a publication row's live visual (the home's « Build with our open source »): a fixed box (no layout shift),
   decorative (`inert`, aria-hidden), filled only when the row comes near the viewport — the visuals' code (StackVisuals:
   Krizaka UI's card, the engine flow, the names of a set of packages, a snippet) is a separate chunk, never on the first
   screen's path. Same contract as the products' ProductVisual. The motion itself is @krizaka/ui's: it plays only on
   screen and after the page settles (MotionObserver), and rests under reduced motion and Save-Data. */

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { StackVisual as VisualId } from "@/lib/stack";
import type { StackVisualData } from "./StackVisuals";

const StackVisuals = dynamic(() => import("./StackVisuals"), { ssr: false });

export default function StackVisual({ visual, data }: Readonly<{ visual: VisualId; data: StackVisualData }>) {
  const box = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={box} className="kz-stack-visual" data-visual={visual} inert aria-hidden>
      {near && <StackVisuals visual={visual} data={data} />}
    </div>
  );
}
