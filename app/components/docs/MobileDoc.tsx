import { format, getDictionary, type Locale } from "@/lib/i18n";
import { getRegistryItems } from "@/lib/ui-registry";
import { MobileParityTable } from "./MobileParityTable";

/* /docs/ui/mobile — what exists in React Native and how it differs from the web: the parity of the registry, one row per
   component that runs on mobile. Generated from the registry (`platforms`, `native.differences`): never written here. */
export function MobileDoc({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).docs;
  const x = t.ia.mobile;
  const items = getRegistryItems();
  const rows = items.filter((item) => item.platforms !== "web");
  const both = items.filter((item) => item.platforms === "both").length;
  const native = items.filter((item) => item.platforms === "native").length;
  const web = items.filter((item) => item.platforms === "web").length;
  return (
    <div>
      <p>{x.intro}</p>
      <p className="kz-docs-note">{format(x.count, { both, native, web })}</p>
      <MobileParityTable
        rows={rows.map((item) => ({
          name: item.name,
          title: item.title,
          href: `/${locale}/docs/ui/${item.name}`,
          web: item.platforms === "both",
          differences: item.platforms === "native" ? null : (item.native?.differences ?? []).join(" "),
        }))}
        labels={{ caption: x.caption, component: x.component, web: x.web, mobile: x.mobile, differences: x.differences, yes: x.yes, no: x.no, onlyMobile: x.onlyMobile, same: x.same }}
      />
    </div>
  );
}
