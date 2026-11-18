"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { useCart } from "@/components/cart/cart-provider";

type CheckoutState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string };

const GENERIC_ERROR = "Something went wrong starting checkout. Please try again.";
const NETWORK_ERROR = "We couldn't reach checkout. Check your connection and try again.";

/**
 * Sends the cart to /api/checkout and redirects to the page it returns
 * (Stripe's secure payment page, or the demo confirmation page).
 */
export function useCheckout() {
  const { items } = useCart();
  const [state, setState] = useState<CheckoutState>({ status: "idle" });
  const inFlight = useRef(false);

  // If the shopper comes back from Stripe with the browser's back button, the
  // page can be restored from cache with the button still "loading". Reset it.
  useEffect(() => {
    function handlePageShow(event: PageTransitionEvent) {
      if (event.persisted) {
        inFlight.current = false;
        setState({ status: "idle" });
      }
    }
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  // Next.js keeps recently visited pages alive in the background. Reset when
  // this component is hidden so it never comes back stuck mid-checkout.
  useLayoutEffect(() => {
    return () => {
      inFlight.current = false;
      setState({ status: "idle" });
    };
  }, []);

  const startCheckout = useCallback(async () => {
    if (inFlight.current || items.length === 0) return;
    inFlight.current = true;
    setState({ status: "loading" });

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = (await response.json().catch(() => ({}))) as { url?: unknown; error?: unknown };

      if (!response.ok || typeof data.url !== "string") {
        inFlight.current = false;
        setState({
          status: "error",
          message: typeof data.error === "string" ? data.error : GENERIC_ERROR,
        });
        return;
      }

      window.location.assign(data.url);
    } catch {
      inFlight.current = false;
      setState({ status: "error", message: NETWORK_ERROR });
    }
  }, [items]);

  return {
    startCheckout,
    isLoading: state.status === "loading",
    error: state.status === "error" ? state.message : null,
  };
}
