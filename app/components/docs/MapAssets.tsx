"use client";

// The maps of the documentation (@krizaka/ui/map) read the basemap through this origin (/maps/v1, a rewrite of
// next.config.ts to the CDN): set once when the module loads in the browser, before any map asks for its tiles.
import { configureMaps } from "@krizaka/ui/map";

if (typeof window !== "undefined") configureMaps({ assetsBase: `${window.location.origin}/maps/v1` });

export function MapAssets() {
  return null;
}
