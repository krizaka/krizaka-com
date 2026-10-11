import { FlagIcon, MessageIcon, PlusIcon } from "@krizaka/icons";
import { type BuildingBlock, proposeUrl, reportUrl } from "@/lib/building-blocks";
import ActionLinks from "../sections/ActionLinks";

/** Discuss (the block's thread) · Propose (an idea in its forum) · Report a bug (an issue on its repository). */
export default function FeedbackLinks({ block, labels }: { block: BuildingBlock; labels: { discuss: string; propose: string; report: string } }) {
  return (
    <ActionLinks
      links={[
        { href: block.thread, label: labels.discuss, Icon: MessageIcon },
        { href: proposeUrl(block), label: labels.propose, Icon: PlusIcon },
        { href: reportUrl(block), label: labels.report, Icon: FlagIcon },
      ]}
    />
  );
}
