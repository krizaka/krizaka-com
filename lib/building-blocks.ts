/* The Krizaka building blocks, as /open-source and /open-source/<block> explain them to an engineer who evaluates
   them: structure only — repositories, coordinates, versions, the bird that carries the block's rule, the links to
   the documentation ("how"), to the forum and to the trackers, and the code samples (code is not translated).
   Every word lives in messages/<locale>.json under site.blocks.items.<id>.

   The samples are copied from the published API and checked against the repositories (READMEs, javadoc, tests):
   a sample that no longer compiles against the version shown here is a bug of this page. */

import type { MascotBird, MascotMood } from "@krizaka/ui/mascots";
import { publishedVersion } from "./registry-versions";

/** Every version on this page is read from the registries at build (lib/registry-versions.ts) — none is typed here. */
const ver = (coordinate: string) => publishedVersion(coordinate) ?? "LATEST";
const BOM_V = ver("com.krizaka:krizaka-bom");
/** While the BOM names a version of a kit module that is not published yet, the samples declare the published one and
    say why; once both agree, the note disappears. */
const pinXml = (artifact: string) =>
  ver(artifact) === BOM_V
    ? ""
    : `<!-- BOM ${BOM_V} names an unpublished ${BOM_V} of this block: declare ${ver(artifact)} until it is published -->\n`;
const pinKts = (artifact: string) =>
  ver(artifact) === BOM_V
    ? ""
    : `  // BOM ${BOM_V} names an unpublished ${BOM_V} of this block: declare ${ver(artifact)} until it is published\n`;

export type BlockId =
  | "krizaka-build"
  | "krizaka-platform-kit"
  | "krizaka-users"
  | "krizaka-notifications"
  | "krizaka-billing"
  | "krizaka-ui";

export type BlockIcon = "build" | "shield" | "users" | "notification" | "credits" | "theme";

/** The accent a block wears on its card and its page — one per block, all in the Krizaka palette (blues and ink, never a
    product colour). Defined in app/globals.css (`[data-hue]` → the `--kz-hue` contract of @krizaka/ui blocks), dark and light. */
export type BlockHue = "cobalt" | "sky" | "cyan" | "indigo" | "steel" | "ink";

/** Where questions about a block go: one forum per ecosystem (see site.blocks.forums). */
export type Forum = "java" | "ui";

export const FORUMS: Record<Forum, { repo: string; url: string }> = {
  java: { repo: "krizaka-platform-kit", url: "https://github.com/krizaka/krizaka-platform-kit/discussions" },
  ui: { repo: "krizaka-ui", url: "https://github.com/krizaka/krizaka-ui/discussions" },
};

export interface Sample {
  /** The tab that shows this sample when there are several ways to write it (Maven · Gradle). */
  tab?: string;
  /** File name shown above the code. */
  file: string;
  lang: "java" | "xml" | "yaml" | "tsx" | "css" | "bash" | "kotlin";
  code: string;
}

export interface Release {
  /** What is published, e.g. "com.krizaka:krizaka-bom" or "@krizaka/ui". */
  coordinate: string;
  /** Its version, read from the registry at build (`ver`). */
  version: string;
  url: string;
}

export interface BuildingBlock {
  id: BlockId;
  repo: string;
  /** The bird whose rule explains the block's main decision (@krizaka/ui/mascots: the falcon watches — security). Six
      blocks, five birds: no two blocks wear the same bird in the same mood and hue. */
  bird: MascotBird;
  mood: MascotMood;
  hue: BlockHue;
  icon: BlockIcon;
  registry: "maven" | "npm";
  forum: Forum;
  /** The block's welcome thread in its forum. */
  thread: string;
  /** "How": the documentation of the block — this site's docs, or the repository's README. */
  docs: string;
  /** What is published today (Maven Central, npm). */
  releases: readonly Release[];
  /** Work in progress the page states honestly: keyed like site.blocks.items.<id>.next.<key>. */
  next: readonly { key: string; url: string }[];
  sample: Sample;
  /** How to add it — one sample, or one per build tool (tabs). */
  install: readonly Sample[];
}

const central = (artifact: string) => `https://central.sonatype.com/artifact/com.krizaka/${artifact}`;
const npm = (name: string) => `https://www.npmjs.com/package/${name}`;

export const blockRepoUrl = (b: BuildingBlock) => `https://github.com/krizaka/${b.repo}`;
/** A new idea in the block's forum (category Ideas). */
export const proposeUrl = (b: BuildingBlock) => `${FORUMS[b.forum].url}/new?category=ideas`;
/** A bug report on the block's own repository (the organisation's template). */
export const reportUrl = (b: BuildingBlock) =>
  `https://github.com/krizaka/${b.repo}/issues/new?template=bug_report.yml`;

