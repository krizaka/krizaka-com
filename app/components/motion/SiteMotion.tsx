"use client";

/* The site's motion conductor — mounted once in the locale layout, renders nothing.
   It drives the declarative motion vocabulary of app/motion.css with three IntersectionObservers and no permanent
   requestAnimationFrame:

   - reveal  — every `[data-reveal]` (the @krizaka/ui motion.css signature) rises into place once, the first time it
               enters the viewport; `--kz-delay` staggers siblings (lib/motion.ts `reveal(i)`).
   - count   — every `[data-count-to]` (CountUp) climbs from 0 to its value once, in about a second, when it enters
               the viewport. The server renders the final value: without JS, under reduced motion, or when the figure
               is already on screen at load, it simply stays there (nothing jumps back to 0 in front of the reader).
   - pause   — every section (`main > section`, `main > header`, `.kz-backdrop`, `footer`, `[data-motion-scope]`) gets
               `data-offscreen` while it is off screen: its looping animations (backdrop drift, animated marks,
               illustrations) pause there, so only what can be seen moves.
   - settle  — `html[data-motion="ready"]` once the page has loaded and settled (1.2 s after `load`): until then the
               loops of the first screen hold their first frame, so nothing repaints the hero while it paints (LCP).

   Elements added later (client navigation, tabs) are picked up by one MutationObserver. Under
   prefers-reduced-motion everything is revealed at once, nothing counts, nothing loops (app/motion.css).

   @krizaka/ui ships the same reveal in its MotionObserver, but 2.0.0 does not export it, and it has no counter, no
   off-screen pause and no settle step: krizaka/krizaka-ui#41 proposes them for the package; this conductor goes
   when it lands. */

import { useEffect } from "react";

const REVEAL = "[data-reveal]:not(.kz-in)";
const COUNT = "[data-count-to]";
const SCOPE = "main > section, main > header, main > div > section, .kz-backdrop, footer, [data-motion-scope]";
const COUNT_MS = 1100;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

function countUp(el: HTMLElement) {
  const to = Number(el.dataset.countTo);
  const decimals = Number(el.dataset.countDecimals ?? 0);
  if (!Number.isFinite(to)) return;
  const fmt = new Intl.NumberFormat(document.documentElement.lang || "en", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  const start = performance.now();
  // A bounded loop: about 66 frames, then it stops for good.
  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / COUNT_MS);
    el.textContent = fmt.format(to * easeOut(p));
    if (p < 1) requestAnimationFrame(tick);
  };
  el.textContent = fmt.format(0);
  requestAnimationFrame(tick);
}

export default function SiteMotion(): null {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* settle */
    let settleTimer: ReturnType<typeof setTimeout> | undefined;
    const settle = () => (settleTimer = setTimeout(() => root.setAttribute("data-motion", "ready"), 1200));
    if (document.readyState === "complete") settle();
    else window.addEventListener("load", settle, { once: true });

    /* reveal */
    const revealIo = reduce
      ? null
      : new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (!entry.isIntersecting) continue;
              entry.target.classList.add("kz-in");
              revealIo!.unobserve(entry.target);
            }
          },
          { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
        );

    /* count — the first report of each figure tells whether it was already on screen at load. */
    const seen = new WeakSet<Element>();
    const countIo = reduce
      ? null
      : new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              const first = !seen.has(entry.target);
              seen.add(entry.target);
              if (!entry.isIntersecting) continue;
              countIo!.unobserve(entry.target);
              if (!first) countUp(entry.target as HTMLElement);
            }
          },
          { threshold: 0.6 },
        );

    /* pause */
    const scopeIo = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) entry.target.toggleAttribute("data-offscreen", !entry.isIntersecting);
      },
      { rootMargin: "120px 0px" },
    );

    const show = (el: Element) => {
      if (revealIo) revealIo.observe(el);
      else el.classList.add("kz-in");
    };
    const watch = (scope: ParentNode) => {
      scope.querySelectorAll(REVEAL).forEach(show);
      if (countIo) scope.querySelectorAll(COUNT).forEach((el) => countIo.observe(el));
      scope.querySelectorAll(SCOPE).forEach((el) => scopeIo.observe(el));
    };
    watch(document);

    const mo = new MutationObserver((records) => {
      for (const record of records)
        record.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches(REVEAL)) show(node);
          if (countIo && node.matches(COUNT)) countIo.observe(node);
          if (node.matches(SCOPE)) scopeIo.observe(node);
          watch(node);
        });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(settleTimer);
      window.removeEventListener("load", settle);
      revealIo?.disconnect();
      countIo?.disconnect();
      scopeIo.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
