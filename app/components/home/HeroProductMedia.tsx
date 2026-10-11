"use client";

/* The two products, glimpsed behind the home hero: a short, very blurred loop of each real application (a re-encoded
   cut of the product tours, public/assets/home/backdrop/) on its side of the page — Orazaka on the left, Orochia on
   the right, each in its brand. A teaser, not a player: you see that something lives there, never what.

   Nothing of it belongs to the first paint (LCP): the panes start as a still brand tint, the poster arrives once the
   page has loaded and settled (as SiteMotion does, 1.2 s after `load`), and the loop only on a wide screen, without
   prefers-reduced-motion or a data saver; it plays while the hero is on screen and pauses off it. On a phone, under
   reduced motion or a data saver, the poster stays: still, and a few kilobytes. Decorative: hidden from assistive
   technology. The hovered product card brightens its pane (CSS :has(), OrgHero). */

import { useEffect, useRef, useState } from "react";
import { cn } from "@krizaka/ui/cn";

const PRODUCTS = ["orazaka", "orochia"] as const;
const SRC = "/assets/home/backdrop/";

type Stage = "tint" | "poster" | "loop";

export default function HeroProductMedia() {
  const box = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<Stage>("tint");

  useEffect(() => {
    const still =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(min-width: 768px)").matches ||
      Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
    let timer: ReturnType<typeof setTimeout> | undefined;
    const start = () => (timer = setTimeout(() => setStage(still ? "poster" : "loop"), 1200));
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", start);
    };
  }, []);

  useEffect(() => {
    const el = box.current;
    if (stage !== "loop" || !el) return;
    const observer = new IntersectionObserver(([entry]) => {
      el.querySelectorAll("video").forEach((v) => (entry.isIntersecting ? void v.play().catch(() => undefined) : v.pause()));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [stage]);

  return (
    <div ref={box} data-backdrop-layer aria-hidden className="org-hero-media">
      {PRODUCTS.map((id) => (
        <div key={id} className={cn("org-hero-pane-depth", "brand-" + id)} data-product={id} data-parallax="">
          <div className="org-hero-pane" data-product={id} data-stage={stage}>
            {stage === "loop" ? (
              <video poster={`${SRC}${id}.jpg`} autoPlay muted loop playsInline preload="auto" disablePictureInPicture tabIndex={-1}>
                <source src={`${SRC}${id}.webm`} type="video/webm" />
                <source src={`${SRC}${id}.mp4`} type="video/mp4" />
              </video>
            ) : stage === "poster" ? (
              // eslint-disable-next-line @next/next/no-img-element -- a 7–10 kB decorative poster, blurred: no image pipeline needed
              <img src={`${SRC}${id}.jpg`} alt="" decoding="async" loading="lazy" />
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
