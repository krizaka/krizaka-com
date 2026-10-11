import { FlagIcon, MessageIcon, PlusIcon } from "@krizaka/icons";
import { type BuildingBlock, proposeUrl, reportUrl } from "@/lib/building-blocks";
import ActionLinks from "../sections/ActionLinks";

/** Discuss (the block's thread) · Propose (an idea in its forum) · Report a bug (an issue on its repository) — buttons
    with their words, or icon buttons with a tooltip at the foot of a card. */
export default function FeedbackLinks({
  block,
  labels,
  variant = "buttons",
}: {
  block: BuildingBlock;
  labels: { discuss: string; propose: string; report: string; feedback: string };
  variant?: "buttons" | "icons";
}) {
  return (
    <ActionLinks
      variant={variant}
      label={labels.feedback}
      links={[
        { href: block.thread, label: labels.discuss, Icon: MessageIcon },
        { href: proposeUrl(block), label: labels.propose, Icon: PlusIcon },
        { href: reportUrl(block), label: labels.report, Icon: FlagIcon },
      ]}
    />
  );
}
