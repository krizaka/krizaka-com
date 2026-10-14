"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Monitor, MonitorSmartphone, Smartphone } from "lucide-react";
import { format } from "@krizaka/i18n";
import { FILTER_KEYS, JOBS, PATTERNS } from "@/lib/ui-ia";
import type { CatalogEntry } from "@/lib/ui-catalog";
import { PRODUCT_NAMES, PRODUCTS, type Product } from "@/lib/ui-inventory";
import type { Platform, Status } from "@/lib/ui-registry";
import { useI18n } from "../I18nProvider";
import { InlineCode } from "./InlineCode";
import { LazyExample } from "./LazyExample";

type PlatformFilter = "all" | Platform;
type UsedFilter = "all" | Product | "none";
const PLATFORMS: PlatformFilter[] = ["all", "web", "native", "both"];
const STATUSES: Status[] = ["stable", "beta", "deprecated"];
const ICON = { web: Monitor, native: Smartphone, both: MonitorSmartphone };

/** Web shows what runs on the web (web and both), Mobile what runs in React Native (native and both), Both what runs on both. */
const onPlatform = (filter: PlatformFilter, platforms: Platform) => filter === "all" || platforms === filter || (filter !== "both" && platforms === "both");

/** What the filters are, in the address (`?platform=native&group=maps`): a filtered catalogue is a link. */
function readFilters(search: string) {
  const params = new URLSearchParams(search);
  const pick = <T extends string>(key: string, allowed: readonly T[], fallback: T): T => {
    const value = params.get(key);
    return value && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
  };
  return {
    platform: pick<PlatformFilter>("platform", PLATFORMS, "all"),
    group: pick<string>("group", ["all", ...FILTER_KEYS], "all"),
    status: pick<Status | "all">("status", ["all", ...STATUSES], "all"),
    used: pick<UsedFilter>("by", ["all", "none", ...PRODUCTS], "all"),
  };
}

