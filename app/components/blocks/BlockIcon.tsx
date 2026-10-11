import { CreditsIcon, NotificationIcon, PackIcon, ShieldIcon, ThemeIcon, UsersIcon } from "@krizaka/icons";
import type { BlockIcon as BlockIconId } from "@/lib/building-blocks";

const ICONS = {
  build: PackIcon,
  shield: ShieldIcon,
  users: UsersIcon,
  notification: NotificationIcon,
  credits: CreditsIcon,
  theme: ThemeIcon,
} as const;

/** The signature icon of a building block (@krizaka/icons); its node wears the block's hue and lights up with its card. */
export default function BlockIcon({ icon, size = 22 }: { icon: BlockIconId; size?: number }) {
  const Icon = ICONS[icon];
  return <Icon size={size} nodeColor="var(--ps-hue, var(--kz-accent))" aria-hidden />;
}
