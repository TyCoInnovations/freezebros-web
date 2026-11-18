"use client";

import { useEffect } from "react";

import { useCart } from "@/components/cart/cart-provider";

const STORAGE_KEY = "freezebros.completed-orders";

/**
 * Empties the cart once an order is confirmed. Each order is only processed
 * once, so revisiting the confirmation page (e.g. with the back button) never
 * wipes a new cart.
 */
export function ClearCartOnSuccess({ orderId }: { orderId: string }) {
  const { clearCart } = useCart();

  useEffect(() => {
    let completed: string[] = [];
    try {
      const saved: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
      if (Array.isArray(saved)) completed = saved.filter((id) => typeof id === "string");
    } catch {
      // Ignore unreadable storage and carry on.
    }

    if (completed.includes(orderId)) return;

    clearCart();
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed, orderId].slice(-20)));
    } catch {
      // Storage unavailable - the cart has still been cleared for this visit.
    }
  }, [orderId, clearCart]);

  return null;
}
