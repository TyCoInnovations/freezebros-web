import { normalizeCart, type CartItem } from "@/lib/cart";

/**
 * A tiny browser store for the cart, saved to localStorage so it survives page
 * reloads and stays in sync across open tabs. Components read it through
 * React's useSyncExternalStore (see CartProvider), which keeps server and
 * client renders consistent.
 */

const STORAGE_KEY = "freezebros.cart.v1";
const EMPTY_CART: CartItem[] = [];

let items: CartItem[] = EMPTY_CART;
let loaded = false;
const listeners = new Set<() => void>();

function readFromStorage(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_CART;
    const parsed = normalizeCart(JSON.parse(raw));
    return parsed.length > 0 ? parsed : EMPTY_CART;
  } catch {
    return EMPTY_CART;
  }
}

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  items = readFromStorage();
  loaded = true;
}

function emitChange() {
  for (const listener of listeners) listener();
}

function handleStorage(event: StorageEvent) {
  // Another tab changed the cart (or storage was cleared).
  if (event.key !== null && event.key !== STORAGE_KEY) return;
  items = readFromStorage();
  loaded = true;
  emitChange();
}

export const cartStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    if (listeners.size === 1) window.addEventListener("storage", handleStorage);
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0) window.removeEventListener("storage", handleStorage);
    };
  },

  getSnapshot(): CartItem[] {
    ensureLoaded();
    return items;
  },

  getServerSnapshot(): CartItem[] {
    return EMPTY_CART;
  },

  update(updater: (current: CartItem[]) => CartItem[]) {
    ensureLoaded();
    const next = updater(items);
    items = next.length > 0 ? next : EMPTY_CART;
    try {
      if (items.length > 0) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Storage can be unavailable (e.g. strict privacy modes). The cart still
      // works for this visit, it just won't be saved.
    }
    emitChange();
  },
};
