/* "How we work" — five rules, each one something the code, the CI or this site shows (no analytics here, the i18n
   check in CI, tests on every pull request, the public repositories). Short on purpose: a title and one sentence. */

import type { ComponentType } from "react";
import { AutomationIcon, GlobeIcon, KnowledgeIcon, LockIcon, EyeIcon, type IconProps } from "@krizaka/icons";
import { Section } from "@krizaka/ui/page";
import { format, getDictionary } from "@/lib/i18n";
import { reveal } from "@/lib/motion";

const PRINCIPLES: { id: "sovereign" | "accessible" | "bilingual" | "tested" | "open"; icon: ComponentType<IconProps> }[] = [
  { id: "sovereign", icon: LockIcon },
  { id: "accessible", icon: EyeIcon },
  { id: "bilingual", icon: GlobeIcon },
  { id: "tested", icon: AutomationIcon },
  { id: "open", icon: KnowledgeIcon },
];

export default function Principles({ locale, repositories }: { locale: string; repositories: number }) {
  const p = getDictionary(locale).site.home.principles;
  return (
    <Section id="principles" number={p.number} title={p.title} paper="lines" reveal divider margin>
      <ol className="kz-notebook-list">
        {PRINCIPLES.map(({ id, icon: Icon }, i) => (
          <li key={id} {...reveal(i % 3)}>
            <Icon size={20} aria-hidden />
            <h3>{p.items[id].title}</h3>
            <p>{format(p.items[id].body, { count: repositories })}</p>
          </li>
        ))}
      </ol>
      <p className="kz-folio">{p.folio}</p>
    </Section>
  );
}
