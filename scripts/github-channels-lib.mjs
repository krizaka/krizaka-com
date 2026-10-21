/* Pure rules of the public-channels snapshot (lib/github-channels.json): what GitHub says of each repository, kept as
   booleans only. Tested by tests/public-channels.test.mjs. */

/** { fetchedAt, repos: { <name>: { discussions, issues } } } — anything else is dropped; nothing known = Discussions off. */
export function parseChannelState(raw) {
  const repos = {};
  if (raw && typeof raw === "object" && raw.repos && typeof raw.repos === "object") {
    for (const [name, v] of Object.entries(raw.repos)) {
      if (!v || typeof v !== "object") continue;
      repos[name] = { discussions: v.discussions === true, issues: v.issues !== false };
    }
  }
  return { fetchedAt: typeof raw?.fetchedAt === "string" ? raw.fetchedAt : undefined, repos };
}

/** The repositories as GitHub lists them (/orgs/<org>/repos) → the snapshot's repos. */
export function stateFromRepositories(list) {
  const repos = {};
  for (const r of list) repos[r.name] = { discussions: r.has_discussions === true, issues: r.has_issues !== false };
  return repos;
}
