"use client";

/* Arriving on a page: the page starts at its top and the screen reader is told where it is. Next.js scrolls to the top
   by itself, but skips it for a navigation that went through a redirect (the unprefixed addresses answer a 307 in
   proxy.ts) — the visitor then landed mid-page, not knowing which page it was (/story peer review, 2026-10-21). This
   is the net under every link: on a change of page (not of language, not of #anchor) it puts the scroll at 0 and moves
   focus to the page's main heading (h1, focusable by script only), preventScroll so nothing jumps. Nothing on first load. */

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const withoutLocale = (path: string) => path.replace(/^\/(en|fr)(?=\/|$)/, "") || "/";

export default function RouteArrival() {
  const pathname = usePathname() ?? "/";
  const previous = useRef(pathname);
  useEffect(() => {
    const before = previous.current;
    previous.current = pathname;
    if (withoutLocale(before) === withoutLocale(pathname) || window.location.hash) return;
    const root = document.documentElement;
    const behavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    root.style.scrollBehavior = behavior;
    const heading = document.querySelector<HTMLElement>("main h1, h1");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
  }, [pathname]);
  return null;
}
