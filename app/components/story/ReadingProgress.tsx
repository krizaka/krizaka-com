"use client";

/* The reading progress of /story: a hairline at the very top of the viewport that fills as the page is read. One passive
   scroll listener writes the ratio to a CSS variable (no animation frame, no layout read in the hot path beyond the two
   scroll metrics); decorative (`aria-hidden`, the chapters' contents is the accessible way to know where you are); the
   same under reduced motion (nothing is animated, the bar only follows the scroll). */

import { useEffect, useRef } from "react";

export default function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.setProperty("--st-read", String(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return <div ref={bar} className="st-progress" aria-hidden="true" data-testid="reading-progress" />;
}
