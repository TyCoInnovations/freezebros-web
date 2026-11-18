import { siteConfig } from "@/config/site";
import { getProduct, type Product } from "@/data/products";

/** What we store for each cart line: just the product and how many. */
export interface CartItem {
  slug: string;
  quantity: number;
}

/** A cart line joined with its product details. */
export interface CartLine {
  product: Product;
  quantity: number;
  /** Line total in cents. */
  total: number;
}

export const MAX_QUANTITY = siteConfig.maxQuantityPerItem;

/** Keeps a quantity between 1 and the maximum allowed. */
export function clampQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return 1;
  return Math.min(MAX_QUANTITY, Math.max(1, Math.floor(quantity)));
}

/**
 * Turns untrusted data (from localStorage or a request body) into a clean cart:
 * unknown products are dropped, duplicates are merged and quantities clamped.
 */
export function normalizeCart(input: unknown): CartItem[] {
  if (!Array.isArray(input)) return [];

  const quantities = new Map<string, number>();
  for (const entry of input) {
    if (!entry || typeof entry !== "object") continue;
    const { slug, quantity } = entry as Record<string, unknown>;
    if (typeof slug !== "string" || typeof quantity !== "number") continue;
    if (!Number.isFinite(quantity) || quantity < 1) continue;
    const product = getProduct(slug);
    if (!product) continue;
    quantities.set(slug, clampQuantity((quantities.get(slug) ?? 0) + quantity));
  }

  return Array.from(quantities, ([slug, quantity]) => ({ slug, quantity }));
}

export function resolveCart(items: readonly CartItem[]): CartLine[] {
  const lines: CartLine[] = [];
  for (const item of items) {
    const product = getProduct(item.slug);
    if (!product) continue;
    lines.push({ product, quantity: item.quantity, total: product.price * item.quantity });
  }
  return lines;
}

export function getItemCount(items: readonly CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getSubtotal(lines: readonly CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.total, 0);
}

/** Shipping cost in cents for a given subtotal. */
export function getShippingCost(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= siteConfig.shipping.freeThreshold ? 0 : siteConfig.shipping.flatRate;
}

/** How much more (in cents) needs to be spent to unlock free shipping. */
export function getFreeShippingRemaining(subtotal: number): number {
  return Math.max(0, siteConfig.shipping.freeThreshold - subtotal);
}
