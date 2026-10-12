"use client";

import { SearchIcon } from "@krizaka/icons";
import { Button } from "@krizaka/ui/button";
import { Kbd } from "@krizaka/ui/kbd";

/** The docs hub's search, front and centre: it opens the site's command palette (SearchCommand, ⌘K). */
export function DocsSearchButton({ label }: { label: string }) {
  return (
    <Button
      type="button"
      variant="secondary"
      size="lg"
      shape="cut"
      aria-keyshortcuts="Meta+K Control+K"
      className="w-full justify-between font-normal text-fg-secondary"
      onClick={() => window.dispatchEvent(new Event("kz:search"))}
    >
      <span className="inline-flex items-center gap-2">
        <SearchIcon size={16} aria-hidden /> {label}
      </span>
      <Kbd>⌘K</Kbd>
    </Button>
  );
}
