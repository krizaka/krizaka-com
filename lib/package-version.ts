import { readFileSync } from "node:fs";
import path from "node:path";

/** The installed version of a @krizaka package (read at build time): what a generated docs page was built from. */
export function packageVersion(name: "fonts" | "tokens" | "icons" | "ui"): string {
  const file = path.join(process.cwd(), "node_modules", "@krizaka", name, "package.json");
  return (JSON.parse(readFileSync(file, "utf8")) as { version: string }).version;
}
