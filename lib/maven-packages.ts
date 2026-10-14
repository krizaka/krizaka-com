/* The com.krizaka artifacts published on Maven Central — structure only (ids, coordinates, repositories),
   checked against the POMs by the module map (lib/architecture-model.ts). */

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

export const MAVEN_ARTIFACTS: readonly MavenArtifact[] = [
  { id: "bom", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-bom", repo: "krizaka-build", dir: "krizaka-bom", version: v("krizaka-bom"), bom: true },
  { id: "starterWeb", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-spring-boot-starter-web", repo: "krizaka-platform-kit", dir: "starters/krizaka-spring-boot-starter-web", version: v("krizaka-spring-boot-starter-web"), starter: true },
  { id: "starterSecurity", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-spring-boot-starter-security", repo: "krizaka-platform-kit", dir: "starters/krizaka-spring-boot-starter-security", version: v("krizaka-spring-boot-starter-security"), starter: true },
  { id: "starterRabbitmq", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-spring-boot-starter-rabbitmq", repo: "krizaka-platform-kit", dir: "starters/krizaka-spring-boot-starter-rabbitmq", version: v("krizaka-spring-boot-starter-rabbitmq"), starter: true },
  { id: "starterObservability", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-spring-boot-starter-observability", repo: "krizaka-platform-kit", dir: "starters/krizaka-spring-boot-starter-observability", version: v("krizaka-spring-boot-starter-observability"), starter: true },
  { id: "web", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-web", repo: "krizaka-platform-kit", dir: "krizaka-web", version: v("krizaka-web") },
  { id: "security", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-security", repo: "krizaka-platform-kit", dir: "krizaka-security", version: v("krizaka-security") },
  { id: "messaging", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-messaging", repo: "krizaka-platform-kit", dir: "krizaka-messaging", version: v("krizaka-messaging") },
  { id: "observability", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-observability", repo: "krizaka-platform-kit", dir: "krizaka-observability", version: v("krizaka-observability") },
  { id: "usersClient", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-users-client", repo: "krizaka-users", dir: "krizaka-users-client", version: v("krizaka-users-client") },
  { id: "usersApi", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-users-api", repo: "krizaka-users", dir: "krizaka-users-api", version: v("krizaka-users-api") },
  { id: "usersCore", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-users-core", repo: "krizaka-users", dir: "krizaka-users-core", version: v("krizaka-users-core") },
  { id: "notificationsApi", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-notifications-api", repo: "krizaka-notifications", dir: "krizaka-notifications-api", version: v("krizaka-notifications-api") },
  { id: "billingClient", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-billing-client", repo: "krizaka-billing", dir: "krizaka-billing-client", version: v("krizaka-billing-client") },
  { id: "billingApi", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-billing-api", repo: "krizaka-billing", dir: "krizaka-billing-api", version: v("krizaka-billing-api") },
  { id: "testSupport", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-test-support", repo: "krizaka-build", dir: "krizaka-test-support", version: v("krizaka-test-support") },
];

export const centralUrl = (a: MavenArtifact) => `https://central.sonatype.com/artifact/${a.groupId}/${a.artifactId}`;
export const mavenRepoUrl = (a: MavenArtifact) => `https://github.com/krizaka/${a.repo}/tree/main/${a.dir}`;
export const CENTRAL_NAMESPACE_URL = `https://central.sonatype.com/namespace/${MAVEN_GROUP_ID}`;
