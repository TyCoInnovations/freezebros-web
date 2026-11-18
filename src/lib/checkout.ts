import "server-only";

import type Stripe from "stripe";

import { siteConfig } from "@/config/site";
import { getProduct } from "@/data/products";
import {
  MAX_QUANTITY,
  getShippingCost,
  getSubtotal,
  resolveCart,
  type CartItem,
} from "@/lib/cart";

/** Stripe allows up to 100 line items; we keep well under that. */
export const MAX_CART_LINES = 50;

/** An error with a friendly message that is safe to show to shoppers. */
export class CheckoutRequestError extends Error {
  readonly status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "CheckoutRequestError";
    this.status = status;
  }
}

const UNREADABLE_CART =
  "We couldn't read your cart. Please refresh the page and try again.";

/**
 * Validates the cart sent from the browser. Prices are never taken from the
 * browser - they are always looked up from the product catalogue on the server.
 */
export function parseCheckoutItems(body: unknown): CartItem[] {
  if (!body || typeof body !== "object") {
    throw new CheckoutRequestError(UNREADABLE_CART);
  }

  const rawItems = (body as { items?: unknown }).items;
  if (!Array.isArray(rawItems)) throw new CheckoutRequestError(UNREADABLE_CART);
  if (rawItems.length === 0) throw new CheckoutRequestError("Your cart is empty.");
  if (rawItems.length > MAX_CART_LINES) {
    throw new CheckoutRequestError("Your cart has too many different items.");
  }

  const quantities = new Map<string, number>();

  for (const raw of rawItems) {
    if (!raw || typeof raw !== "object") throw new CheckoutRequestError(UNREADABLE_CART);
    const { slug, quantity } = raw as Record<string, unknown>;

    if (typeof slug !== "string" || typeof quantity !== "number") {
      throw new CheckoutRequestError(UNREADABLE_CART);
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new CheckoutRequestError(UNREADABLE_CART);
    }

    const product = getProduct(slug);
    if (!product) {
      throw new CheckoutRequestError(
        "One of the items in your cart is no longer available. Please remove it and try again.",
      );
    }
    if (!product.inStock) {
      throw new CheckoutRequestError(
        `Sorry, ${product.name} is sold out. Please remove it from your cart and try again.`,
      );
    }

    const total = (quantities.get(slug) ?? 0) + quantity;
    if (total > MAX_QUANTITY) {
      throw new CheckoutRequestError(`You can buy up to ${MAX_QUANTITY} of each item.`);
    }
    quantities.set(slug, total);
  }

  return Array.from(quantities, ([slug, quantity]) => ({ slug, quantity }));
}

/** Stripe can only show product photos from public, non-SVG image URLs. */
function getStripeImages(image: string, origin: string): string[] | undefined {
  if (!origin.startsWith("https://")) return undefined;
  if (!/\.(png|jpe?g|webp)$/i.test(image)) return undefined;
  return [new URL(image, origin).toString()];
}

/** Builds the Stripe Checkout Session for a validated cart. */
export function buildCheckoutSessionParams(
  items: CartItem[],
  origin: string,
): Stripe.Checkout.SessionCreateParams {
  const lines = resolveCart(items);
  const subtotal = getSubtotal(lines);
  const shippingCost = getShippingCost(subtotal);
  const currency = siteConfig.currency.toLowerCase();
  const { dispatchDays, deliveryEstimate } = siteConfig.shipping;

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = lines.map(
    ({ product, quantity }) => {
      // If you manage prices in the Stripe Dashboard, set `stripePriceId` on the product.
      if (product.stripePriceId) {
        return { price: product.stripePriceId, quantity };
      }

      return {
        quantity,
        price_data: {
          currency,
          unit_amount: product.price,
          product_data: {
            name: `${product.name} (${product.size})`,
            description: product.tagline,
            images: getStripeImages(product.image, origin),
            metadata: { slug: product.slug, sku: product.sku },
          },
        },
      };
    },
  );

  // A compact summary of the order (Stripe metadata values max out at 500 characters).
  const cartSummary = items.map((item) => `${item.slug}:${item.quantity}`).join(",");

  return {
    mode: "payment",
    line_items: lineItems,
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cart`,
    allow_promotion_codes: true,
    billing_address_collection: "auto",
    shipping_address_collection: {
      allowed_countries: [...siteConfig.shipping.countries],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          display_name: shippingCost === 0 ? "Free shipping" : "Standard shipping",
          fixed_amount: { amount: shippingCost, currency },
          // Packing time plus courier time.
          delivery_estimate: {
            minimum: { unit: "business_day", value: dispatchDays.min + deliveryEstimate.minDays },
            maximum: { unit: "business_day", value: dispatchDays.max + deliveryEstimate.maxDays },
          },
        },
      },
    ],
    metadata: {
      source: "freezebros-web",
      ...(cartSummary.length <= 500 ? { cart: cartSummary } : {}),
    },
  };
}
