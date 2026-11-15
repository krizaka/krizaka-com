/* The com.krizaka artifacts published on Maven Central — structure only (ids, coordinates, repositories),
   their existence in the POMs is checked where they live: krizaka-build/site (java.krizaka.com). */

import { mavenVersion } from "./registry-versions";

export type MavenArtifactId =
  | "bom"
  | "web"
  | "security"
  | "messaging"
  | "observability"
  | "starterWeb"
  | "starterSecurity"
  | "starterRabbitmq"
  | "starterObservability"
  | "usersApi"
  | "usersClient"
  | "usersCore"
  | "notificationsApi"
  | "billingApi"
  | "billingClient"
  | "testSupport";

export interface MavenArtifact {
  id: MavenArtifactId;
  groupId: "com.krizaka";
  artifactId: string;
  repo: string;
  /** Path inside the repository: every repository holds several modules. */
  dir: string;
  /** The version published on Maven Central (read at build, lib/registry-versions.ts). */
  version: string;
  /** A BOM is imported, not depended on. */
  bom?: true;
  /** A starter: a POM that aggregates a module and its auto-configuration. */
  starter?: true;
}

/** The released BOM, and the version the users, notifications and billing modules are actually published at — both read
    from Maven Central at build (lib/registry-versions.ts). While the BOM names a version of those modules that is not
    published yet, the page says so and declares them at KIT_PREVIOUS_VERSION. */
export const BOM_VERSION = mavenVersion("krizaka-bom") ?? "";
export const KIT_PREVIOUS_VERSION = mavenVersion("krizaka-users-client") ?? "";

export const MAVEN_GROUP_ID = "com.krizaka";
const v = (artifactId: string) => mavenVersion(artifactId) ?? "";

/** The users service's artefacts live in krizaka-build, under krizaka-users/ (ADR-021), not in the old krizaka-users split. */
export const USERS_SOURCE = { repo: "krizaka-build", folder: "krizaka-users" } as const;

/** One artifact of the group: its folder is its id unless the repository nests it. */
function artifact(
  id: MavenArtifactId,
  artifactId: string,
  repo: string,
  extra: Pick<MavenArtifact, "bom" | "starter"> & { dir?: string } = {},
): MavenArtifact {
  const { dir = artifactId, ...flags } = extra;
  return { id, groupId: MAVEN_GROUP_ID, artifactId, repo, dir, version: v(artifactId), ...flags };
}

const KIT = "krizaka-platform-kit";

const kit = (id: MavenArtifactId, artifactId: string) => artifact(id, artifactId, KIT);
const starter = (id: MavenArtifactId, name: string) => {
  const artifactId = `krizaka-spring-boot-starter-${name}`;
  return artifact(id, artifactId, KIT, { dir: `starters/${artifactId}`, starter: true });
};
const billing = (id: MavenArtifactId, part: "api" | "client") =>
  artifact(id, `krizaka-billing-${part}`, "krizaka-billing");
const usersArtifact = (id: MavenArtifactId, part: "api" | "client" | "core") => {
  const artifactId = `krizaka-users-${part}`;
  return artifact(id, artifactId, USERS_SOURCE.repo, { dir: `${USERS_SOURCE.folder}/${artifactId}` });
};

export const MAVEN_ARTIFACTS: readonly MavenArtifact[] = [
  artifact("bom", "krizaka-bom", "krizaka-build", { bom: true }),
  starter("starterWeb", "web"),
  starter("starterSecurity", "security"),
  starter("starterRabbitmq", "rabbitmq"),
  starter("starterObservability", "observability"),
  kit("web", "krizaka-web"),
  kit("security", "krizaka-security"),
  kit("messaging", "krizaka-messaging"),
  kit("observability", "krizaka-observability"),
  usersArtifact("usersClient", "client"),
  usersArtifact("usersApi", "api"),
  usersArtifact("usersCore", "core"),
  kit("notificationsApi", "krizaka-notifications-api"),
  billing("billingClient", "client"),
  billing("billingApi", "api"),
  artifact("testSupport", "krizaka-test-support", "krizaka-build"),
];

export const centralUrl = (a: MavenArtifact) => `https://central.sonatype.com/artifact/${a.groupId}/${a.artifactId}`;
export const mavenRepoUrl = (a: MavenArtifact) => `https://github.com/krizaka/${a.repo}/tree/main/${a.dir}`;
export const CENTRAL_NAMESPACE_URL = `https://central.sonatype.com/namespace/${MAVEN_GROUP_ID}`;
