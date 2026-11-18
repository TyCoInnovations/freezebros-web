"use client";

import Link from "next/link";
import { useRef } from "react";

import { useCart } from "@/components/cart/cart-provider";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { CartSummary, FreeShippingProgress } from "@/components/cart/cart-summary";
import { ArrowRightIcon, BagIcon } from "@/components/ui/icons";

/** The full cart page: line items on the left, order summary on the right. */
export function CartPageContent({ demoMode }: { demoMode: boolean }) {
  const { lines, count, subtotal, isReady } = useCart();
  const headingRef = useRef<HTMLHeadingElement>(null);

  const heading = (
    <h1 ref={headingRef} tabIndex={-1} className="text-4xl font-bold outline-none sm:text-5xl">
      Your cart
    </h1>
  );

  if (!isReady) {
    return (
      <div aria-busy="true">
        {heading}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_24rem]">
          <div className="h-64 animate-pulse rounded-3xl bg-white/70" />
          <div className="h-72 animate-pulse rounded-3xl bg-white/70" />
        </div>
        <span className="sr-only">Loading your cart…</span>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div>
        {heading}
        <div className="mt-8 flex flex-col items-center rounded-3xl bg-white px-6 py-16 text-center shadow-card">
          <span className="flex size-20 items-center justify-center rounded-full bg-pink-soft text-pink-strong">
            <BagIcon size={36} />
          </span>
          <h2 className="mt-5 text-2xl">Your cart is empty</h2>
          <p className="mt-2 max-w-sm text-ink-soft">
            Looks like you haven&apos;t added anything yet. Find your new favourite crunchy treat.
          </p>
          <Link href="/shop" className="btn btn-primary mt-6">
            Start shopping
            <ArrowRightIcon size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        {heading}
        <p className="text-ink-soft">
          {count} {count === 1 ? "item" : "items"}
        </p>
      </div>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_24rem] lg:gap-8">
        <section aria-label="Items in your cart" className="rounded-3xl bg-white px-4 shadow-card sm:px-6">
          <ul className="divide-y divide-ink/10">
            {lines.map((line) => (
              <CartLineItem
                key={line.product.slug}
                line={line}
                size="md"
                onRemoved={() => headingRef.current?.focus()}
              />
            ))}
          </ul>
        </section>

        <aside
          aria-label="Order summary"
          className="space-y-5 rounded-3xl bg-white p-5 shadow-card sm:p-6 lg:sticky lg:top-24"
        >
          <h2 className="text-2xl">Order summary</h2>
          <FreeShippingProgress subtotal={subtotal} />
          <CartSummary demoMode={demoMode} />
        </aside>
      </div>

      <Link
        href="/shop"
        className="mt-8 inline-flex items-center gap-2 font-semibold text-ink underline decoration-ink/25 underline-offset-4 hover:text-pink-strong"
      >
        <ArrowRightIcon size={18} className="rotate-180" />
        Keep shopping
      </Link>
    </div>
  );
}
