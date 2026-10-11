import { ExternalIcon, type Icon } from "@krizaka/icons";
import IconActions from "./IconActions";

/** External actions (discuss, propose, report…). `buttons` (default): ghost buttons with their words — the end of a
    page or a section. `icons`: icon buttons with a tooltip — the foot of a card, where room is short. */
export default function ActionLinks({
  links,
  variant = "buttons",
  label,
}: {
  links: readonly { href: string; label: string; Icon: Icon }[];
  variant?: "buttons" | "icons";
  label?: string;
}) {
  if (variant === "icons")
    return <IconActions label={label} links={links.map(({ href, label, Icon }) => ({ href, label, icon: <Icon size={17} aria-hidden /> }))} />;
  return (
    <ul className="ps-actions" aria-label={label}>
      {links.map(({ href, label, Icon }) => (
        <li key={href}>
          <a href={href} target="_blank" rel="noopener noreferrer" className="ps-btn">
            <Icon size={16} aria-hidden /> {label} <ExternalIcon size={12} aria-hidden />
          </a>
        </li>
      ))}
    </ul>
  );
}
