/* Where a public conversation happens on GitHub — the contact page's picker and /open-source's contribute section share
   it: a discussion (a question, an idea) or an issue (a bug), on the repository of the product or of the building
   blocks. Structure only: the words are messages (contact.channels, site.contactPage.publicProducts). */

export const PUBLIC_REPOSITORIES = [
  { product: "orazaka", repo: "orazaka" },
  { product: "orochia", repo: "orochia" },
  { product: "krizaka", repo: "krizaka-platform-kit" },
] as const;

export const PUBLIC_CHANNELS = [
  { id: "discussions", path: "discussions/new/choose" },
  { id: "issues", path: "issues/new/choose" },
] as const;
