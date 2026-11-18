import "server-only";

import Stripe from "stripe";

/**
 * Stripe is switched on simply by adding STRIPE_SECRET_KEY to your environment
 * variables. Until then the store runs in "demo mode": checkout skips payment
 * and shows a demo confirmation page instead.
 */
export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY?.trim());
}

let stripeClient: Stripe | null = null;

/** Returns a shared Stripe client. Only call this on the server. */
export function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) {
    throw new Error("Stripe is not configured. Set STRIPE_SECRET_KEY to enable payments.");
  }

  stripeClient ??= new Stripe(secretKey, {
    maxNetworkRetries: 2,
    appInfo: { name: "Freeze Bros Store" },
  });

  return stripeClient;
}
