import type { TranslationDictionary } from "@/lib/i18n";
import type { BuildingBlock } from "@/lib/building-blocks";
import { format } from "@/lib/i18n";
import ArgumentCard from "../sections/ArgumentCard";
import BlockIcon from "./BlockIcon";
import FeedbackLinks from "./FeedbackLinks";

type Words = TranslationDictionary["site"]["blocks"];

/** One building block on /open-source, in the page language: its hue, icon and badges (registry · version, what is in
    progress), the trap in one line, what it does in three points, the long version folded, the rule its bird stands
    for, then why/how and the feedback icons. */
export default function BlockCard({ block, w }: { block: BuildingBlock; w: Words }) {
  const item = w.items[block.id];
  const release = block.releases[0];
  return (
    <ArgumentCard
      id={`block-${block.id}`}
      hue={block.hue}
      icon={<BlockIcon icon={block.icon} />}
      title={item.name}
      meta={block.repo}
      badges={[
        { label: `${w[block.registry]} ${release.version}`, tone: "ok", href: release.url },
        ...(block.next.length > 0 ? [{ label: format(w.inProgress, { count: block.next.length }), tone: "wip" as const, href: `/open-source/${block.id}#status` }] : []),
      ]}
      hook={{ label: w.trap, text: item.headline }}
      points={{ label: w.answer, items: item.does }}
      details={{
        summary: w.more,
        points: [
          { label: w.trap, text: item.trap },
          { label: w.answer, text: item.answer },
        ],
      }}
      rule={{ bird: block.bird, mood: block.mood, label: format(w.birdSays, { bird: w.birds[block.bird] }), text: item.rule }}
      more={{ href: `/open-source/${block.id}`, label: w.whyHow }}
      actions={<FeedbackLinks block={block} labels={w} variant="icons" />}
    />
  );
}
