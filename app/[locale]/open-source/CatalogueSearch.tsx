"use client";

/* /open-source — the developer's way in: search the Krizaka UI catalogue (every live component and template of the
   published registries, lib/ui-catalogue.ts, read at build) and land on its page of ui.krizaka.com. The search
   field and its list are @krizaka/ui's SearchField (a combobox); Enter opens the first match. Words arrive as props. */

import { useState } from "react";
import { SearchField } from "@krizaka/ui/search-field";
import { cataloguePageUrl, matchCatalogue, type CatalogueEntry } from "@/lib/catalogue-match";

export interface CatalogueSearchWords {
  label: string;
  placeholder: string;
  results: string;
  clear: string;
}

export default function CatalogueSearch({
  entries,
  locale,
  w,
}: {
  entries: readonly CatalogueEntry[];
  locale: string;
  w: CatalogueSearchWords;
}) {
  const [query, setQuery] = useState("");
  const found = matchCatalogue(entries, query);
  const open = (name: string) => window.location.assign(cataloguePageUrl(name, locale));
  return (
    <SearchField
      label={w.label}
      placeholder={w.placeholder}
      value={query}
      onValueChange={setQuery}
      onSubmit={() => found[0] && open(found[0].name)}
      suggestions={found.map((e) => ({ value: e.name, label: e.title, meta: e.category }))}
      suggestionsLabel={w.results}
      onSuggestionSelect={(s) => open(s.value)}
      clearLabel={w.clear}
      shortcut="/"
      className="os-search"
    />
  );
}
