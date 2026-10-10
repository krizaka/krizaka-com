/* Orochia's money rules as the product applies them — mirrored from krizaka/orochia (packages/payments:
   PLATFORM_FEE_PERCENTAGE, PAYOUT_MINIMUM_CENTS, splitPlatformFee, auction-rules, challenge-rules), the same figures
   its own home page computes (krizaka/orochia#58). Change them there first, then here. Amounts are US cents. */

export const PLATFORM_FEE_PERCENTAGE = 10;
export const PAYOUT_MINIMUM_CENTS = 20_00;

/** The worked examples of the "get paid" section: the product's suggested amounts; the winning bid is illustrative. */
export const SPLIT_EXAMPLES = [
  { id: "tip", grossCents: 10_00 },
  { id: "unlock", grossCents: 5_00 },
  { id: "pledge", grossCents: 25_00 },
  { id: "bid", grossCents: 40_00 },
] as const;

/** The creator's share of a sale (what `splitPlatformFee` credits to the creator). */
export const creatorNetCents = (grossCents: number) => grossCents - Math.round((grossCents * PLATFORM_FEE_PERCENTAGE) / 100);

const MONEY_LOCALE: Record<string, string> = { en: "en-US", fr: "fr-CA" };

export const formatUsd = (cents: number, locale: string) =>
  new Intl.NumberFormat(MONEY_LOCALE[locale] ?? "en-US", { style: "currency", currency: "USD" }).format(cents / 100);
