/* The com.krizaka artifacts published on Maven Central — structure only (ids, coordinates, repositories); their words
   live in messages/<locale>.json under site.maven.items.<id>. Shown on /open-source (#maven). */

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
  /** The version published on Maven Central. */
  version: string;
  /** A BOM is imported, not depended on. */
  bom?: true;
  /** A starter: a POM that aggregates a module and its auto-configuration. */
  starter?: true;
}

/** The current BOM. It manages the users, notifications and billing modules at its own version, but their 0.2.0 is
    not published yet (November): until then they are declared with their published version, KIT_PREVIOUS_VERSION. */
export const BOM_VERSION = "0.2.0";
export const KIT_PREVIOUS_VERSION = "0.1.0";

export const MAVEN_GROUP_ID = "com.krizaka";

export const MAVEN_ARTIFACTS: readonly MavenArtifact[] = [
  { id: "bom", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-bom", repo: "krizaka-build", dir: "krizaka-bom", version: BOM_VERSION, bom: true },
  { id: "starterWeb", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-spring-boot-starter-web", repo: "krizaka-platform-kit", dir: "starters/krizaka-spring-boot-starter-web", version: BOM_VERSION, starter: true },
  { id: "starterSecurity", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-spring-boot-starter-security", repo: "krizaka-platform-kit", dir: "starters/krizaka-spring-boot-starter-security", version: BOM_VERSION, starter: true },
  { id: "starterRabbitmq", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-spring-boot-starter-rabbitmq", repo: "krizaka-platform-kit", dir: "starters/krizaka-spring-boot-starter-rabbitmq", version: BOM_VERSION, starter: true },
  { id: "starterObservability", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-spring-boot-starter-observability", repo: "krizaka-platform-kit", dir: "starters/krizaka-spring-boot-starter-observability", version: BOM_VERSION, starter: true },
  { id: "web", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-web", repo: "krizaka-platform-kit", dir: "krizaka-web", version: BOM_VERSION },
  { id: "security", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-security", repo: "krizaka-platform-kit", dir: "krizaka-security", version: BOM_VERSION },
  { id: "messaging", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-messaging", repo: "krizaka-platform-kit", dir: "krizaka-messaging", version: BOM_VERSION },
  { id: "observability", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-observability", repo: "krizaka-platform-kit", dir: "krizaka-observability", version: BOM_VERSION },
  { id: "usersClient", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-users-client", repo: "krizaka-users", dir: "krizaka-users-client", version: KIT_PREVIOUS_VERSION },
  { id: "usersApi", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-users-api", repo: "krizaka-users", dir: "krizaka-users-api", version: KIT_PREVIOUS_VERSION },
  { id: "usersCore", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-users-core", repo: "krizaka-users", dir: "krizaka-users-core", version: KIT_PREVIOUS_VERSION },
  { id: "notificationsApi", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-notifications-api", repo: "krizaka-notifications", dir: "krizaka-notifications-api", version: KIT_PREVIOUS_VERSION },
  { id: "billingClient", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-billing-client", repo: "krizaka-billing", dir: "krizaka-billing-client", version: KIT_PREVIOUS_VERSION },
  { id: "billingApi", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-billing-api", repo: "krizaka-billing", dir: "krizaka-billing-api", version: KIT_PREVIOUS_VERSION },
  { id: "testSupport", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-test-support", repo: "krizaka-build", dir: "krizaka-test-support", version: BOM_VERSION },
];

export const centralUrl = (a: MavenArtifact) => `https://central.sonatype.com/artifact/${a.groupId}/${a.artifactId}`;
export const mavenRepoUrl = (a: MavenArtifact) => `https://github.com/krizaka/${a.repo}/tree/main/${a.dir}`;
export const CENTRAL_NAMESPACE_URL = `https://central.sonatype.com/namespace/${MAVEN_GROUP_ID}`;
