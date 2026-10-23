/* Krizaka UI, shown: a small composed piece of published @krizaka/ui components — Avatar, Badge — and of @krizaka/charts
   (a Sparkline of @krizaka/ui's real weekly npm downloads, read at build). Inert: it is a picture, `aria-hidden`, and the
   text equivalent is the figure line under it (and the label for assistive technology). Words arrive as props
   (messages site.home.stack.ui.showcase). Colours are the components' own tokens, so both themes read. */

import { Sparkline } from "@krizaka/charts/sparkline";
import { Avatar } from "@krizaka/ui/avatar";
import { Badge, type BadgeProps } from "@krizaka/ui/badge";

export interface UiShowcaseRow {
  name: string;
  status: string;
}

export interface UiShowcaseWords {
  /** What the picture shows, for assistive technology. */
  label: string;
  rows: UiShowcaseRow[];
  downloads?: string;
  trend: string;
}

const TONES: BadgeProps["tone"][] = ["success", "accent", "warning", "neutral"];

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function UiShowcase({ w, series }: { w: UiShowcaseWords; series?: number[] }) {
  const data = series && series.length > 1 ? series : undefined;
  return (
    <figure className="kz-play kz-showcase" role="img" aria-label={[w.label, w.downloads].filter(Boolean).join(". ")}>
      <ul className="kz-showcase-rows" aria-hidden>
        {w.rows.map((row, i) => (
          <li key={row.name} className="kz-showcase-row">
            <Avatar size="sm" fallback={initials(row.name)} alt="" />
            <span className="kz-showcase-name">{row.name}</span>
            {data ? <Sparkline data={rotate(data, i)} variant="area" width={72} height={22} title={w.trend} /> : null}
            <Badge tone={TONES[i % TONES.length]} dot>
              {row.status}
            </Badge>
          </li>
        ))}
      </ul>
      {w.downloads ? <figcaption className="kz-showcase-caption">{w.downloads}</figcaption> : null}
    </figure>
  );
}

function rotate(data: number[], by: number) {
  const n = by % data.length;
  return [...data.slice(n), ...data.slice(0, n)];
}
