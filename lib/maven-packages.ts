/* The com.krizaka artifacts published on Maven Central — structure only (ids, coordinates, repositories); their words
   live in messages/<locale>.json under site.maven.items.<id>. Shown on /open-source (#maven). */

export type MavenArtifactId =
  | "bom"
  | "security"
  | "messaging"
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
  /** A BOM is imported, not depended on. */
  bom?: true;
}

export const MAVEN_GROUP_ID = "com.krizaka";

export const MAVEN_ARTIFACTS: readonly MavenArtifact[] = [
  { id: "bom", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-bom", repo: "krizaka-build", dir: "krizaka-bom", bom: true },
  { id: "security", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-security", repo: "krizaka-platform-kit", dir: "krizaka-security" },
  { id: "messaging", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-messaging", repo: "krizaka-platform-kit", dir: "krizaka-messaging" },
  { id: "usersClient", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-users-client", repo: "krizaka-users", dir: "krizaka-users-client" },
  { id: "usersApi", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-users-api", repo: "krizaka-users", dir: "krizaka-users-api" },
  { id: "usersCore", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-users-core", repo: "krizaka-users", dir: "krizaka-users-core" },
  { id: "notificationsApi", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-notifications-api", repo: "krizaka-notifications", dir: "krizaka-notifications-api" },
  { id: "billingClient", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-billing-client", repo: "krizaka-billing", dir: "krizaka-billing-client" },
  { id: "billingApi", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-billing-api", repo: "krizaka-billing", dir: "krizaka-billing-api" },
  { id: "testSupport", groupId: MAVEN_GROUP_ID, artifactId: "krizaka-test-support", repo: "krizaka-build", dir: "krizaka-test-support" },
];

export const centralUrl = (a: MavenArtifact) => `https://central.sonatype.com/artifact/${a.groupId}/${a.artifactId}`;
export const mavenRepoUrl = (a: MavenArtifact) => `https://github.com/krizaka/${a.repo}/tree/main/${a.dir}`;
export const CENTRAL_NAMESPACE_URL = `https://central.sonatype.com/namespace/${MAVEN_GROUP_ID}`;
