"use client";

import Link from "next/link";
import { DataTable, type DataTableColumn } from "@krizaka/ui/data-table";
import { InlineCode } from "./InlineCode";

export interface ParityRow {
  name: string;
  title: string;
  href: string;
  web: boolean;
  /** What differs on mobile, in words; empty when the API is the same, `null` for a mobile-only component. */
  differences: string | null;
}

export interface ParityLabels {
  caption: string;
  component: string;
  web: string;
  mobile: string;
  differences: string;
  yes: string;
  no: string;
  onlyMobile: string;
  same: string;
}

/** The parity of the components between the web and React Native: sortable, cards on a phone (DataTable of @krizaka/ui). */
export function MobileParityTable({ rows, labels }: { rows: ParityRow[]; labels: ParityLabels }) {
  const columns: DataTableColumn<ParityRow>[] = [
    { id: "title", header: labels.component, sortable: true, card: "title", cell: (row) => <Link href={row.href}>{row.title}</Link> },
    { id: "web", header: labels.web, cell: (row) => (row.web ? labels.yes : labels.no) },
    { id: "mobile", header: labels.mobile, cell: () => labels.yes },
    {
      id: "differences",
      header: labels.differences,
      cell: (row) => (row.differences === null ? labels.onlyMobile : row.differences ? <InlineCode text={row.differences} /> : labels.same),
    },
  ];
  return <DataTable caption={labels.caption} rows={rows} columns={columns} getRowId={(row) => row.name} rowLabel={(row) => row.title} defaultSort={{ column: "title", direction: "ascending" }} />;
}
