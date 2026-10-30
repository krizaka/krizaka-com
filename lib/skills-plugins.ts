/* Krizaka Skills (krizaka/krizaka-skills) — the repository is a Claude Code plugin marketplace (its
   .claude-plugin/marketplace.json): Agent Skills for an assistant, grouped in three plugins. Structure only — the
   marketplace's name, the plugins and their skills, the commands that really install them; the words are messages
   (site.openSource.skills.<plugin>). Nothing is published to a package registry, so no version is shown. */

export const SKILLS_REPO = "krizaka/krizaka-skills";
/** The marketplace's `name` in its marketplace.json — the suffix of every `/plugin install`. */
export const SKILLS_MARKETPLACE = "krizaka-skills";

export interface SkillsPlugin {
  id: "design" | "engineering" | "growth";
  /** The plugin's name in the marketplace. */
  name: string;
  /** The skills it carries (their folder in skills/). */
  skills: readonly string[];
}

export const SKILLS_PLUGINS: readonly SkillsPlugin[] = [
  {
    id: "design",
    name: "krizaka-design",
    skills: ["krizaka-cahier-design", "krizaka-product-design", "krizaka-lab-design"],
  },
  {
    id: "engineering",
    name: "krizaka-engineering",
    skills: ["krizaka-agent-cto", "krizaka-lean-orchestration", "krizaka-context-hygiene", "krizaka-quality-gate"],
  },
  { id: "growth", name: "krizaka-growth", skills: ["krizaka-social-growth"] },
];

/** The two lines to type in Claude Code: add the marketplace, then install one plugin. */
export function skillsInstall(plugin: SkillsPlugin): string {
  return `/plugin marketplace add ${SKILLS_REPO}\n/plugin install ${plugin.name}@${SKILLS_MARKETPLACE}`;
}

/** The skills' own page on GitHub. */
export const skillUrl = (skill: string) => `https://github.com/${SKILLS_REPO}/tree/main/skills/${skill}`;
