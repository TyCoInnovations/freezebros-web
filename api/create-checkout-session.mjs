/**
 * STRIPE CHECKOUT – creates Stripe's secure payment page for the shopper's cart.
 *
 * This is a small "serverless function". The website itself is plain HTML, but
 * a secret key can never live in the browser, so this file runs on the host
 * (Vercel runs anything in the /api folder automatically).
 *
 * Setup (see README):
 *   1. Add STRIPE_SECRET_KEY in your host's environment variables.
 *   2. Optional: add SITE_URL (e.g. https://www.freezebros.com.au).
 *   3. In js/store-data.js set checkoutEndpoint to "/api/create-checkout-session".
 *
 * No npm packages needed – it talks to Stripe's API directly.
 * Prices are always taken from js/store-data.js, never from the browser.
 */
import storeData from "../js/store-data.js";

const STRIPE_API = "https://api.stripe.com/v1";
const STRIPE_API_VERSION = "2026-10-28.endive";
const MAX_CART_LINES = 50;
const FRIENDLY_ERROR = "We couldn't start checkout just now. Please try again in a moment.";

const { settings, products } = storeData;
const productsBySlug = new Map(products.map((product) => [product.slug, product]));

class CartError extends Error {}

export async function POST(request) {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) {
    return Response.json({ error: "Payments aren't switched on yet." }, { status: 503 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  let items;
  try {
    items = parseCartItems(body);
  } catch (error) {
    if (error instanceof CartError) return Response.json({ error: error.message }, { status: 400 });
    throw error;
  }

  const params = buildSessionParams(items, getSiteOrigin(request));

  try {
    const response = await fetch(`${STRIPE_API}/checkout/sessions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "Stripe-Version": STRIPE_API_VERSION,
      },
      body: toFormBody(params),
    });
    const session = await response.json();

    if (!response.ok || typeof session.url !== "string") {
      console.error("[checkout] Stripe could not create the session:", session?.error ?? session);
      return Response.json({ error: FRIENDLY_ERROR }, { status: 502 });
    }

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("[checkout] Could not reach Stripe:", error);
    return Response.json({ error: FRIENDLY_ERROR }, { status: 502 });
  }
}

/** Checks the cart sent from the browser. Throws a CartError with a friendly message. */
export function parseCartItems(body) {
  const unreadable = "We couldn't read your cart. Please refresh the page and try again.";
  const rawItems = body && typeof body === "object" ? body.items : undefined;
  if (!Array.isArray(rawItems)) throw new CartError(unreadable);
  if (rawItems.length === 0) throw new CartError("Your cart is empty.");
  if (rawItems.length > MAX_CART_LINES) throw new CartError("Your cart has too many different items.");

  const quantities = new Map();
  for (const raw of rawItems) {
    const slug = raw && typeof raw === "object" ? raw.slug : undefined;
    const quantity = raw && typeof raw === "object" ? raw.quantity : undefined;
    if (typeof slug !== "string" || !Number.isInteger(quantity) || quantity < 1) throw new CartError(unreadable);

    const product = productsBySlug.get(slug);
    if (!product) {
      throw new CartError("One of the items in your cart is no longer available. Please remove it and try again.");
    }
    if (!product.inStock) {
      throw new CartError(`Sorry, ${product.name} is sold out. Please remove it from your cart and try again.`);
    }

    const total = (quantities.get(slug) ?? 0) + quantity;
    if (total > settings.maxQuantityPerItem) {
      throw new CartError(`You can buy up to ${settings.maxQuantityPerItem} of each item.`);
    }
    quantities.set(slug, total);
  }

  return [...quantities].map(([slug, quantity]) => ({ slug, quantity }));
}

/** The Checkout Session sent to Stripe. */
export function buildSessionParams(items, origin) {
  const currency = settings.currency.toLowerCase();
  const { shipping } = settings;

  const lineItems = items.map(({ slug, quantity }) => {
    const product = productsBySlug.get(slug);
    // Using prices from the Stripe Dashboard? Add the Price ID to the product in store-data.js.
    if (product.stripePriceId) return { price: product.stripePriceId, quantity };

    // Stripe can show product photos from public JPG/PNG/WebP URLs (not SVG).
    const images =
      origin.startsWith("https://") && /\.(png|jpe?g|webp)$/i.test(product.image)
        ? [new URL(product.image, `${origin}/`).toString()]
        : undefined;

    return {
      quantity,
      price_data: {
        currency,
        unit_amount: product.price,
        product_data: {
          name: `${product.name} (${product.size})`,
          description: product.tagline,
          images,
          metadata: { slug: product.slug, sku: product.sku },
        },
      },
    };
  });

  const subtotal = items.reduce((sum, { slug, quantity }) => sum + productsBySlug.get(slug).price * quantity, 0);
  const shippingCost = subtotal >= shipping.freeThreshold ? 0 : shipping.flatRate;
  const cartSummary = items.map(({ slug, quantity }) => `${slug}:${quantity}`).join(",");

  return {
    mode: "payment",
    line_items: lineItems,
    success_url: `${origin}/checkout-success.html?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cart.html`,
    allow_promotion_codes: true,
    billing_address_collection: "auto",
    shipping_address_collection: { allowed_countries: shipping.countries },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          display_name: shippingCost === 0 ? "Free shipping" : "Standard shipping",
          fixed_amount: { amount: shippingCost, currency },
          // Packing time plus courier time.
          delivery_estimate: {
            minimum: { unit: "business_day", value: shipping.dispatchDays.min + shipping.deliveryDays.min },
            maximum: { unit: "business_day", value: shipping.dispatchDays.max + shipping.deliveryDays.max },
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

/** Where Stripe sends shoppers back to after paying (or cancelling). */
function getSiteOrigin(request) {
  const configured = process.env.SITE_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");
  return new URL(request.url).origin;
}

/** Turns nested params into Stripe's form format, e.g. line_items[0][quantity]=2. */
export function toFormBody(value, prefix = "", form = new URLSearchParams()) {
  if (value === undefined || value === null) return form;
  if (Array.isArray(value)) {
    value.forEach((item, index) => toFormBody(item, `${prefix}[${index}]`, form));
  } else if (typeof value === "object") {
    for (const [key, item] of Object.entries(value)) toFormBody(item, prefix ? `${prefix}[${key}]` : key, form);
  } else {
    form.append(prefix, String(value));
  }
  return form;
}
