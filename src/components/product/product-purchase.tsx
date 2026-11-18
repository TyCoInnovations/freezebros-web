"use client";

import { useState } from "react";

import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";

interface ProductPurchaseProps {
  slug: string;
  productName: string;
  inStock: boolean;
}

/** Quantity picker + "Add to cart" on the product page. */
export function ProductPurchase({ slug, productName, inStock }: ProductPurchaseProps) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {inStock ? (
        <QuantityStepper
          value={quantity}
          onChange={setQuantity}
          label={`Quantity for ${productName}`}
        />
      ) : null}
      <AddToCartButton
        slug={slug}
        productName={productName}
        inStock={inStock}
        quantity={quantity}
        variant="primary"
        size="lg"
        className="min-w-0 flex-1 sm:flex-none sm:px-10"
      />
    </div>
  );
}
