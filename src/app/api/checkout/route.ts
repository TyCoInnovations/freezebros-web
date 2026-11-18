import { NextResponse } from "next/server";

import {
  CheckoutRequestError,
  buildCheckoutSessionParams,
  parseCheckoutItems,
} from "@/lib/checkout";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

/**
 * POST /api/checkout
 *
 * Body: { items: [{ slug: "mango-chunks", quantity: 2 }, ...] }
 * Returns: { url } - the page to send the shopper to next.
 *
 * With STRIPE_SECRET_KEY set, this creates a Stripe Checkout Session and returns
 * its hosted payment page. Without it (demo mode) it returns a demo
 * confirmation page so the full shopping flow can be tried out.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  let items;
  try {
    items = parseCheckoutItems(body);
  } catch (error) {
    if (error instanceof CheckoutRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    throw error;
  }

  if (!isStripeConfigured()) {
    return NextResponse.json({
      url: `/checkout/success?demo=${crypto.randomUUID()}`,
      demo: true,
    });
  }

  try {
    const origin = getOrigin(request);
    const session = await getStripe().checkout.sessions.create(
      buildCheckoutSessionParams(items, origin),
    );

    if (!session.url) throw new Error("Stripe did not return a checkout URL.");
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[checkout] Could not create a Stripe Checkout Session:", error);
    return NextResponse.json(
      { error: "We couldn't start checkout just now. Please try again in a moment." },
      { status: 502 },
    );
  }
}

/** Where Stripe should send shoppers back to after paying (or cancelling). */
function getOrigin(request: Request): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");
  return new URL(request.url).origin;
}
