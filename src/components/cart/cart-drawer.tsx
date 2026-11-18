"use client";

import Link from "next/link";
import { useEffect, useId, useRef, type MouseEvent, type PointerEvent } from "react";

import { useCart } from "@/components/cart/cart-provider";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { CartSummary, FreeShippingProgress } from "@/components/cart/cart-summary";
import { BagIcon, CheckIcon, CloseIcon } from "@/components/ui/icons";

/**
 * The slide-out mini cart. Built on the native <dialog> element, which gives us
 * focus trapping, Escape-to-close and a backdrop for free.
 */
export function CartDrawer({ demoMode }: { demoMode: boolean }) {
  const { isDrawerOpen, closeDrawer, lines, count, subtotal, isReady, lastAdded, announcement } =
    useCart();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const pointerDownOnBackdrop = useRef(false);
  const titleId = useId();
  const addedId = useId();

  // Keep the dialog in sync with the cart state.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isDrawerOpen && !dialog.open) dialog.showModal();
    if (!isDrawerOpen && dialog.open) dialog.close();
  }, [isDrawerOpen]);

  // Close when clicking the dimmed backdrop (but not when dragging out of the panel).
  function handlePointerDown(event: PointerEvent<HTMLDialogElement>) {
    pointerDownOnBackdrop.current = event.target === event.currentTarget;
  }
  function handleClick(event: MouseEvent<HTMLDialogElement>) {
    if (pointerDownOnBackdrop.current && event.target === event.currentTarget) closeDrawer();
    pointerDownOnBackdrop.current = false;
  }

  const isEmpty = isReady && lines.length === 0;
  // Only confirm the add while that product is still in the cart.
  const justAdded =
    lastAdded && lines.some((line) => line.product.slug === lastAdded.slug) ? lastAdded : null;

  return (
    <dialog
      ref={dialogRef}
      className="drawer"
      aria-labelledby={titleId}
      aria-describedby={justAdded ? addedId : undefined}
      onClose={closeDrawer}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
    >
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-ink/10 px-5 py-4">
          <h2
            id={titleId}
            ref={headingRef}
            tabIndex={-1}
            className="flex items-center gap-2 text-xl font-semibold outline-none"
          >
            Your cart
            {count > 0 ? (
              <span className="rounded-full bg-pink-soft px-2.5 py-0.5 font-sans text-sm font-bold text-pink-deep">
                {count}
              </span>
            ) : null}
          </h2>
          <button type="button" onClick={closeDrawer} className="icon-btn -mr-2" aria-label="Close cart">
            <CloseIcon size={22} />
          </button>
        </header>

        <p className="sr-only" aria-live="polite">
          {announcement}
        </p>

        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <span className="flex size-20 items-center justify-center rounded-full bg-pink-soft text-pink-strong">
              <BagIcon size={36} />
            </span>
            <div>
              <p className="font-display text-xl font-semibold">Your cart is empty</p>
              <p className="mt-1 text-ink-soft">Let&apos;s fix that. Our treats are waiting!</p>
            </div>
            <Link href="/shop" onClick={closeDrawer} className="btn btn-primary">
              Start shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto overscroll-contain px-5">
              {justAdded ? (
                <p
                  id={addedId}
                  className="mt-4 flex items-center gap-2 rounded-2xl bg-lime-soft px-3.5 py-2.5 text-sm font-semibold"
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#3fb54a] text-white">
                    <CheckIcon size={14} strokeWidth={3} />
                  </span>
                  Added {justAdded.name} to your cart
                </p>
              ) : null}
              <FreeShippingProgress subtotal={subtotal} className="mt-4" />
              <ul className="divide-y divide-ink/10">
                {lines.map((line) => (
                  <CartLineItem
                    key={line.product.slug}
                    line={line}
                    onNavigate={closeDrawer}
                    onRemoved={() => headingRef.current?.focus()}
                  />
                ))}
              </ul>
            </div>

            <footer className="border-t border-ink/10 bg-cream/60 px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <CartSummary demoMode={demoMode} />
              <Link
                href="/cart"
                onClick={closeDrawer}
                className="mt-3 block text-center text-sm font-semibold text-ink underline decoration-ink/25 underline-offset-4 hover:text-pink-strong"
              >
                View full cart
              </Link>
            </footer>
          </>
        )}
      </div>
    </dialog>
  );
}
