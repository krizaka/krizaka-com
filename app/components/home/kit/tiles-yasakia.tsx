"use client";

/* Yasakia's tiles: the people and the places. The deck to swipe (a decision per card, never a score), the match, the
   tags that say who you are, the map and the picker of a meeting point (distance, radius). Portraits are Yasakia's. */

import { useState } from "react";
import { Badge } from "@krizaka/ui/badge";
import { Button } from "@krizaka/ui/button";
import { LocationPicker, Map, Marker, StaticMap, type LngLat } from "@krizaka/ui/map";
import { MatchDialog } from "@krizaka/ui/match-dialog";
import { PersonCard, SwipeDeck } from "@krizaka/ui/swipe-deck";
import { TagSelector } from "@krizaka/ui/tag-selector";
import { VerifiedBadge } from "@krizaka/ui/verified-badge";
import { format } from "@krizaka/i18n";
// The basemap through this origin (/maps/v1, the CDN proxied): no cross-origin request.
import "../../docs/MapAssets";
import { useI18n } from "../../I18nProvider";
import { KIT_MAP, KIT_YASAKIA_PEOPLE } from "@/lib/kit-live";
import type { KitTileProps } from "./types";

const LOCALES = { en: "en-CA", fr: "fr-CA" } as const;
const OPTIONS = ["0", "1", "2", "3", "4", "5"] as const;

export default function YasakiaTile({ id, media, brand }: KitTileProps) {
  const { t, locale } = useI18n();
  const k = t.site.home.build.kit;
  const [deck, setDeck] = useState<readonly string[]>(KIT_YASAKIA_PEOPLE.map((p) => p.id));
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<string[]>(["0", "2"]);
  const [point, setPoint] = useState<LngLat>(KIT_MAP.meeting);
  const [chosen, setChosen] = useState("a");
  const mapBrand = brand as "orazaka" | "orochia" | "yasakia" | "yororis";
  const places = KIT_MAP.spots.map((s) => ({ id: s.id, label: k.map.places[s.id as "a" | "b" | "c"], position: s.position }));
  const mapLabels = k.map.labels;
  const pl = k.picker.labels;

  switch (id) {
    case "swipe-deck": {
      const items = KIT_YASAKIA_PEOPLE.filter((p) => deck.includes(p.id));
      return (
        <SwipeDeck
          items={items}
          getId={(p) => p.id}
          getName={(p) => k.swipe.people[p.id].name}
          onSwipe={(p) => setDeck((all) => (all.length > 1 ? all.filter((x) => x !== p.id) : KIT_YASAKIA_PEOPLE.map((q) => q.id)))}
          labels={k.swipe.labels}
          renderCard={(p) => {
            const person = k.swipe.people[p.id];
            return (
              <PersonCard
                photos={[{ src: media.people[p.id] }]}
                name={person.name}
                age={p.age}
                badge={<VerifiedBadge label={k.swipe.verified} onMedia size="lg" />}
                meta={<span className="text-xs font-semibold">{format(k.swipe.away, { km: p.km })}</span>}
                bio={person.bio}
                footer={person.tags.map((tag) => <Badge key={tag} tone="scrim">{tag}</Badge>)}
              />
            );
          }}
        />
      );
    }
    case "match-dialog":
      return (
        <>
          <Button variant="primary" shape="cut" onClick={() => setOpen(true)}>{k.match.button}</Button>
          <MatchDialog
            open={open}
            onOpenChange={setOpen}
            title={k.match.title}
            description={k.match.description}
            people={[{ src: media.people.ines, name: k.match.me }, { src: media.people.kofi, name: k.swipe.people.kofi.name }]}
            primaryLabel={k.match.primary}
            onPrimary={() => setOpen(false)}
            secondaryLabel={k.match.secondary}
          />
        </>
      );
    case "tag-selector":
      return (
        <TagSelector
          label={k.tags.label}
          options={OPTIONS.map((o) => ({ value: o, label: k.tags.options[o] }))}
          value={tags}
          onValueChange={setTags}
          max={4}
          countLabel={(count, max) => format(k.tags.count, { count, max })}
        />
      );
    case "location-picker":
      return (
        <LocationPicker
          label={k.picker.label}
          locale={LOCALES[locale]}
          value={point}
          onValueChange={setPoint}
          origin={KIT_MAP.origin}
          radius={KIT_MAP.radius}
          brand={mapBrand}
          lang={locale}
          className="kl-map"
          labels={{ nearMe: pl.nearMe, locating: pl.locating, denied: pl.denied, unavailable: pl.unavailable, you: pl.you, distance: (distance) => format(pl.distance, { distance }) }}
          fallback={<StaticMap label={k.picker.label} center={point} zoom={14} places={[{ position: point, label: k.picker.label }]} />}
        />
      );
    case "map":
      return (
        <Map
          label={k.map.label}
          center={KIT_MAP.center}
          zoom={12}
          brand={mapBrand}
          lang={locale}
          labels={mapLabels}
          className="kl-map"
          fallback={<StaticMap label={k.map.label} center={KIT_MAP.center} zoom={12} places={places} />}
        >
          {places.map((p) => (
            <Marker key={p.id} position={p.position} label={p.label} selected={p.id === chosen} onPress={() => setChosen(p.id)} />
          ))}
        </Map>
      );
    default:
      return null;
  }
}
