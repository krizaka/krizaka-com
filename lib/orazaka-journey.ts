/* The six steps of an Orazaka request (HowOrazakaWorks) and the modules each one names.
   Words: messages → pages.howOrazakaWorks.steps[i]. Every module id is checked against the generated
   architecture (app/data/architecture.json): a renamed or removed module fails the build instead of
   leaving the story wrong — the same rule as the Orochia journeys (lib/orochia-journeys.ts). */

import { checkModules } from "@/lib/architecture-model";

export const JOURNEY_STEP_MODULES = [
  ["orazaka-web-client", "orazaka-web-admin", "orazaka-mobile-client", "orazaka-cli"],
  ["orazaka-edge", "orazaka-conversation-service"],
  ["krizaka-security", "krizaka-users-service", "orazaka-interceptors"],
  ["orazaka-business", "orazaka-core"],
  ["orazaka-interceptors", "orazaka-job-service", "orazaka-worker-media"],
  ["orazaka-persistence-app", "krizaka-users-persistence"],
] as const;

export function verifiedJourneyModules(): readonly (readonly string[])[] {
  checkModules(JOURNEY_STEP_MODULES.flat(), "the Orazaka request journey (lib/orazaka-journey.ts)");
  return JOURNEY_STEP_MODULES;
}
