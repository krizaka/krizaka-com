/* « What we know how to do » (§ 4): the capabilities proven by running code, each one card that leads to its evidence
   (source or site) with the figures read at build (lib/know-how.ts). One link per card, no other action. */

import type { ComponentType } from "react";
import { AutomationIcon, PackIcon, KnowledgeIcon, LockIcon, SearchIcon, WalletIcon, type IconProps } from "@krizaka/icons";
import { CardGrid } from "@krizaka/ui/card-grid";
import { LinkCard } from "@krizaka/ui/link-card";
import { Facts, Section, type Fact } from "@krizaka/ui/page";
import Link from "next/link";
import { format, getDictionary } from "@/lib/i18n";
import { KNOW_HOW, knowHowFacts, type KnowHowFigures, type KnowHowId } from "@/lib/know-how";
import { PRODUCTS } from "@/lib/products";

const ICON: Record<KnowHowId, ComponentType<IconProps>> = {
  engine: LockIcon,
  documents: SearchIcon,
  shops: WalletIcon,
  design: AutomationIcon,
  java: PackIcon,
  open: KnowledgeIcon,
};

export default function KnowHow({ locale, figures }: { locale: string; figures: KnowHowFigures }) {
  const t = getDictionary(locale);
  const k = t.site.home.knowhow;
  const fmt = new Intl.NumberFormat(locale);
  return (
    <Section id="know-how" number={k.number} title={k.title} lead={k.lead} paper="lines" reveal divider margin>
      <CardGrid as="ul" min={300} columns={3} aria-label={k.listLabel} reveal>
        {KNOW_HOW.map(({ id, href, product }) => {
          const status = product ? PRODUCTS.find((p) => p.id === product)!.status : undefined;
          const facts: Fact[] = [
            ...(status ? [{ label: t.site.nav.status[status].label, tone: status === "devPreview" ? ("ok" as const) : ("wip" as const) }] : []),
            ...knowHowFacts(id, figures).map(([key, count]) => ({ label: format(k.facts[key], { count: fmt.format(count) }) })),
          ];
          const Icon = ICON[id];
          return (
            <LinkCard
              key={id}
              href={href}
              linkAs={Link}
              icon={<Icon size={20} aria-hidden />}
              title={k.items[id].title}
              description={k.items[id].line}
              extra={facts.length ? <Facts items={facts} /> : undefined}
              cta={k.items[id].cta}
            />
          );
        })}
      </CardGrid>
    </Section>
  );
}
