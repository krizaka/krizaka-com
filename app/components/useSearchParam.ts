"use client";

/* One query parameter of the address as React state, in place (no navigation): the page's state is its URL. The same
   pattern for every URL-state reader; Next's router follows `history.replaceState`. Empty on the server and on the first render. */

import { useSyncExternalStore } from "react";

const CHANGE = "kz-search";

function subscribe(onChange: () => void) {
  globalThis.addEventListener("popstate", onChange);
  globalThis.addEventListener(CHANGE, onChange);
  return () => {
    globalThis.removeEventListener("popstate", onChange);
    globalThis.removeEventListener(CHANGE, onChange);
  };
}

export function useSearchParam(name: string): string | null {
  return useSyncExternalStore(
    subscribe,
    () => new URLSearchParams(globalThis.location.search).get(name),
    () => null,
  );
}

/** Points the address at `search` (`?produit=x`), keeping the path and the hash, and tells every reader. */
export function setSearch(search: string): void {
  const { pathname, hash } = globalThis.location;
  globalThis.history.pushState(globalThis.history.state, "", `${pathname}${search === "?" ? "" : search}${hash}`);
  globalThis.dispatchEvent(new Event(CHANGE));
}
