/**
 * STRIPE WEBHOOK – Stripe calls this when an order is paid.
 *
 * Setup (see README):
 *   1. In the Stripe Dashboard, add a webhook endpoint pointing to
 *      https://YOUR-DOMAIN/api/stripe-webhook with these events:
 *      checkout.session.completed, checkout.session.async_payment_succeeded,
 *      checkout.session.async_payment_failed
 *   2. Add its signing secret (starts with "whsec_") as STRIPE_WEBHOOK_SECRET
 *      in your host's environment variables, next to STRIPE_SECRET_KEY.
 *
 * Every request is checked against Stripe's signature, so it can't be faked.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

const STRIPE_API = "https://api.stripe.com/v1";
const STRIPE_API_VERSION = "2026-10-28.endive";
const SIGNATURE_TOLERANCE_SECONDS = 300;

export async function POST(request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!webhookSecret || !secretKey) {
    return Response.json({ error: "Stripe webhooks are not configured." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return Response.json({ error: "Missing Stripe signature." }, { status: 400 });

  // The raw body is needed to check the signature.
  const payload = await request.text();
  if (!isValidStripeSignature(payload, signature, webhookSecret)) {
    console.warn("[stripe-webhook] Signature check failed.");
    return Response.json({ error: "Invalid signature." }, { status: 400 });
  }

  let event;
  try {
    event = JSON.parse(payload);
  } catch {
    return Response.json({ error: "Invalid payload." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;
        // Card payments are usually "paid" straight away. Some payment methods
        // (e.g. bank debits) confirm later via async_payment_succeeded.
        if (session.payment_status === "paid" || session.payment_status === "no_payment_required") {
          await fulfilOrder(session, secretKey);
        }
        break;
      }
      case "checkout.session.async_payment_failed":
        console.warn(`[stripe-webhook] Payment failed for session ${event.data.object.id}`);
        // TODO: let the customer know their payment didn't go through.
        break;
      default:
        // Other events are ignored. Choose which events Stripe sends in the Dashboard.
        break;
    }
  } catch (error) {
    console.error(`[stripe-webhook] Error handling ${event.type}:`, error);
    // A non-2xx response tells Stripe to try again later.
    return Response.json({ error: "Webhook handler failed." }, { status: 500 });
  }

  return Response.json({ received: true });
}

/**
 * Called once an order has been paid.
 *
 * TODO: connect this to your order workflow, for example:
 *  - email the order to the packing team
 *  - save it to a spreadsheet or database
 *  - update stock levels
 *
 * Stripe can send the same event more than once, so skip sessions you have
 * already processed (use session.id). Every order is also in the Stripe Dashboard.
 */
async function fulfilOrder(session, secretKey) {
  const response = await fetch(
    `${STRIPE_API}/checkout/sessions/${encodeURIComponent(session.id)}/line_items?limit=100`,
    { headers: { Authorization: `Bearer ${secretKey}`, "Stripe-Version": STRIPE_API_VERSION } },
  );
  if (!response.ok) throw new Error(`Stripe returned ${response.status} when loading the order items.`);
  const lineItems = await response.json();

  console.info("[stripe-webhook] New paid order", {
    sessionId: session.id,
    email: session.customer_details?.email,
    total: session.amount_total,
    currency: session.currency,
    items: (lineItems.data ?? []).map((item) => ({ description: item.description, quantity: item.quantity })),
  });
}

/** Checks the Stripe-Signature header (HMAC-SHA256 of "timestamp.payload"). */
export function isValidStripeSignature(payload, header, secret, now = Date.now()) {
  let timestamp = "";
  const signatures = [];
  for (const part of header.split(",")) {
    const separator = part.indexOf("=");
    if (separator === -1) continue;
    const key = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();
    if (key === "t") timestamp = value;
    if (key === "v1") signatures.push(value);
  }

  if (!/^\d+$/.test(timestamp) || signatures.length === 0) return false;
  if (Math.abs(now / 1000 - Number(timestamp)) > SIGNATURE_TOLERANCE_SECONDS) return false;

  const expected = Buffer.from(createHmac("sha256", secret).update(`${timestamp}.${payload}`, "utf8").digest("hex"));
  return signatures.some((signature) => {
    const candidate = Buffer.from(signature);
    return candidate.length === expected.length && timingSafeEqual(candidate, expected);
  });
}
