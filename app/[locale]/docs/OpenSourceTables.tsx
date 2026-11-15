"use client";

/* /open-source's two searchable tables, on @krizaka/ui's DataTable (cards on a phone, filters and facets, announced
   counts): every published package (npm and Maven Central) and the repositories. The rows are built on the server
   from what the registries and GitHub said at build (lib/package-catalogue.ts, lib/repository-catalogue.ts) and handed
   down as props — never fetched here. Words: messages → site.openSource.table / packages / repositories. */

import { format } from "@krizaka/i18n";
import { ExternalIcon } from "@krizaka/icons";
import { Sparkline } from "@krizaka/charts/sparkline";
import { DataTable, DataTableFilters, type DataTableColumn, type DataTableLabels } from "@krizaka/ui/data-table";
import type { PackageRow } from "@/lib/package-catalogue";
import { useI18n } from "@/app/components/I18nProvider";

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

function Links({ links }: Readonly<{ links: readonly { href: string; label: string; aria: string }[] }>) {
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

function VersionCell({ version }: Readonly<{ version: string }>) {
  return <code className="os-version">{version}</code>;
}

function DownloadsCell({ row, locale, trend }: Readonly<{ row: PackageRow; locale: string; trend: string }>) {
  if (row.weeklyDownloads == null) return "—";
  return (
    <span className="os-downloads">
      {row.weeklySeries ? (
        <Sparkline data={row.weeklySeries} variant="area" width={72} height={22} title={`${row.name} — ${trend}`} />
      ) : null}
      {new Intl.NumberFormat(locale).format(row.weeklyDownloads)}
    </span>
  );
}

type PackagesWords = ReturnType<typeof useI18n>["t"]["site"]["openSource"]["packages"];

function RegistryLinks({ row: r, w }: Readonly<{ row: PackageRow; w: PackagesWords }>) {
  return (
    <Links
      links={[
        {
          href: r.registryUrl,
          label: r.registry === "npm" ? "npm" : "Central",
          aria: format(w.registryAria, { name: r.name }),
        },
        ...(r.repoUrl ? [{ href: r.repoUrl, label: w.repo, aria: format(w.repoAria, { name: r.name }) }] : []),
        ...(r.releasesUrl
          ? [{ href: r.releasesUrl, label: w.releases, aria: format(w.releasesAria, { name: r.name }) }]
          : []),
        ...(r.docsUrl ? [{ href: r.docsUrl, label: w.docs, aria: format(w.docsAria, { name: r.name }) }] : []),
      ]}
    />
  );
}

export function PackagesTable({ rows }: Readonly<{ rows: readonly PackageRow[] }>) {
  const { t, locale } = useI18n();
  const w = t.site.openSource.packages;
  const labels = useTableLabels();
  const familyLabel = (f: string) => (f in w.families ? w.families[f as keyof typeof w.families] : f);
  const columns: DataTableColumn<PackageRow>[] = [
    {
      id: "name",
      header: w.name,
      type: "title",
      card: "title",
      filter: "text",
      sortable: true,
      subtitle: (r) => r.line,
      maxWidth: 420,
    },
    {
      id: "registry",
      header: w.registry,
      type: "badge",
      filter: "facet",
      value: (r) => (r.registry === "npm" ? "npm" : "Maven Central"),
    },
    { id: "family", header: w.family, filter: "facet", value: (r) => familyLabel(r.family), nowrap: true },
    { id: "version", header: w.version, nowrap: true, cell: (r) => <VersionCell version={r.version} /> },
    {
      id: "weeklyDownloads",
      header: w.downloads,
      type: "number",
      align: "end",
      sortable: true,
      value: (r) => r.weeklyDownloads ?? null,
      cell: (r) => <DownloadsCell row={r} locale={locale} trend={w.trend} />,
    },
    {
      id: "links",
      header: w.links,
      hideable: false,
      cell: (r) => <RegistryLinks row={r} w={w} />,
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
