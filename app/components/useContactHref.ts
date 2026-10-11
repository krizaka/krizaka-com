"use client";

import { usePathname } from "next/navigation";
import { contactHref, contactSourceFromPath, type ContactTopic } from "@/lib/contact";

/** The contact link from the page the visitor is on: `/contact?source=<page>` (+ `topic` when given). */
export function useContactHref(topic?: ContactTopic): string {
  return contactHref(contactSourceFromPath(usePathname() ?? "/"), topic);
}
