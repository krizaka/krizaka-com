/* The entry guard every script shares: run `main(argv)` when the file is the one node was started with, exit with its
   code, and report an uncaught error as `<name>: <message>` (exit 1). */

import { pathToFileURL } from "node:url";

export async function runAsMain(metaUrl, name, main, argv = process.argv.slice(2)) {
  if (metaUrl !== pathToFileURL(process.argv[1] ?? "").href) {
    return;
  }
  try {
    process.exit(await main(argv));
  } catch (err) {
    console.error(`${name}: ${err.message}`);
    process.exit(1);
  }
}
