/* "How we work" — four rules, each one something the code, the CI or this site shows (krizaka-internal#2553): a check that
   reports facts (no score), the document that leaves after its check, Montréal and Canada (Law 25, French first, hosted
   in tor, no tracker), the open code. Tests and accessibility live on /docs. Its figures are read at build. Short on purpose. */

import type { ComponentType } from "react";
import { floorFigure } from "@/lib/figure-floor";
import { KnowledgeIcon, LockIcon, SearchIcon, TrashIcon, type IconProps } from "@krizaka/icons";
import { Section } from "@krizaka/ui/page";
import { format, getDictionary } from "@/lib/i18n";
import { reveal } from "@/lib/motion";
import { folioOf } from "@/lib/home-sections";

const PRINCIPLES: {
  id: "facts" | "kept" | "canada" | "open";
  icon: ComponentType<IconProps>;
}[] = [
  { id: "facts", icon: SearchIcon },
  { id: "kept", icon: TrashIcon },
  { id: "canada", icon: LockIcon },
  { id: "open", icon: KnowledgeIcon },
];

export default function Principles({
  locale,
  figures,
}: {
  locale: string;
  figures: { repositories: number; npm: number };
}) {
  const p = getDictionary(locale).site.home.principles;
  return (
    <Section id="principles" number={p.number} title={p.title} paper="lines" reveal divider margin>
      <ol className="kz-notebook-list">
        {PRINCIPLES.map(({ id, icon: Icon }, i) => (
          <li key={id} {...reveal(i % 3)}>
            <Icon size={20} aria-hidden />
            <h3>{p.items[id].title}</h3>
            <p>
              {format(p.items[id].body, { count: floorFigure(figures.repositories), npm: floorFigure(figures.npm) })}
            </p>
          </li>
        ))}
      </ol>
      <p className="kz-folio">{format(p.folio, folioOf("principles"))}</p>
    </Section>
  );
}
