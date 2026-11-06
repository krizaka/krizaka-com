"use client";

import { usePathname } from "next/navigation";
import { contactHref, contactSourceFromPath, type ContactKind, type ContactProduct } from "@/lib/contact";

/** The contact link from the page the visitor is on: `/contact?source=<page>` (+ `topic` = the kind and `product` when given). */
export function useContactHref(kind?: ContactKind, product?: ContactProduct): string {
  return contactHref(contactSourceFromPath(usePathname() ?? "/"), kind, product);
}
