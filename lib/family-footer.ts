/* The footer's « Products » and « Open source » columns, read from the family of @krizaka/org (`org.members`,
   krizaka-internal#4096): never a name or an address typed here. A private member is not in the published data, so Krizaka
   Agents appears the day its row is public; a member is linked only where something answers: its site when the data says
   it is live (`urls.siteLive`), else its public repository, else nothing (FooterSettings has no link-less row). */
import { org } from "@krizaka/org";

type Member = (typeof org.members)[number];
type Group = "products" | "open-source";

/** The founder's priority (2026-11-16: « priorise agent et rust »): these ids lead their group, the family's order follows. */
const FIRST: Record<Group, readonly string[]> = { products: ["agents"], "open-source": ["rust"] };

/** Where a member's link goes: its site only if it answers, else its public repository, else nowhere. */
export function linkOf(member: Pick<Member, "urls">): string | null {
  const { site, siteLive, repo } = member.urls;
  if (siteLive && site) {
    return site;
  }
  return repo;
}

export function membersOf(group: Group, members: readonly Member[] = org.members): Member[] {
  const lead = FIRST[group];
  const rank = (m: Member) => {
    const i = lead.indexOf(m.id);
    return i === -1 ? lead.length : i;
  };
  return members
    .filter((m) => m.group === group && m.visibility === "public")
    .toSorted((a, b) => rank(a) - rank(b) || a.order - b.order);
}

export function footerLinks(group: Group, members: readonly Member[] = org.members) {
  return membersOf(group, members).flatMap((m) => {
    const href = linkOf(m);
    return href ? [{ label: m.name, href, external: true as const }] : [];
  });
}
