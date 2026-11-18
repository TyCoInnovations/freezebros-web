"use client";

import { useRef, useState } from "react";

import { useCart } from "@/components/cart/cart-provider";
import { CheckIcon, PlusIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

interface AddToCartButtonProps {
  slug: string;
  productName: string;
  inStock: boolean;
  quantity?: number;
  variant?: "primary" | "dark";
  size?: "sm" | "md" | "lg";
  /** Hide the icon on very narrow screens (used on product cards). */
  compact?: boolean;
  className?: string;
}

export function AddToCartButton({
  slug,
  productName,
  inStock,
  quantity = 1,
  variant = "dark",
  size = "md",
  compact = false,
  className,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const iconClass = compact ? "max-[400px]:hidden" : undefined;
  const [justAdded, setJustAdded] = useState(false);
  // The timer always runs to completion, so the button can never get stuck on "Added".
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function handleClick() {
    addItem(slug, quantity);
    setJustAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setJustAdded(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!inStock}
      className={cn(
        "btn",
        variant === "primary" ? "btn-primary" : "btn-dark",
        size === "sm" && "btn-sm",
        size === "lg" && "btn-lg",
        className,
      )}
    >
      {!inStock ? (
        <>
          Sold out<span className="sr-only">: {productName}</span>
        </>
      ) : justAdded ? (
        <>
          <CheckIcon size={18} strokeWidth={2.5} className={iconClass} />
          Added<span className="sr-only">: {productName}</span>
        </>
      ) : (
        <>
          <PlusIcon size={18} strokeWidth={2.5} className={iconClass} />
          Add to cart<span className="sr-only">: {productName}</span>
        </>
      )}
    </button>
  );
}
