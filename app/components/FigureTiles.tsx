/* Key figures as one block everywhere (the home's stack, /story's open blocks): @krizaka/ui Stat tiles in a StatGrid,
   the figure counting up once (NumberTicker). Figures are read at build (registries, GitHub) by the caller — never typed. */

import { NumberTicker } from "@krizaka/ui/number-ticker";
import { Stat, StatGrid } from "@krizaka/ui/stat";

export interface FigureTile {
  id: string;
  label: string;
  /** A number counts up; a string (a version) is shown as is. */
  value: number | string;
}

export default function FigureTiles({ figures, label, locale }: { figures: readonly FigureTile[]; label: string; locale: string }) {
  return (
    <StatGrid role="group" aria-label={label} minWidth={10}>
      {figures.map((f) => (
        <Stat key={f.id} label={f.label} value={typeof f.value === "number" ? <NumberTicker value={f.value} locale={locale} /> : f.value} />
      ))}
    </StatGrid>
  );
}
