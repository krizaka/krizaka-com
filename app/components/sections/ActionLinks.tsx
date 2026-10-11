import { ExternalIcon, type Icon } from "@krizaka/icons";

/** A row of external actions (discuss, propose, report…): icon, words, the external mark. */
export default function ActionLinks({ links }: { links: readonly { href: string; label: string; Icon: Icon }[] }) {
  return (
    <ul className="ps-actions">
      {links.map(({ href, label, Icon }) => (
        <li key={href}>
          <a href={href} target="_blank" rel="noopener noreferrer">
            <Icon size={15} aria-hidden /> {label} <ExternalIcon size={12} aria-hidden />
          </a>
        </li>
      ))}
    </ul>
  );
}
