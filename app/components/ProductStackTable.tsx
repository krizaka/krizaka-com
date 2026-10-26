"use client";

import { DataTable, type DataTableColumn } from "@krizaka/ui/data-table";
import { ProductLogo } from "@krizaka/ui";
import type { FoundationPart, KitId, StackCell, Transport } from "@/lib/product-stack";

export interface StackTableRow {
  id: string;
  name: string;
  cells: StackCell[];
}

export interface StackTableLabels {
  caption: string;
  product: string;
  yes: string;
  no: string;
  partial: string;
  isEngine: string;
  planned: string;
  transport: Record<Transport, string>;
  parts: Record<FoundationPart, string>;
  kits: Record<KitId, string>;
}

/** What each product runs on: a real data table (DataTable of @krizaka/ui — headers, caption, cards on a phone), every
    cell worded, so it reads without its dots. The cells come from the manifests (lib/product-stack.ts). */
export default function ProductStackTable({ rows, kits, labels }: { rows: StackTableRow[]; kits: readonly KitId[]; labels: StackTableLabels }) {
  const word = (c: StackCell) => {
    if (c.state === "engine") return labels.isEngine;
    if (c.state === "planned") return labels.planned;
    if (c.state === "no") return labels.no;
    if (c.state === "partial") return `${labels.partial} · ${(c.parts ?? []).map((p) => labels.parts[p]).join(", ")}`;
    return c.transport ? labels.transport[c.transport] : labels.yes;
  };
  const columns: DataTableColumn<StackTableRow>[] = [
    {
      id: "product",
      header: labels.product,
      card: "title",
      cell: (row) => (
        <span className="os-stack-product">
          <ProductLogo id={row.id as "orazaka"} size={22} animated={false} />
          {row.name}
        </span>
      ),
    },
    ...kits.map<DataTableColumn<StackTableRow>>((kit) => ({
      id: kit,
      header: labels.kits[kit],
      cell: (row) => {
        const cell = row.cells.find((c) => c.kit === kit)!;
        return (
          <span className="os-stack-cell" data-state={cell.state}>
            <span aria-hidden className="os-stack-dot" />
            {word(cell)}
          </span>
        );
      },
    })),
  ];
  return <DataTable caption={labels.caption} showCaption rows={rows} columns={columns} getRowId={(r) => r.id} rowLabel={(r) => r.name} />;
}
