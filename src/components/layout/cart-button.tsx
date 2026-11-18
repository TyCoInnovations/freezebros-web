"use client";

import { useCart } from "@/components/cart/cart-provider";
import { BagIcon } from "@/components/ui/icons";

/** Header cart button with a live item count. Opens the cart drawer. */
export function CartButton() {
  const { count, openDrawer } = useCart();

  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-haspopup="dialog"
      className="relative inline-flex h-11 items-center gap-2 rounded-full bg-ink px-4 font-semibold text-white transition-colors hover:bg-pink-strong"
    >
      <BagIcon size={20} />
      {/* "Cart" is visible from small tablets up, and always read by screen readers. */}
      <span className="sr-only sm:not-sr-only">Cart</span>
      {count > 0 ? (
        <>
          <span className="sr-only">
            , {count} {count === 1 ? "item" : "items"}
          </span>
          <span
            key={count}
            aria-hidden="true"
            className="absolute -top-1.5 -right-1.5 flex h-6 min-w-6 animate-pop items-center justify-center rounded-full bg-sun px-1.5 text-xs font-bold text-ink ring-2 ring-cream"
          >
            {count > 99 ? "99+" : count}
          </span>
        </>
      ) : null}
    </button>
  );
}