const BOM = `<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>com.krizaka</groupId>
      <artifactId>krizaka-bom</artifactId>
      <version>${BOM_V}</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>`;

export const BUILDING_BLOCKS: readonly BuildingBlock[] = [
  {
    id: "krizaka-platform-kit",
    repo: "krizaka-platform-kit",
    bird: "falcon",
    mood: "thinking",
    hue: "cobalt",
    icon: "shield",
    registry: "maven",
    forum: "java",
    thread: "https://github.com/krizaka/krizaka-platform-kit/discussions/14",
    docs: "https://java.krizaka.com",
    releases: [
      {
        coordinate: "com.krizaka:krizaka-spring-boot-starter-*",
        version: ver("com.krizaka:krizaka-spring-boot-starter-web"),
        url: central("krizaka-spring-boot-starter-web"),
      },
      {
        coordinate: "com.krizaka:krizaka-web · -security · -messaging · -observability",
        version: ver("com.krizaka:krizaka-messaging"),
        url: central("krizaka-messaging"),
      },
    ],
    next: [
      { key: "processOnce", url: "https://github.com/krizaka/krizaka-platform-kit/pull/12" },
      { key: "keys", url: "https://github.com/krizaka/krizaka-platform-kit/issues/11" },
    ],
    sample: {
      file: "UserService.java · UserEventsListener.java",
      lang: "java",
      code: `@Transactional
public User register(NewUser input) {
  User user = users.save(input);
  // A row of YOUR outbox, in THIS transaction: no event for a rollback, no lost event on a crash.
  events.publish("evt.user.registered", 1, new UserRegistered(user.id(), user.email()));
  return user;
}

@Bean // the quorum queue, its <queue>.dlq, the bindings
Declarables userEvents(MessagingExchanges exchanges) {
  return KrizakaQueues.consumer(exchanges, "krizaka.notifications.user-events", "evt.user.registered");
}

@RabbitListener(queues = "krizaka.notifications.user-events") // 5 retries with back-off, then the DLQ
void onRegistered(UserRegistered event, @Header(AmqpHeaders.MESSAGE_ID) String messageId) {
  if (!dedup.claim("notifications.user-events", messageId)) return; // a redelivery: already done
  try { welcome(event); }
  catch (RuntimeException e) { dedup.release("notifications.user-events", messageId); throw e; }
}`,
    },
    install: [
      {
        tab: "Maven",
        file: "pom.xml",
        lang: "xml",
        code: `${BOM}

<dependencies>
  <dependency><groupId>com.krizaka</groupId><artifactId>krizaka-spring-boot-starter-web</artifactId></dependency>
  <dependency><groupId>com.krizaka</groupId><artifactId>krizaka-spring-boot-starter-security</artifactId></dependency>
  <dependency><groupId>com.krizaka</groupId><artifactId>krizaka-spring-boot-starter-rabbitmq</artifactId></dependency>
  <dependency><groupId>com.krizaka</groupId><artifactId>krizaka-spring-boot-starter-observability</artifactId></dependency>
</dependencies>`,
      },
      {
        tab: "Gradle",
        file: "build.gradle.kts",
        lang: "kotlin",
        code: `dependencies {
  implementation(platform("com.krizaka:krizaka-bom:${BOM_V}"))
  implementation("com.krizaka:krizaka-spring-boot-starter-web")
  implementation("com.krizaka:krizaka-spring-boot-starter-security")
  implementation("com.krizaka:krizaka-spring-boot-starter-rabbitmq")
  implementation("com.krizaka:krizaka-spring-boot-starter-observability")
}`,
      },
    ],
  },
  {
    id: "krizaka-users",
    repo: "krizaka-users",
    bird: "owl",
    mood: "welcome",
    hue: "sky",
    icon: "users",
    registry: "maven",
    forum: "java",
    thread: "https://github.com/krizaka/krizaka-platform-kit/discussions/15",
    docs: "https://github.com/krizaka/krizaka-users#readme",
    releases: [
      {
        coordinate: "com.krizaka:krizaka-users-api · -client · -core",
        version: ver("com.krizaka:krizaka-users-client"),
        url: central("krizaka-users-client"),
      },
    ],
    next: [
      { key: "release", url: "https://github.com/krizaka/krizaka-build/issues/11" },
      { key: "keys", url: "https://github.com/krizaka/krizaka-platform-kit/issues/11" },
    ],
    sample: {
      file: "InvoiceService.java · application.yml",
      lang: "java",
      code: `@Service
class InvoiceService {
  private final UserDirectoryClient users; // SERVICE token on every call, per-entry cache

  InvoiceService(UserDirectoryClient users) { this.users = users; }

  String recipient(String userId) {
    return users.getUser(userId).email();
  }

  String plan(String userId) { // attributes are YOUR onboarding answers, stored as given
    return (String) users.getProfile(userId).attributes().getOrDefault("plan", "free");
  }
}

# application.yml
krizaka.users.client:
  base-url: http://users:8083
  service-secret: \${IDENTITY_JWT_SECRET}
  service-name: billing-service
  cache-ttl: PT60S`,
    },
    install: [
      {
        tab: "Maven",
        file: "pom.xml",
        lang: "xml",
        code: `${pinXml("com.krizaka:krizaka-users-client")}<dependency>
  <groupId>com.krizaka</groupId>
  <artifactId>krizaka-users-client</artifactId>
  <version>${ver("com.krizaka:krizaka-users-client")}</version>
</dependency>`,
      },
      {
        tab: "Gradle",
        file: "build.gradle.kts",
        lang: "kotlin",
        code: `dependencies {
${pinKts("com.krizaka:krizaka-users-client")}  implementation("com.krizaka:krizaka-users-client:${ver("com.krizaka:krizaka-users-client")}")
}`,
      },
    ],
  },
  {
    id: "krizaka-notifications",
    repo: "krizaka-notifications",
    bird: "pigeon",
    mood: "success",
    hue: "cyan",
    icon: "notification",
    registry: "maven",
    forum: "java",
    thread: "https://github.com/krizaka/krizaka-platform-kit/discussions/16",
    docs: "https://github.com/krizaka/krizaka-notifications#readme",
    releases: [
      {
        coordinate: "com.krizaka:krizaka-notifications-api",
        version: ver("com.krizaka:krizaka-notifications-api"),
        url: central("krizaka-notifications-api"),
      },
    ],
    next: [{ key: "release", url: "https://github.com/krizaka/krizaka-build/issues/11" }],
    sample: {
      file: "OrderService.java",
      lang: "java",
      code: `@Transactional
public Order confirm(Order order) {
  Order confirmed = orders.save(order.confirmed());
  // Not an SMTP call: an event in the same transaction. The service renders and delivers it.
  events.publish(NotificationRouting.NOTIFICATION_REQUESTED, 1,
      new NotificationRequest(Channel.EMAIL, confirmed.email(), "order-confirmed", "fr-FR",
          Map.of("order", confirmed.number())));
  return confirmed;
}

// templates/order-confirmed/fr.txt — first line "Subject: …", then {{order}}; "en" is the fallback.
// SMS (Twilio) and WEBHOOK (allow-listed hosts) are the same request with another Channel.`,
    },
    install: [
      {
        tab: "Maven",
        file: "pom.xml",
        lang: "xml",
        code: `<dependency>
  <groupId>com.krizaka</groupId>
  <artifactId>krizaka-notifications-api</artifactId>
  <version>${ver("com.krizaka:krizaka-notifications-api")}</version>
</dependency>
<!-- the service itself: ./mvnw -pl krizaka-notifications-service -am spring-boot:run (port 8097) -->`,
      },
      {
        tab: "Gradle",
        file: "build.gradle.kts",
        lang: "kotlin",
        code: `dependencies {
  implementation("com.krizaka:krizaka-notifications-api:${ver("com.krizaka:krizaka-notifications-api")}")
}
// the service itself: ./mvnw -pl krizaka-notifications-service -am spring-boot:run (port 8097)`,
      },
    ],
  },
  {
    id: "krizaka-billing",
    repo: "krizaka-billing",
    bird: "flamingo",
    mood: "welcome",
    hue: "indigo",
    icon: "credits",
    registry: "maven",
    forum: "java",
    thread: "https://github.com/krizaka/krizaka-platform-kit/discussions/17",
    docs: "https://github.com/krizaka/krizaka-billing#readme",
    releases: [
      {
        coordinate: "com.krizaka:krizaka-billing-api · -client",
        version: ver("com.krizaka:krizaka-billing-client"),
        url: central("krizaka-billing-client"),
      },
    ],
    next: [
      { key: "vocabulary", url: "https://github.com/krizaka/krizaka-billing/issues/7" },
      { key: "release", url: "https://github.com/krizaka/krizaka-build/issues/11" },
    ],
    sample: {
      file: "RenderService.java",
      lang: "java",
      code: `CreditHoldResponse hold = credits.hold(new CreditHoldCommand(
    userId, BillableCapability.IMAGE, "sdxl", requestId, jobId, estimate));
    // InsufficientCreditsException carries what a structured 402 needs

try {
  Render render = renderer.run(job);
  // The ledger prices what was measured, at the price-book version the hold pinned.
  credits.settleMeasured(hold.holdId(), render.consumption(), jobId); // jobId = idempotency key
} catch (RuntimeException failed) {
  credits.release(hold.holdId(), "render failed"); // a failed job is never billed
  throw failed;
}`,
    },
    install: [
      {
        tab: "Maven",
        file: "pom.xml · application.yml",
        lang: "xml",
        code: `<dependency>
  <groupId>com.krizaka</groupId>
  <artifactId>krizaka-billing-client</artifactId>
  <version>${ver("com.krizaka:krizaka-billing-client")}</version>
</dependency>

<!-- krizaka.billing.enabled: false wires a no-op adapter: no call site branches on "is billing on" -->`,
      },
      {
        tab: "Gradle",
        file: "build.gradle.kts",
        lang: "kotlin",
        code: `dependencies {
  implementation("com.krizaka:krizaka-billing-client:${ver("com.krizaka:krizaka-billing-client")}")
}
// krizaka.billing.enabled: false wires a no-op adapter: no call site branches on "is billing on"`,
      },
    ],
  },
  {
    id: "krizaka-build",
    repo: "krizaka-build",
    bird: "duck",
    mood: "thinking",
    hue: "steel",
    icon: "build",
    registry: "maven",
    forum: "java",
    thread: "https://github.com/krizaka/krizaka-platform-kit/discussions/13",
    docs: "https://java.krizaka.com/build/",
    releases: [
      {
        coordinate: "com.krizaka:krizaka-bom · krizaka-parent",
        version: ver("com.krizaka:krizaka-bom"),
        url: central("krizaka-bom"),
      },
      {
        coordinate: "com.krizaka:krizaka-test-support",
        version: ver("com.krizaka:krizaka-test-support"),
        url: central("krizaka-test-support"),
      },
    ],
    next: [{ key: "bom", url: "https://github.com/krizaka/krizaka-build/issues/11" }],
    sample: {
      file: "NotificationRequestContractTest.java",
      lang: "java",
      code: `// krizaka-test-support: the producer proves its event matches the JSON Schema its -api publishes
// (events/evt.notification.requested.v1.json, draft 2020-12). A consumer checks its own copy
// against the same file with assertReadable — no shared DTO jar between services.
class NotificationRequestContractTest extends EventContractTest {

  @Test
  void anEmailRequestConforms() {
    assertConforms(NotificationRouting.NOTIFICATION_REQUESTED, 1,
        new NotificationRequest(Channel.EMAIL, "ada@example.com", "welcome", "fr-FR",
            Map.of("name", "Ada")));
  }
}`,
    },
    install: [
      {
        tab: "Maven",
        file: "pom.xml",
        lang: "xml",
        code: `${BOM}

<dependency>
  <groupId>com.krizaka</groupId>
  <artifactId>krizaka-test-support</artifactId>
  <scope>test</scope>
</dependency>`,
      },
      {
        tab: "Gradle",
        file: "build.gradle.kts",
        lang: "kotlin",
        code: `dependencies {
  testImplementation(platform("com.krizaka:krizaka-bom:${BOM_V}"))
  testImplementation("com.krizaka:krizaka-test-support")
}
// krizaka-parent is a Maven parent POM: a Gradle build takes the BOM and the test kit`,
      },
    ],
  },
  {
    id: "krizaka-ui",
    repo: "krizaka-ui",
    bird: "owl",
    mood: "success",
    hue: "ink",
    icon: "theme",
    registry: "npm",
    forum: "ui",
    thread: "https://github.com/krizaka/krizaka-ui/discussions/55",
    docs: "https://ui.krizaka.com",
    releases: [
      {
        coordinate: "@krizaka/ui · @krizaka/tokens · @krizaka/tailwind",
        version: ver("@krizaka/ui"),
        url: npm("@krizaka/ui"),
      },
      {
        coordinate: "@krizaka/icons · i18n · intl · config",
        version: ver("@krizaka/icons"),
        url: npm("@krizaka/icons"),
      },
    ],
    next: [{ key: "charts", url: "https://github.com/krizaka/krizaka-ui/issues/49" }],
    sample: {
      file: "app/globals.css · Save.tsx",
      lang: "tsx",
      code: `/* globals.css — your brand is values, never components */
@import "tailwindcss";
@import "@krizaka/tailwind";        /* tokens + utilities + motion signature */
@import "@krizaka/ui/tailwind.css";
:root      { --kz-accent: hsl(152 62% 40%); }   /* dark is the default */
html.light { --kz-accent: hsl(152 70% 30%); }

// Save.tsx — one entry point per primitive: an app ships only what it imports
import { Button } from "@krizaka/ui/button";

export function Save({ label }: { label: string }) { // words arrive as props: any i18n works
  return <Button variant="primary">{label}</Button>;
}`,
    },
    install: [
      {
        file: "terminal",
        lang: "bash",
        code: `npm install @krizaka/ui @krizaka/tailwind @krizaka/tokens tailwindcss
# the debt counters of an existing app (raw palette, light:, [var(--…)], className templates):
npx -p @krizaka/config krizaka-ratchet --json --root .`,
      },
    ],
  },
];

export const blockById = (id: string) => BUILDING_BLOCKS.find((b) => b.id === id);
