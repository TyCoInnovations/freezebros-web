import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { getStripe, isStripeConfigured } from "@/lib/stripe";

/**
 * POST /api/webhooks/stripe
 *
 * Stripe calls this endpoint when something happens to a payment, e.g. an
 * order is paid. Point a webhook at https://YOUR-DOMAIN/api/webhooks/stripe in
 * the Stripe Dashboard and set STRIPE_WEBHOOK_SECRET (it starts with "whsec_").
 *
 * Every request is verified with Stripe's signature so it can't be faked.
 */
export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!isStripeConfigured() || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhooks are not configured." },
      { status: 503 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  // The raw body is needed to verify the signature, so read it as text.
  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.warn("[stripe-webhook] Signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        // Card payments are usually "paid" straight away. Some payment methods
        // (e.g. bank debits) confirm later via async_payment_succeeded.
        if (session.payment_status === "paid" || session.payment_status === "no_payment_required") {
          await fulfilOrder(session);
        }
        break;
      }
      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.warn(`[stripe-webhook] Payment failed for session ${session.id}`);
        // TODO: Let the customer know their payment didn't go through.
        break;
      }
      default:
        // Other events are ignored. Choose which events Stripe sends in the Dashboard.
        break;
    }
  } catch (error) {
    console.error(`[stripe-webhook] Error handling ${event.type}:`, error);
    // A non-2xx response tells Stripe to retry the event later.
    return NextResponse.json({ error: "Webhook handler failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

/**
 * Called once an order has been paid.
 *
 * TODO: Connect this to your order workflow, for example:
 *  - save the order to a database or spreadsheet
 *  - email the order to the packing team
 *  - update stock levels
 *
 * Stripe may send the same event more than once, so make this idempotent
 * (e.g. skip sessions you have already processed using `session.id`).
 */
async function fulfilOrder(session: Stripe.Checkout.Session) {
  const lineItems = await getStripe().checkout.sessions.listLineItems(session.id, {
    limit: 100,
  });

  console.info("[stripe-webhook] New paid order", {
    sessionId: session.id,
    email: session.customer_details?.email,
    total: session.amount_total,
    currency: session.currency,
    items: lineItems.data.map((item) => ({
      description: item.description,
      quantity: item.quantity,
    })),
  });
}
