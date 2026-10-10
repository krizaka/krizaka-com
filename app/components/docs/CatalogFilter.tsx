"use client";

import { useState } from "react";
import Link from "next/link";
import { Monitor, MonitorSmartphone, Smartphone } from "lucide-react";
import { format } from "@/lib/i18n";
import type { Category, Platform, Status } from "@/lib/ui-registry";
import { useI18n } from "../I18nProvider";
import { InlineCode } from "./InlineCode";

export interface CatalogEntry {
  name: string;
  title: string;
  summary: string;
  platforms: Platform;
  status: Status;
  category: Category;
  href: string;
}

type Filter = "all" | Platform;
const FILTERS: Filter[] = ["all", "web", "native", "both"];
const ICON = { web: Monitor, native: Smartphone, both: MonitorSmartphone };

/** Web shows what runs on the web (web and both), Mobile what runs in React Native (native and both), Both what runs on both. */
const matches = (filter: Filter, platforms: Platform) =>
  filter === "all" || platforms === filter || (filter !== "both" && platforms === "both");

export function CatalogFilter({ entries, groups }: { entries: CatalogEntry[]; groups: { category: Category; label: string }[] }) {
  const { t } = useI18n();
  const c = t.docs.catalog;
  const labels = t.docs.component;
  const [filter, setFilter] = useState<Filter>("all");
  const shown = entries.filter((entry) => matches(filter, entry.platforms));

  return (
    <section className="kz-catalog not-prose" aria-labelledby="catalog-title">
      <h2 id="catalog-title" className="sr-only">
        {c.heading}
      </h2>
      <div className="kz-catalog-bar">
        <div role="group" aria-label={c.filter} className="kz-catalog-filter">
          {FILTERS.map((value) => (
            <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>
              {c[value]}
            </button>
          ))}
        </div>
        <p className="kz-catalog-count" aria-live="polite">
          {format(c.count, { count: shown.length })}
        </p>
      </div>
      {groups.map(({ category, label }) => {
        const items = shown.filter((entry) => entry.category === category);
        if (items.length === 0) return null;
        return (
          <div key={category} className="kz-catalog-group">
            <h3>{label}</h3>
            <ul className="kz-catalog-grid">
              {items.map((entry) => {
                const Icon = ICON[entry.platforms];
                return (
                  <li key={entry.name}>
                    <Link href={entry.href} className="kz-catalog-card">
                      <span className="kz-catalog-card-head">
                        <span className="kz-catalog-card-title">{entry.title}</span>
                      </span>
                      <span className="kz-catalog-card-text">
                        <InlineCode text={entry.summary} />
                      </span>
                      <span className="kz-catalog-card-foot">
                        <span className="kz-chip-meta" data-tone="accent">
                          <Icon aria-hidden />
                          {labels.platforms[entry.platforms]}
                        </span>
                        {entry.status === "beta" && (
                          <span className="kz-chip-meta" data-tone="beta">
                            {labels.status.beta}
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </section>
  );
}
