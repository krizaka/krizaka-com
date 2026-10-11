import { FlagIcon, MessageIcon, PlusIcon } from "@krizaka/icons";
import { ActionBar } from "@krizaka/ui/action-bar";
import { type BuildingBlock, proposeUrl, reportUrl } from "@/lib/building-blocks";

/** Discuss (the block's thread) · Propose (an idea in its forum) · Report a bug (an issue on its repository) — buttons
    with their words, or icon buttons with a tooltip at the foot of a card (@krizaka/ui ActionBar). */
export default function FeedbackLinks({
  block,
  labels,
  variant = "buttons",
}: {
  block: BuildingBlock;
  labels: { discuss: string; propose: string; report: string; feedback: string };
  variant?: "buttons" | "icons";
}) {
  const size = variant === "icons" ? 17 : 16;
  return (
    <ActionBar
      variant={variant}
      size={variant === "icons" ? "sm" : "md"}
      label={labels.feedback}
      actions={[
        { href: block.thread, label: labels.discuss, icon: <MessageIcon size={size} aria-hidden /> },
        { href: proposeUrl(block), label: labels.propose, icon: <PlusIcon size={size} aria-hidden /> },
        { href: reportUrl(block), label: labels.report, icon: <FlagIcon size={size} aria-hidden /> },
      ]}
    />
  );
}
