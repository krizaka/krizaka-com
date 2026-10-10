"use client";

import { useEffect, type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { Command, CommandDialog } from "@krizaka/ui/command";
import { Kbd } from "@krizaka/ui/kbd";
import { useI18n } from "./I18nProvider";

/* The site search (⌘K): the @krizaka/ui command palette (focus trap, Escape, arrow keys, filter) over the
   site's destinations. The destinations are structure; their words are messages → site.search.items.<id>. */

const SEARCH_TARGETS = [
  { id: "orazaka", url: "/products/orazaka" },
  { id: "orazakaDocs", url: "/docs/orazaka/101" },
  { id: "orazakaDemo", url: "/products/orazaka/demos" },
  { id: "orazakaArch", url: "/products/orazaka/architecture" },
  { id: "orochia", url: "/products/orochia" },
  { id: "orochiaDocs", url: "/products/orochia/docs" },
  { id: "story", url: "/story" },
  { id: "openSource", url: "/open-source" },
  { id: "contact", url: "/contact" },
] as const;

export function SearchCommand({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { t } = useI18n();
  const s = t.site.search;
  const router = useRouter();

  // ⌘K / Ctrl+K opens and closes it from anywhere.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setOpen]);

  const go = (url: string) => {
    setOpen(false);
    router.push(url);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      label={s.label}
      loop
      contentProps={{ size: "md" }}
      footer={
        <div className="flex items-center justify-between gap-3 border-t border-border-subtle px-4 py-2.5 text-[11px] text-fg-muted">
          <span className="inline-flex items-center gap-1.5">
            <Kbd>↵</Kbd> {s.select}
          </span>
          <span className="inline-flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5">
              <Kbd>↑↓</Kbd> {s.navigate}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Kbd>Esc</Kbd> {s.close}
            </span>
          </span>
        </div>
      }
    >
      <Command.Input placeholder={s.placeholder} />
      <Command.List label={s.results} emptyLabel={s.empty}>
        {SEARCH_TARGETS.map(({ id, url }) => {
          const item = s.items[id];
          return (
            <Command.Item
              key={id}
              value={`${item.title} ${id}`}
              keywords={[item.desc, item.category]}
              onSelect={() => go(url)}
              className="flex-col items-start gap-0.5"
            >
              <span className="flex w-full items-center justify-between gap-3">
                <span className="text-[13.5px] font-semibold">{item.title}</span>
                <Command.Shortcut className="uppercase tracking-wide">{item.category}</Command.Shortcut>
              </span>
              <span className="text-[11.5px] text-fg-secondary">{item.desc}</span>
            </Command.Item>
          );
        })}
      </Command.List>
    </CommandDialog>
  );
}
