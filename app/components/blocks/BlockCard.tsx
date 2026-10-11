import type { TranslationDictionary } from "@/lib/i18n";
import type { BuildingBlock } from "@/lib/building-blocks";
import { format } from "@/lib/i18n";
import ArgumentCard from "../sections/ArgumentCard";
import BlockIcon from "./BlockIcon";
import FeedbackLinks from "./FeedbackLinks";

type Words = TranslationDictionary["site"]["blocks"];

/** One building block on /open-source, in the page language: the trap → what it does, the rule its bird stands for,
    then why/how and the feedback links. */
export default function BlockCard({ block, w }: { block: BuildingBlock; w: Words }) {
  const item = w.items[block.id];
  const release = block.releases[0];
  return (
    <ArgumentCard
      id={`block-${block.id}`}
      icon={<BlockIcon icon={block.icon} />}
      title={item.name}
      meta={`${block.repo} · ${w[block.registry]} ${release.version}`}
      points={[
        { label: w.trap, text: item.trap },
        { label: w.answer, text: item.answer },
      ]}
      rule={{ bird: block.bird, label: format(w.birdSays, { bird: w.birds[block.bird] }), text: item.rule }}
      more={{ href: `/open-source/${block.id}`, label: w.whyHow }}
      actions={<FeedbackLinks block={block} labels={w} />}
    />
  );
}
