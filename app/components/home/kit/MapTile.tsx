"use client";

/* The Map tile: MapLibre with our Protomaps basemap (@krizaka/ui/map), loaded only when the tile nears the screen —
   the engine is the heaviest piece of the kit. The accent is the chosen identity's. */

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Map, Marker, StaticMap } from "@krizaka/ui/map";
import { useI18n } from "../../I18nProvider";

const CENTER = [-73.592, 45.528] as const;
const SPOTS = [
  { id: "a", position: [-73.6005, 45.5229] as const },
  { id: "b", position: [-73.6147, 45.5363] as const },
  { id: "c", position: [-73.5695, 45.5268] as const },
];

function MapView({ brand }: { brand: "orazaka" | "orochia" | "yazakia" | "yororis" }) {
  const { t, locale } = useI18n();
  const m = t.site.home.build.kit.map;
  const [chosen, setChosen] = useState("a");
  const places = SPOTS.map((s) => ({ id: s.id, label: m.places[s.id as "a" | "b" | "c"], position: s.position }));
  return (
    <Map
      label={m.label}
      center={CENTER}
      zoom={12}
      brand={brand}
      lang={locale}
      className="kl-map"
      fallback={<StaticMap label={m.label} center={CENTER} zoom={12} places={places} />}
    >
      {places.map((p) => (
        <Marker key={p.id} position={p.position} label={p.label} selected={p.id === chosen} onPress={() => setChosen(p.id)} />
      ))}
    </Map>
  );
}

const LazyMap = dynamic(() => Promise.resolve(MapView), { ssr: false });

export default function MapTile({ brand }: { brand: "orazaka" | "orochia" | "yazakia" | "yororis" }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(([entry]) => entry?.isIntersecting && setNear(true), { rootMargin: "300px" });
    io.observe(node);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className="kl-map-frame">{near ? <LazyMap brand={brand} /> : null}</div>;
}
