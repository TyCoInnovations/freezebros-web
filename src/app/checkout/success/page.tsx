import type { Metadata } from "next";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import type Stripe from "stripe";

import { ClearCartOnSuccess } from "@/components/cart/clear-cart-on-success";
import { ArrowRightIcon, CheckIcon, ClockIcon, MailIcon } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";
import { formatPrice } from "@/lib/money";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export const metadata: Metadata = pageMetadata({
  title: "Order confirmed",
  description: "Thanks for shopping with Freeze Bros.",
  path: "/checkout/success",
  index: false,
});

const SESSION_ID_PATTERN = /^cs_(test|live)_[A-Za-z0-9]+$/;

/**
 * Looks up a Checkout Session with Stripe. Next.js can render this page more
 * than once per request, so a lookup is shared for a few seconds to avoid
 * asking Stripe twice for the same session.
 */
const LOOKUP_TTL_MS = 10_000;
const recentLookups = new Map<
  string,
  { startedAt: number; result: Promise<Stripe.Checkout.Session | null> }
>();

function getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session | null> {
  const now = performance.now();
  for (const [id, entry] of recentLookups) {
    if (now - entry.startedAt > LOOKUP_TTL_MS) recentLookups.delete(id);
  }

  const existing = recentLookups.get(sessionId);
  if (existing) return existing.result;

  const result = getStripe()
    .checkout.sessions.retrieve(sessionId, { expand: ["line_items"] })
    .catch((error: unknown) => {
      console.error("[checkout-success] Could not load checkout session:", error);
      return null;
    });
  recentLookups.set(sessionId, { startedAt: now, result });
  return result;
}

const DEMO_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function StatusCard({
  tone,
  icon,
  title,
  children,
}: {
  tone: "success" | "info";
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl rounded-[2rem] bg-white p-7 text-center shadow-card sm:p-12">
      <span
        className={`mx-auto flex size-20 items-center justify-center rounded-full text-white shadow-lift ${
          tone === "success" ? "bg-gradient-to-br from-pink to-purple" : "bg-gradient-to-br from-ice to-purple"
        }`}
      >
        {icon}
      </span>
      <h1 className="mt-6 text-4xl font-bold sm:text-5xl">{title}</h1>
      <div className="mt-4 space-y-4 text-lg text-ink-soft">{children}</div>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/shop" className="btn btn-primary">
          Keep shopping
          <ArrowRightIcon size={18} />
        </Link>
        <Link href="/contact" className="btn btn-outline">
          Contact us
        </Link>
      </div>
    </div>
  );
}

function OrderSummary({ session }: { session: Stripe.Checkout.Session }) {
  const items = session.line_items?.data ?? [];
  if (items.length === 0 || session.amount_total === null) return null;
  const currency = (session.currency ?? siteConfig.currency).toUpperCase();

  return (
    <div className="mt-6 rounded-2xl bg-cream p-5 text-left text-base">
      <h2 className="font-display text-lg font-semibold text-ink">Order summary</h2>
      <ul className="mt-3 divide-y divide-ink/10">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between gap-4 py-2.5">
            <span>
              {item.description} <span className="text-ink-soft">× {item.quantity}</span>
            </span>
            <span className="font-semibold tabular-nums">{formatPrice(item.amount_total)}</span>
          </li>
        ))}
      </ul>
      {session.total_details?.amount_shipping ? (
        <p className="flex justify-between border-t border-ink/10 pt-2.5">
          <span>Shipping</span>
          <span className="font-semibold tabular-nums">
            {formatPrice(session.total_details.amount_shipping)}
          </span>
        </p>
      ) : null}
      <p className="mt-2 flex justify-between border-t border-ink/10 pt-3 font-bold text-ink">
        <span>Total ({currency})</span>
        <span className="tabular-nums">{formatPrice(session.amount_total)}</span>
      </p>
    </div>
  );
}

async function OrderStatus({ searchParams }: Pick<PageProps<"/checkout/success">, "searchParams">) {
  const params = await searchParams;
  const sessionId = typeof params.session_id === "string" ? params.session_id : undefined;
  const demoId = typeof params.demo === "string" ? params.demo : undefined;

  // Real orders: look the checkout session up with Stripe.
  if (sessionId && SESSION_ID_PATTERN.test(sessionId) && isStripeConfigured()) {
    const session = await getCheckoutSession(sessionId);

    if (session?.status === "complete") {
      const email = session.customer_details?.email;
      const paid = session.payment_status !== "unpaid";
      return (
        <>
          <ClearCartOnSuccess orderId={session.id} />
          <StatusCard
            tone="success"
            icon={<CheckIcon size={40} strokeWidth={3} />}
            title={paid ? "Thanks for your order!" : "Order received!"}
          >
            <p>
              {paid
                ? "Your payment went through and we're getting your treats ready."
                : "We're just waiting for your payment to clear. We'll start packing as soon as it does."}
            </p>
            {email ? (
              <p className="flex items-center justify-center gap-2 text-base">
                <MailIcon size={18} />
                A confirmation will be sent to <strong className="text-ink">{email}</strong>
              </p>
            ) : null}
            <p className="text-sm">
              Order reference: <strong className="text-ink">{session.id.slice(-8).toUpperCase()}</strong>
            </p>
            <OrderSummary session={session} />
          </StatusCard>
        </>
      );
    }

    if (session?.status === "open") {
      return (
        <StatusCard tone="info" icon={<ClockIcon size={40} />} title="Payment not finished">
          <p>It looks like checkout wasn&apos;t completed. Your cart is still saved.</p>
          <p>
            <Link href="/cart" className="text-link">
              Return to your cart
            </Link>
          </p>
        </StatusCard>
      );
    }
  }

  // Demo mode: Stripe isn't connected yet, so no payment was taken.
  if (demoId && DEMO_ID_PATTERN.test(demoId) && !isStripeConfigured()) {
    return (
      <>
        <ClearCartOnSuccess orderId={`demo-${demoId}`} />
        <StatusCard tone="success" icon={<CheckIcon size={40} strokeWidth={3} />} title="Order placed!">
          <p>Thanks for trying the Freeze Bros store.</p>
          <p className="rounded-2xl bg-sun-soft px-4 py-3 text-base text-ink">
            <strong>Demo mode:</strong> payments aren&apos;t switched on yet, so no money was taken
            and no order was sent.
          </p>
        </StatusCard>
      </>
    );
  }

  return (
    <StatusCard tone="info" icon={<ClockIcon size={40} />} title="We couldn't find that order">
      <p>
        If you&apos;ve just paid, check your email for a confirmation. Still stuck? Contact us at{" "}
        <a href={`mailto:${siteConfig.contact.email}`} className="text-link">
          {siteConfig.contact.email}
        </a>{" "}
        and we&apos;ll sort it out.
      </p>
    </StatusCard>
  );
}

function StatusSkeleton() {
  return (
    <div
      aria-busy="true"
      className="mx-auto h-[28rem] max-w-2xl animate-pulse rounded-[2rem] bg-white/80"
    >
      <span className="sr-only">Loading your order…</span>
    </div>
  );
}

export default function CheckoutSuccessPage({ searchParams }: PageProps<"/checkout/success">) {
  return (
    <div className="container-page py-12 sm:py-20">
      <Suspense fallback={<StatusSkeleton />}>
        <OrderStatus searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
