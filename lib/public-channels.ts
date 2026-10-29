/* Where a public conversation happens on GitHub — the contact page's « Or talk in public » and /open-source's contribute
   section share it: a discussion (a question, an idea) or an issue (a bug), on the repository of every product
   (lib/products.ts) and of every open-source piece (lib/stack.ts). Derived, never a hand list: a new product appears
   by itself. Structure only: the words are messages (contact.channels, site.contactPage).

   A Discussions link exists only where the repository has Discussions on (a snapshot read from GitHub at build,
   lib/github-channels.json); elsewhere the question is an issue labelled `question` — never a dead page. */

export type ChannelGroupId = "products" | "stack";
export type ChannelKind = "discussions" | "issues";

export interface ChannelSource {
  id: string;
  name: string;
  repoUrl: string;
}

export interface RepoChannelState {
  discussions: boolean;
  issues: boolean;
}

export interface ChannelState {
  fetchedAt?: string;
  repos: Record<string, RepoChannelState>;
}

export interface ChannelLink {
  href: string;
  /** Discussions are off there: the question is an issue labelled `question`. */
  viaIssue: boolean;
}

export interface ChannelEntry {
  id: string;
  name: string;
  repoUrl: string;
  /** The mark: a product's own, the Krizaka mark for the stack. */
  mark: string;
  discussions: ChannelLink;
  issues: ChannelLink;
}

export interface ChannelGroup {
  group: ChannelGroupId;
  entries: ChannelEntry[];
}

/** The two conversations, in the order the page shows them. */
export const PUBLIC_CHANNELS = [{ id: "discussions" }, { id: "issues" }] as const;

/** `krizaka-ui` from `https://github.com/krizaka/krizaka-ui`. */
export const repoName = (repoUrl: string) => repoUrl.replace(/\/$/, "").split("/").pop() ?? "";

export const discussionsUrl = (repoUrl: string) => `${repoUrl}/discussions/new/choose`;
export const issuesUrl = (repoUrl: string) => `${repoUrl}/issues/new/choose`;
export const questionUrl = (repoUrl: string) => `${repoUrl}/issues/new?labels=question`;

function entry(source: ChannelSource, mark: string, state: ChannelState): ChannelEntry {
  const known = state.repos[repoName(source.repoUrl)];
  const discussionsOn = known?.discussions === true;
  // Issues are on unless the snapshot says otherwise; a repository without them is linked itself, not a dead /issues/new.
  const issuesOn = known ? known.issues : true;
  return {
    id: source.id,
    name: source.name,
    repoUrl: source.repoUrl,
    mark,
    discussions: discussionsOn
      ? { href: discussionsUrl(source.repoUrl), viaIssue: false }
      : { href: issuesOn ? questionUrl(source.repoUrl) : source.repoUrl, viaIssue: true },
    issues: { href: issuesOn ? issuesUrl(source.repoUrl) : source.repoUrl, viaIssue: false },
  };
}

export function buildPublicChannels(
  products: ChannelSource[],
  stack: ChannelSource[],
  state: ChannelState,
): ChannelGroup[] {
  return [
    { group: "products", entries: products.map((p) => entry(p, p.id, state)) },
    { group: "stack", entries: stack.map((s) => entry(s, "krizaka", state)) },
  ];
}
