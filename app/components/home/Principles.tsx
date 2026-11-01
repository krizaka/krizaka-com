/* "How we work" — six rules, each one something the code, the CI or this site shows: erasure that erases (Akinaza's
   client erasure, Yomizaka's purge, Orazaka's retention), the books kept (payments against invoices, the GST/QST
   ledger, a return prepared and never filed), checks that report facts (no model, no score), the data where it is
   decided, the quality gates, the open code. Its figures are read at build. Short on purpose: a title and one sentence. */

import type { ComponentType } from "react";
import { floorFigure } from "@/lib/figure-floor";
import {
  AutomationIcon,
  KnowledgeIcon,
  LockIcon,
  SearchIcon,
  TrashIcon,
  WalletIcon,
  type IconProps,
} from "@krizaka/icons";
import { Section } from "@krizaka/ui/page";
import { format, getDictionary } from "@/lib/i18n";
import { reveal } from "@/lib/motion";
import { folioOf } from "@/lib/home-sections";

const PRINCIPLES: {
  id: "forgotten" | "books" | "facts" | "sovereign" | "quality" | "open";
  icon: ComponentType<IconProps>;
}[] = [
  { id: "forgotten", icon: TrashIcon },
  { id: "books", icon: WalletIcon },
  { id: "facts", icon: SearchIcon },
  { id: "sovereign", icon: LockIcon },
  { id: "quality", icon: AutomationIcon },
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
            <p>{format(p.items[id].body, { count: floorFigure(figures.repositories), npm: floorFigure(figures.npm) })}</p>
          </li>
        ))}
      </ol>
      <p className="kz-folio">{format(p.folio, folioOf("principles"))}</p>
    </Section>
  );
}
