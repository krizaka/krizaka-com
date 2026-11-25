/* When the business form of /contact starts open: the page leads with GitHub, the form is folded below for business
   requests, and anything that already says « write to the team » lands on an open form (krizaka-internal#4902). */

import { asksSegment } from "./contact.ts";
import type { ContactPreset } from "./contact-kinds.ts";

/** The anchor of the business block: the sorter's third row, and /services, link to it. */
export const BUSINESS_ANCHOR = "#business";

/** The no-account link: the private fallback is the Support kind, never a hidden field. */
export const SUPPORT_FALLBACK_PRESET: ContactPreset = { kind: "support", product: null };

export interface FoldQuery {
  /** `location.hash`, with its `#` ("" when none). */
  hash: string;
  /** The raw `?topic=`. */
  topic: string | null;
  /** The cleaned `?source=`. */
  source: string | null;
}

/** Whether the form is open on arrival: `#business`, any explicit `topic=`, or the demo source. Else folded. */
export function opensContactFold({ hash, topic, source }: FoldQuery): boolean {
  return hash === BUSINESS_ANCHOR || (topic ?? "") !== "" || asksSegment(source);
}
