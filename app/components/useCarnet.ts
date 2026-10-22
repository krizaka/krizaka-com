"use client";

/* The notebook's state is the address (`?carnet=complet`, lib/focus.ts): this is its one reader and writer in the browser.
   `useCarnet()` for the lists that are data (they filter), `setCarnet()` to open or close it. The same state is the
   `data-carnet` attribute of <html>, which app/components/focus.css reads for everything the server rendered. */

import { useSyncExternalStore } from "react";
import { carnetOpen, withCarnet } from "@/lib/focus";

const CHANGE = "kz-carnet";

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(CHANGE, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(CHANGE, onChange);
  };
}

/** True while the notebook is open whole. Closed on the server and on the first render, then the address is read. */
export function useCarnet(): boolean {
  return useSyncExternalStore(subscribe, () => carnetOpen(window.location.search), () => false);
}

/** Mirrors the address on <html data-carnet>: what the CSS and the footer's rule read. */
export function syncCarnetAttribute(): void {
  const root = document.documentElement;
  if (carnetOpen(window.location.search)) root.dataset.carnet = "complet";
  else delete root.dataset.carnet;
}

/** Opens or closes the notebook: the address changes in place (no navigation), every reader follows. */
export function setCarnet(open: boolean): void {
  const { pathname, search, hash } = window.location;
  window.history.replaceState(window.history.state, "", withCarnet(`${pathname}${search}${hash}`, open));
  syncCarnetAttribute();
  window.dispatchEvent(new Event(CHANGE));
}