export function UiCatalog({ entries, usageDate }: { entries: CatalogEntry[]; usageDate: string }) {
  const { t } = useI18n();
  const c = t.docs.ia.catalog;
  const labels = t.docs.component;
  const [filters, setFilters] = useState(() => readFilters(""));
  const [ready, setReady] = useState(false);

  // The address holds the filters: read once on arrival (after hydration), written on every change.
  useEffect(() => {
    setFilters(readFilters(window.location.search));
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const params = new URLSearchParams();
    if (filters.platform !== "all") params.set("platform", filters.platform);
    if (filters.group !== "all") params.set("group", filters.group);
    if (filters.status !== "all") params.set("status", filters.status);
    if (filters.used !== "all") params.set("by", filters.used);
    const query = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`);
  }, [filters, ready]);

  const shown = useMemo(
    () =>
      entries.filter(
        (entry) =>
          onPlatform(filters.platform, entry.platforms) &&
          (filters.group === "all" || entry.group === filters.group) &&
          (filters.status === "all" || entry.status === filters.status) &&
          (filters.used === "all" || (filters.used === "none" ? entry.usedBy.length === 0 : entry.usedBy.includes(filters.used))),
      ),
    [entries, filters],
  );
  const set = <K extends keyof typeof filters>(key: K, value: (typeof filters)[K]) => setFilters((all) => ({ ...all, [key]: value }));
  const filtered = Object.values(filters).some((value) => value !== "all");

  const sectionTitle = (key: string) => (JOBS as readonly string[]).includes(key) ? t.docs.ia.jobs[key as (typeof JOBS)[number]] : (PATTERNS as readonly string[]).includes(key) ? t.docs.ia.patterns[key as (typeof PATTERNS)[number]] : t.docs.ia.groups.templates;
  const parent = (key: string) => ((JOBS as readonly string[]).includes(key) ? "components" : (PATTERNS as readonly string[]).includes(key) ? "patterns" : "templates") as "components" | "patterns" | "templates";

  const chips = <V extends string>(label: string, value: V, options: { value: V; label: string }[], onChange: (v: V) => void): ReactNode => (
    <div role="group" aria-label={label} className="kz-catalog-filter">
      {options.map((option) => (
        <button key={option.value} type="button" aria-pressed={value === option.value} onClick={() => onChange(option.value)}>
          {option.label}
        </button>
      ))}
    </div>
  );

  let lastParent = "";
  return (
    <section className="kz-catalog not-prose" aria-labelledby="catalog-title">
      <h2 id="catalog-title" className="sr-only">
        {c.heading}
      </h2>
      <p className="kz-docs-note">{c.lead}</p>
      <div className="kz-catalog-bar" role="search" aria-label={c.filters}>
        {chips(c.platform, filters.platform, PLATFORMS.map((value) => ({ value, label: t.docs.catalog[value] })), (v) => set("platform", v))}
        <label className="kz-catalog-select">
          <span>{c.group}</span>
          <select value={filters.group} onChange={(event) => set("group", event.target.value)}>
            <option value="all">{c.any}</option>
            {FILTER_KEYS.map((key) => (
              <option key={key} value={key}>
                {sectionTitle(key).title}
              </option>
            ))}
          </select>
        </label>
        {chips(c.status, filters.status, [{ value: "all" as const, label: c.any }, ...STATUSES.map((value) => ({ value, label: labels.status[value] }))], (v) => set("status", v))}
        {chips(
          c.usedBy,
          filters.used,
          [{ value: "all" as const, label: c.any }, ...PRODUCTS.map((value) => ({ value, label: PRODUCT_NAMES[value] })), { value: "none" as const, label: c.unused }],
          (v) => set("used", v),
        )}
        <p className="kz-catalog-count" aria-live="polite">
          {format(c.count, { count: shown.length, total: entries.length })}{" "}
          {filtered && (
            <button type="button" className="kz-catalog-clear" onClick={() => setFilters(readFilters(""))}>
              {c.clear}
            </button>
          )}
        </p>
      </div>
      {shown.length === 0 && <p className="kz-docs-note">{c.empty}</p>}
      {FILTER_KEYS.map((key) => {
        const items = shown.filter((entry) => entry.group === key);
        if (items.length === 0) return null;
        const words = sectionTitle(key);
        const group = parent(key);
        const heading = group !== lastParent ? (lastParent = group) : null;
        return (
          <div key={key} className="kz-catalog-group">
            {heading && <h3 className="kz-catalog-parent">{t.docs.ia.groups[group].title}</h3>}
            <h4>{words.title}</h4>
            <p className="kz-docs-note">{words.when}</p>
            <ul className="kz-catalog-grid">
              {items.map((entry) => {
                const Icon = ICON[entry.platforms];
                return (
                  <li key={entry.name} className="kz-catalog-card" data-state={entry.state ?? undefined}>
                    <div className="kz-catalog-preview" aria-hidden inert>
                      <Preview entry={entry} />
                    </div>
                    <div className="kz-catalog-body">
                      <Link href={entry.href} className="kz-catalog-card-title">
                        {entry.title}
                      </Link>
                      <span className="kz-catalog-card-text">
                        <InlineCode text={entry.summary} />
                      </span>
                      {entry.why && <span className="kz-catalog-why">{entry.why}</span>}
                      <span className="kz-catalog-card-foot">
                        <span className="kz-chip-meta" data-tone="accent">
                          <Icon aria-hidden />
                          {labels.platforms[entry.platforms]}
                        </span>
                        {entry.status !== "stable" && (
                          <span className="kz-chip-meta" data-tone={entry.status}>
                            {labels.status[entry.status]}
                          </span>
                        )}
                        {entry.state && entry.state !== "used" && (
                          <span className="kz-chip-meta" data-tone={entry.state === "removal" ? "deprecated" : "beta"}>
                            {c.states[entry.state]}
                          </span>
                        )}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
      <p className="kz-docs-note">{format(c.scan, { date: usageDate })}</p>
    </section>
  );
}

/** The card's picture: the live example when it is near (web), the screenshot of the mobile one, an icon until then. */
function Preview({ entry }: { entry: CatalogEntry }) {
  const { preview } = entry;
  const Icon = ICON[entry.platforms];
  const placeholder = (
    <span className="kz-catalog-placeholder">
      <Icon aria-hidden />
    </span>
  );
  if (!preview) return placeholder;
  if (preview.kind === "shot") {
    return (
      <span className="kz-catalog-shot">
        <Image src={preview.dark} alt="" width={preview.width} height={preview.height} loading="lazy" className="kz-shot-dark" />
        <Image src={preview.light} alt="" width={preview.width} height={preview.height} loading="lazy" className="kz-shot-light" />
      </span>
    );
  }
  return (
    <div className="kz-catalog-stage">
      <LazyExample exampleKey={preview.key} heavy={preview.heavy} placeholder={placeholder} />
    </div>
  );
}
