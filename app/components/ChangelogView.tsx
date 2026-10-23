"use client";

/* The changelog with its product filter. The server renders every release (so the static page is complete and the build
   can check it); here the address (`?produit=`) and the focus (the notebook, `?carnet=complet`) choose what shows. The
   chips are real links: without JavaScript they reload the page with the filter. */

import Link from "next/link";
import type { MouseEvent } from "react";
import { ChangelogPage, type ChangelogEntry } from "@krizaka/ui/changelog-page";
import { ChipLink } from "@krizaka/ui/chip-link";
import { FILTER_PARAM, filterHref, filterOf, visibleEntries, visibleFilters, type FilterId } from "@/lib/changelog-filter";
import { useCarnet } from "./useCarnet";
import { setSearch, useSearchParam } from "./useSearchParam";

type Props = Omit<React.ComponentProps<typeof ChangelogPage>, "entries" | "linkAs" | "actions"> & {
  entries: readonly (ChangelogEntry & { product: string })[];
  /** The RSS feed: a chip of the same row, at its end — one size for everything the row offers (krizaka-com#357). */
  feed: { href: string; label: string };
  filterLabel: string;
  allLabel: string;
  filterNames: Record<FilterId, string>;
  none: string;
};

export default function ChangelogView({ entries, feed, filterLabel, allLabel, filterNames, none, ...page }: Props) {
  const open = useCarnet();
  const selected = filterOf(useSearchParam(FILTER_PARAM));
  const shown = visibleEntries(entries, selected, open);
  const chips: { id: FilterId | undefined; label: string }[] = [{ id: undefined, label: allLabel }, ...visibleFilters(open).map((id) => ({ id, label: filterNames[id] }))];

  const choose = (id: FilterId | undefined) => (e: MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    setSearch(filterHref(window.location.search, id));
  };

  return (
    <>
      <ChangelogPage
        {...page}
        linkAs={Link}
        entries={shown}
        actions={
          <>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.5rem", width: "100%" }}>
              <nav aria-label={filterLabel} style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {chips.map(({ id, label }) => (
                  <ChipLink key={id ?? "all"} asChild size="md" selected={selected === id}>
                    <a href={filterHref("", id)} onClick={choose(id)}>
                      {label}
                    </a>
                  </ChipLink>
                ))}
              </nav>
              <ChipLink asChild size="md" style={{ marginInlineStart: "auto" }}>
                <a href={feed.href} type="application/rss+xml">
                  {feed.label}
                </a>
              </ChipLink>
            </div>
          </>
        }
      />
      {shown.length === 0 && entries.length > 0 && (
        <p style={{ margin: "0 auto", maxWidth: "var(--kz-page-max)", padding: "0 var(--kz-page-gutter) 4rem", color: "var(--kz-text-secondary)" }}>{none}</p>
      )}
    </>
  );
}
