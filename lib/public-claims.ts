/* What a public line never claims (founder, 2026-11-01; krizaka-internal#2807): a licence for a product, a count of
   products in words, that everything (or every repository) is open source. One module for the two places that judge it:
   tests/claims-guard.test.mjs reads what we write, and scripts/gen-changelog.mjs drops a line of the family's live release
   notes that breaks a rule before the public page and its feed are built (krizaka-internal#2880). */

/** A source-available licence, by its id or its name. */
export const LICENCE = /\b(FSL|BSL)\b|Functional Source|Business Source|Source License/i;
/** A product of the company, by its public name. */
export const PRODUCT = /Sovkora|Verikora|Folioviv|Krizaka (?:Entreprise|Enterprise)/i;
/** A count of products in words. */
export const PRODUCT_COUNT =
  /\b(?:three|four|five|six|seven|eight|nine|ten|trois|quatre|cinq|six|sept|huit|neuf|dix)\s+(?:products|produits)\b/i;
/** A licence claim on everything, or on every repository. */
export const OPEN_SOURCE_EVERYTHING =
  /\b(?:all|everything is|every repository is public under|tout(?: est)? en) open[- ]source\b|every repository is public under apache/i;

/** The rules one line breaks, by name (none: the line may be shown). */
export function claimProblems(line: string): string[] {
  return [
    LICENCE.test(line) && PRODUCT.test(line) ? "a licence next to a product" : null,
    PRODUCT_COUNT.test(line) ? "a product count in words" : null,
    OPEN_SOURCE_EVERYTHING.test(line) ? "a licence claim on everything" : null,
  ].filter((p): p is string => p !== null);
}
