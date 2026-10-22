"use client";

/* /open-source's two searchable tables, on @krizaka/ui's DataTable (cards on a phone, filters and facets, announced
   counts): every published package (npm and Maven Central) and every repository. The rows are built on the server
   from what the registries and GitHub said at build (lib/package-catalogue.ts, lib/repository-catalogue.ts) and handed
   down as props — never fetched here. Words: messages → site.openSource.table / packages / repositories. */

import { format } from "@krizaka/i18n";
import { ExternalIcon } from "@krizaka/icons";
import { Sparkline } from "@krizaka/charts/sparkline";
import { DataTable, DataTableFilters, type DataTableColumn, type DataTableLabels } from "@krizaka/ui/data-table";
import type { PackageRow } from "@/lib/package-catalogue";
import { useI18n } from "@/app/components/I18nProvider";
import { useCarnet } from "@/app/components/useCarnet";
import { isHidden, namesHidden } from "@/lib/focus";

const DATE_LOCALE: Record<string, string> = { en: "en-CA", fr: "fr-CA" };

export interface RepositoryRow {
  id: string;
  name: string;
  url: string;
  line: string;
  /** The product's id (or `krizaka` for the platform): the focus hides the rows of the products outside it. */
  productId: string;
  product: string;
  kind: string;
  language: string;
  /** ISO date of the last push, or "" when unknown. */
  pushedAt: string;
}

function useTableLabels(): Partial<DataTableLabels> {
  const w = useI18n().t.site.openSource.table;
  return {
    empty: w.empty,
    results: (count) => format(w.results, { count }),
    filters: w.filters,
    clearFilters: w.clearFilters,
    removeFilter: (label) => format(w.removeFilter, { label }),
    activeFilter: (header, value) => format(w.activeFilter, { header, value }),
    search: (header) => format(w.search, { header }),
    group: (value, count) => format(w.group, { value, count }),
    columns: w.columns,
    pagination: {
      nav: w.pagination,
      previous: w.previous,
      next: w.next,
      page: (page) => format(w.page, { page }),
      compact: (page, pageCount) => format(w.compact, { page, pageCount }),
      pageSize: w.pageSize,
    },
  };
}

function Links({ links }: { links: readonly { href: string; label: string; aria: string }[] }) {
  return (
    <span className="os-links">
      {links.map((l) => (
        <a key={l.href + l.label} href={l.href} target="_blank" rel="noopener noreferrer" aria-label={l.aria}>
          {l.label} <ExternalIcon size={11} aria-hidden />
        </a>
      ))}
    </span>
  );
}

export function PackagesTable({ rows: all }: { rows: readonly PackageRow[] }) {
  const { t, locale } = useI18n();
  // A line that names a product outside the focus waits for the notebook to open whole (lib/focus.ts).
  const notebook = useCarnet();
  const rows = notebook ? all : all.filter((r) => !namesHidden(r.name)).map((r) => (namesHidden(r.line) ? { ...r, line: "" } : r));
  const w = t.site.openSource.packages;
  const labels = useTableLabels();
  const familyLabel = (f: string) => (f in w.families ? w.families[f as keyof typeof w.families] : f);
  const columns: DataTableColumn<PackageRow>[] = [
    { id: "name", header: w.name, type: "title", card: "title", filter: "text", sortable: true, subtitle: (r) => r.line, maxWidth: 420 },
    {
      id: "registry",
      header: w.registry,
      type: "badge",
      filter: "facet",
      value: (r) => (r.registry === "npm" ? "npm" : "Maven Central"),
    },
    { id: "family", header: w.family, filter: "facet", value: (r) => familyLabel(r.family), nowrap: true },
    { id: "version", header: w.version, nowrap: true, cell: (r) => <code className="os-version">{r.version}</code> },
    {
      id: "weeklyDownloads",
      header: w.downloads,
      type: "number",
      align: "end",
      sortable: true,
      value: (r) => r.weeklyDownloads ?? null,
      cell: (r) =>
        r.weeklyDownloads == null ? (
          "—"
        ) : (
          <span className="os-downloads">
            {r.weeklySeries ? <Sparkline data={r.weeklySeries} variant="area" width={72} height={22} title={`${r.name} — ${w.trend}`} /> : null}
            {new Intl.NumberFormat(locale).format(r.weeklyDownloads)}
          </span>
        ),
    },
    {
      id: "links",
      header: w.links,
      hideable: false,
      cell: (r) => (
        <Links
          links={[
            { href: r.registryUrl, label: r.registry === "npm" ? "npm" : "Central", aria: format(w.registryAria, { name: r.name }) },
            ...(r.repoUrl ? [{ href: r.repoUrl, label: w.repo, aria: format(w.repoAria, { name: r.name }) }] : []),
            ...(r.docsUrl ? [{ href: r.docsUrl, label: w.docs, aria: format(w.docsAria, { name: r.name }) }] : []),
          ]}
        />
      ),
    },
  ];
  return (
    <DataTable
      caption={w.caption}
      rows={rows}
      columns={columns}
      getRowId={(r) => r.id}
      rowLabel={(r) => r.name}
      defaultPageSize={12}
      density="compact"
      toolbar={<DataTableFilters />}
      labels={labels}
    />
  );
}

export function RepositoriesTable({ rows: all }: { rows: readonly RepositoryRow[] }) {
  const { t, locale } = useI18n();
  // The product facet and the rows follow the focus (lib/focus.ts): three products by default, all once the notebook is open.
  const notebook = useCarnet();
  const rows = notebook ? all : all.filter((r) => !isHidden(r.productId)).map((r) => (namesHidden(r.line) ? { ...r, line: "" } : r));
  const w = t.site.openSource.repositories;
  const labels = useTableLabels();
  const date = new Intl.DateTimeFormat(DATE_LOCALE[locale] ?? "en-CA", { dateStyle: "medium", timeZone: "UTC" });
  const columns: DataTableColumn<RepositoryRow>[] = [
    { id: "name", header: w.name, type: "title", card: "title", filter: "text", sortable: true, subtitle: (r) => r.line, href: (r) => r.url, maxWidth: 440 },
    { id: "product", header: w.product, filter: "facet", sortable: true, nowrap: true },
    { id: "kind", header: w.kind, filter: "facet", nowrap: true },
    { id: "language", header: w.language, filter: "facet", nowrap: true },
    {
      id: "pushedAt",
      header: w.updated,
      sortable: true,
      nowrap: true,
      value: (r) => r.pushedAt || null,
      cell: (r) => (r.pushedAt ? <span className="os-updated">{date.format(new Date(r.pushedAt))}</span> : "—"),
    },
  ];
  return (
    <DataTable
      caption={w.caption}
      rows={rows}
      columns={columns}
      getRowId={(r) => r.id}
      rowLabel={(r) => r.name}
      defaultSort={{ column: "product", direction: "ascending" }}
      defaultPageSize={12}
      density="compact"
      toolbar={<DataTableFilters />}
      labels={labels}
    />
  );
}
