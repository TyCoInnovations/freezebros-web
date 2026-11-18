"use client";

import { useCart } from "@/components/cart/cart-provider";
import { useCheckout } from "@/components/cart/use-checkout";
import { LockIcon, SpinnerIcon, TruckIcon } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import { getFreeShippingRemaining, getShippingCost } from "@/lib/cart";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/money";

/** "Spend $X more for free shipping" with a progress bar. */
export function FreeShippingProgress({ subtotal, className }: { subtotal: number; className?: string }) {
  const threshold = siteConfig.shipping.freeThreshold;
  const remaining = getFreeShippingRemaining(subtotal);
  const percent = Math.min(100, Math.round((subtotal / threshold) * 100));
  const unlocked = remaining === 0;

  return (
    <div className={cn("rounded-2xl p-3.5", unlocked ? "bg-lime-soft" : "bg-sun-soft", className)}>
      <p className="flex items-center gap-2 text-sm font-semibold text-ink">
        <TruckIcon size={18} className="shrink-0" />
        {unlocked ? (
          <span>Nice! Your order ships free.</span>
        ) : (
          <span>
            Spend <span className="tabular-nums">{formatPrice(remaining)}</span> more for free
            shipping
          </span>
        )}
      </p>
      <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-white/80" aria-hidden="true">
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-500 ease-out",
            unlocked ? "bg-[#3fb54a]" : "bg-gradient-to-r from-pink to-tangerine",
          )}
          style={{ width: `${Math.max(percent, 4)}%` }}
        />
      </div>
    </div>
  );
}

interface CartSummaryProps {
  /** True when Stripe keys are not set yet (no real payment is taken). */
  demoMode: boolean;
  className?: string;
}

/** Order totals plus the checkout button. */
export function CartSummary({ demoMode, className }: CartSummaryProps) {
  const { subtotal, items } = useCart();
  const { startCheckout, isLoading, error } = useCheckout();
  const shipping = getShippingCost(subtotal);
  const total = subtotal + shipping;

  return (
    <div className={cn("space-y-4", className)}>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-ink-soft">Subtotal</dt>
          <dd className="font-semibold tabular-nums">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink-soft">Shipping</dt>
          <dd className="font-semibold tabular-nums">
            {shipping === 0 ? <span className="text-[#23812b]">Free</span> : formatPrice(shipping)}
          </dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-ink/10 pt-3 text-base">
          <dt className="font-bold">Total</dt>
          <dd className="font-display text-xl font-bold tabular-nums">{formatPrice(total)}</dd>
        </div>
      </dl>
      <p className="text-xs text-ink-soft">{siteConfig.taxNote}</p>

      <button
        type="button"
        onClick={startCheckout}
        disabled={isLoading || items.length === 0}
        className="btn btn-primary btn-lg w-full"
      >
        {isLoading ? (
          <>
            <SpinnerIcon size={18} />
            Taking you to checkout…
          </>
        ) : (
          <>
            <LockIcon size={18} />
            Checkout
          </>
        )}
      </button>

      {error ? (
        <p role="alert" className="rounded-xl bg-pink-soft px-3 py-2 text-sm font-medium text-pink-deep">
          {error}
        </p>
      ) : null}

      <p className="flex items-center justify-center gap-1.5 text-xs text-ink-soft">
        <LockIcon size={14} />
        {demoMode ? "Demo store: no payment will be taken" : "Secure checkout powered by Stripe"}
      </p>
    </div>
  );
}
