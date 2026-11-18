"use client";

import Link from "next/link";

import { useCart } from "@/components/cart/cart-provider";
import { ProductImage } from "@/components/product/product-image";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import type { CartLine } from "@/lib/cart";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/money";

interface CartLineItemProps {
  line: CartLine;
  /** Called when a link inside the line is clicked (e.g. to close the drawer). */
  onNavigate?: () => void;
  /** Called after the line is removed, so focus can be moved somewhere sensible. */
  onRemoved?: () => void;
  size?: "sm" | "md";
}

export function CartLineItem({ line, onNavigate, onRemoved, size = "sm" }: CartLineItemProps) {
  const { setQuantity, removeItem } = useCart();
  const { product, quantity, total } = line;
  const href = `/products/${product.slug}`;

  return (
    <li className="flex gap-4 py-4">
      <Link
        href={href}
        onClick={onNavigate}
        tabIndex={-1}
        aria-hidden="true"
        className="shrink-0"
      >
        <ProductImage
          product={product}
          sizes={size === "md" ? "112px" : "80px"}
          className={cn("rounded-2xl", size === "md" ? "size-24 sm:size-28" : "size-20")}
          imageClassName="p-1.5"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={href}
              onClick={onNavigate}
              className={cn(
                "font-display font-semibold leading-snug text-ink transition-colors hover:text-pink-strong",
                size === "md" ? "text-lg" : "text-base",
              )}
            >
              {product.name}
            </Link>
            <p className="mt-0.5 text-sm text-ink-soft">
              {product.size} · {formatPrice(product.price)} each
            </p>
          </div>
          <p className="shrink-0 font-bold tabular-nums">{formatPrice(total)}</p>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
          <QuantityStepper
            size="sm"
            value={quantity}
            onChange={(value) => setQuantity(product.slug, value)}
            label={`Quantity for ${product.name}`}
          />
          <button
            type="button"
            onClick={() => {
              removeItem(product.slug);
              onRemoved?.();
            }}
            className="rounded-full px-2 py-1.5 text-sm font-semibold text-ink-soft underline decoration-ink/20 underline-offset-4 transition-colors hover:text-pink-strong hover:decoration-pink-strong"
          >
            Remove<span className="sr-only"> {product.name}</span>
          </button>
        </div>
      </div>
    </li>
  );
}
