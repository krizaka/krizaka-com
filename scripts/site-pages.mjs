/* The browser loop every check of the rendered site shares (check-overflow, check-motion, check-figures,
   check-home-stack): Playwright's Chromium, one context per case — the theme persisted before the first paint
   (`kz-theme`), the intro skipped (`kz-intro`) — the page loaded, then the check's own visit. The rule of each check
   stays in its own lib (overflow-lib, motion-lib, figures-lib, home-stack-lib), tested on its own. */

/** The site to check: `--base http://localhost:3000` (the default), without a trailing slash. */
export function baseFromArgv(argv = process.argv) {
  const i = argv.indexOf("--base");
  return (i > 0 ? argv[i + 1] : "http://localhost:3000").replace(/\/$/, "");
}

/**
 * Visits every case in its own browser context and collects what `visit(page, c)` returns (that page's problems, an
 * array). `viewport(c)` and `reducedMotion(c)` shape the context per case: a 900 px tall viewport of the case's width,
 * and reduced motion on, unless the check says otherwise.
 */
export async function visitPages(base, cases, visit, { viewport = (c) => ({ width: c.width, height: 900 }), reducedMotion = () => "reduce" } = {}) {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch();
  const problems = [];
  try {
    for (const c of cases) {
      const context = await browser.newContext({ viewport: viewport(c), colorScheme: c.theme, reducedMotion: reducedMotion(c) });
      await context.addInitScript((theme) => {
        try {
          localStorage.setItem("kz-theme", theme);
          sessionStorage.setItem("kz-intro", "done");
        } catch {}
      }, c.theme);
      const page = await context.newPage();
      // `load`, then the check's own settle: a live page may never go network-idle (the contact page's captcha keeps polling).
      await page.goto(base + c.path, { waitUntil: "load", timeout: 60_000 });
      problems.push(...(await visit(page, c)));
      await context.close();
    }
  } finally {
    await browser.close();
  }
  return problems;
}

/** One line per problem on stderr and exit 1; else the check's one-line summary. */
export function report(problems, summary) {
  if (problems.length) {
    console.error(problems.join("\n"));
    process.exit(1);
  }
  console.log(summary);
}
