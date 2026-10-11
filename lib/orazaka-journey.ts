/* The six stages of an Orazaka request (HowOrazakaWorks) and the modules each one names — the same journey the module
   map plays (lib/journeys.ts), where every module and link is checked against the generated architecture. */

import { orazakaStageModules } from "@/lib/journeys";

export function verifiedJourneyModules(): readonly (readonly string[])[] {
  return orazakaStageModules();
}
