import Link from "next/link";
import { ArgumentCard } from "@krizaka/ui/argument-card";
import { Mascot } from "@krizaka/ui/mascots";
import { Ticks } from "@krizaka/ui/page";
import type { TranslationDictionary } from "@/lib/i18n";
import type { BuildingBlock } from "@/lib/building-blocks";
import { format } from "@/lib/i18n";
import BlockIcon from "./BlockIcon";
import FeedbackLinks from "./FeedbackLinks";

type Words = TranslationDictionary["site"]["blocks"];

/** One building block on /open-source, a compact ArgumentCard (@krizaka/ui): its hue, icon, name and repository, its
    bird in the corner, the trap in one line, the facts (registry · version read at build, what is in progress),
    "Details" and the feedback icons. What it does, the decisions and the bird's rule live on /open-source/<block>. */
export default function BlockCard({ block, w }: { block: BuildingBlock; w: Words }) {
  const item = w.items[block.id];
  const release = block.releases[0];
  return (
    <ArgumentCard
      id={`block-${block.id}`}
      data-hue={block.hue}
      icon={<BlockIcon icon={block.icon} />}
      title={item.name}
      meta={block.repo}
      mark={<Mascot bird={block.bird} mood={block.mood} size={40} animated={false} />}
      facts={[
        { label: `${w[block.registry]} ${release.version}`, tone: "ok", href: release.url },
        ...(block.next.length > 0 ? [{ label: format(w.inProgress, { count: block.next.length }), tone: "wip" as const }] : []),
      ]}
      hook={{ label: w.trap, text: <Ticks>{item.headline}</Ticks> }}
      more={{ href: `/open-source/${block.id}`, label: w.details }}
      linkAs={Link}
      actions={<FeedbackLinks block={block} labels={w} variant="icons" />}
    />
  );
}
