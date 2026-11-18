import { siteConfig } from "@/config/site";

const formatter = new Intl.NumberFormat(siteConfig.locale, {
  style: "currency",
  currency: siteConfig.currency,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Formats a price in cents, e.g. 995 -> "$9.95". */
export function formatPrice(cents: number): string {
  return formatter.format(cents / 100);
}

/** Formats a price in cents as a plain decimal string, e.g. 995 -> "9.95". */
export function toDecimalString(cents: number): string {
  return (cents / 100).toFixed(2);
}

const wholeDollarFormatter = new Intl.NumberFormat(siteConfig.locale, {
  style: "currency",
  currency: siteConfig.currency,
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Like formatPrice, but drops ".00" from whole-dollar amounts, e.g. 6000 -> "$60".
 * Used in marketing copy such as "Free shipping over $60".
 */
export function formatPriceShort(cents: number): string {
  return cents % 100 === 0 ? wholeDollarFormatter.format(cents / 100) : formatPrice(cents);
}
