"use client";

import {
  createContext,
  use,
  useCallback,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { getProduct, type Product } from "@/data/products";
import {
  MAX_QUANTITY,
  clampQuantity,
  getItemCount,
  getSubtotal,
  resolveCart,
  type CartItem,
  type CartLine,
} from "@/lib/cart";
import { cartStore } from "@/lib/cart-store";

interface CartContextValue {
  items: CartItem[];
  lines: CartLine[];
  /** Total number of items (sum of quantities). */
  count: number;
  /** Subtotal in cents. */
  subtotal: number;
  /** False until the saved cart has been loaded in the browser. */
  isReady: boolean;
  addItem: (slug: string, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  /** The product just added (shown as a confirmation in the cart drawer). */
  lastAdded: Product | null;
  /** The latest message for screen readers, e.g. "Removed Mango Chunks". */
  announcement: string;
}

const CartContext = createContext<CartContextValue | null>(null);

const noopSubscribe = () => () => {};

function itemLabel(count: number) {
  return `${count} ${count === 1 ? "item" : "items"}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot,
  );
  const isReady = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [lastAddedSlug, setLastAddedSlug] = useState<string | null>(null);

  const addItem = useCallback((slug: string, quantity = 1) => {
    const product = getProduct(slug);
    if (!product || !product.inStock) return;

    let added = 0;
    let newCount = 0;
    cartStore.update((current) => {
      const existing = current.find((item) => item.slug === slug);
      const next = existing
        ? current.map((item) =>
            item.slug === slug
              ? { ...item, quantity: clampQuantity(item.quantity + quantity) }
              : item,
          )
        : [...current, { slug, quantity: clampQuantity(quantity) }];
      const before = existing?.quantity ?? 0;
      added = (next.find((item) => item.slug === slug)?.quantity ?? 0) - before;
      newCount = getItemCount(next);
      return next;
    });

    setAnnouncement(
      added > 0
        ? `Added ${added} × ${product.name} to your cart. Your cart has ${itemLabel(newCount)}.`
        : `You already have the maximum of ${MAX_QUANTITY} ${product.name} in your cart.`,
    );
    setLastAddedSlug(slug);
    setDrawerOpen(true);
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    cartStore.update((current) =>
      current.map((item) =>
        item.slug === slug ? { ...item, quantity: clampQuantity(quantity) } : item,
      ),
    );
  }, []);

  const removeItem = useCallback((slug: string) => {
    const product = getProduct(slug);
    cartStore.update((current) => current.filter((item) => item.slug !== slug));
    if (product) setAnnouncement(`Removed ${product.name} from your cart.`);
  }, []);

  const clearCart = useCallback(() => {
    cartStore.update(() => []);
  }, []);

  const openDrawer = useCallback(() => {
    setLastAddedSlug(null);
    setDrawerOpen(true);
  }, []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const lines = resolveCart(items);
    return {
      items,
      lines,
      count: getItemCount(items),
      subtotal: getSubtotal(lines),
      isReady,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      lastAdded: lastAddedSlug ? (getProduct(lastAddedSlug) ?? null) : null,
      announcement,
    };
  }, [
    items,
    isReady,
    addItem,
    setQuantity,
    removeItem,
    clearCart,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    lastAddedSlug,
    announcement,
  ]);

  return (
    <CartContext value={value}>
      {children}
      {/* Announces cart changes to screen reader users. */}
      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </CartContext>
  );
}

export function useCart(): CartContextValue {
  const context = use(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>.");
  return context;
}
