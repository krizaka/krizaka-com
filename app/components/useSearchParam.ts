"use client";

/* One query parameter of the address as React state, in place (no navigation): the page's state is its URL. The same
   pattern for every URL-state reader; Next's router follows `history.replaceState`. Empty on the server and on the first render. */

import { useSyncExternalStore } from "react";

const CHANGE = "kz-search";

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(CHANGE, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(CHANGE, onChange);
  };
}

export function useSearchParam(name: string): string | null {
  return useSyncExternalStore(subscribe, () => new URLSearchParams(window.location.search).get(name), () => null);
}

/** Points the address at `search` (`?produit=x`), keeping the path and the hash, and tells every reader. */
export function setSearch(search: string): void {
  const { pathname, hash } = window.location;
  window.history.pushState(window.history.state, "", `${pathname}${search === "?" ? "" : search}${hash}`);
  window.dispatchEvent(new Event(CHANGE));
}
