/* Key figures as one block everywhere (the home's stack, /story's open blocks, /open-source's hero): @krizaka/ui Stat
   tiles in a StatGrid, the figure counting up once (NumberTicker). Figures are read at build (registries, GitHub) by the
   caller — never typed. `columns`: the rows are full, wide and on a phone (lib/figure-grid.ts) — never an empty cell —
   and a value never breaks (figure-tiles.css). */

import type { CSSProperties } from "react";
import { NumberTicker } from "@krizaka/ui/number-ticker";
import { Stat, StatGrid } from "@krizaka/ui/stat";
import { figureColumns } from "@/lib/figure-grid";
import "./figure-tiles.css";

export interface FigureTile {
  id: string;
  label: string;
  /** A number counts up; a string (a version) is shown as is. */
  value: number | string;
}

export default function FigureTiles({
  figures,
  label,
  locale,
  columns = false,
}: {
  figures: readonly FigureTile[];
  label: string;
  locale: string;
  /** Lay the tiles out in full rows (4 → one row, 2 × 2 on a phone) instead of the grid's auto-fit. */
  columns?: boolean;
}) {
  const cols = columns ? figureColumns(figures.length) : undefined;
  const style = cols
    ? ({ "--kz-fig-cols": cols.wide, "--kz-fig-cols-narrow": cols.narrow } as CSSProperties)
    : undefined;
  return (
    <StatGrid role="group" aria-label={label} minWidth={10} className={cols ? "kz-fig-grid" : undefined} style={style}>
      {figures.map((f) => (
        <Stat
          key={f.id}
          label={f.label}
          value={typeof f.value === "number" ? <NumberTicker value={f.value} locale={locale} /> : f.value}
        />
      ))}
    </StatGrid>
  );
}
