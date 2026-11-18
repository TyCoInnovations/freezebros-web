import type { Metadata } from "next";

import { CartPageContent } from "@/components/cart/cart-page-content";
import { pageMetadata } from "@/lib/metadata";
import { isStripeConfigured } from "@/lib/stripe";

export const metadata: Metadata = pageMetadata({
  title: "Your cart",
  description: "Review the treats in your Freeze Bros cart and check out securely.",
  path: "/cart",
  index: false,
});

export default function CartPage() {
  return (
    <div className="container-page py-10 sm:py-14">
      <CartPageContent demoMode={!isStripeConfigured()} />
    </div>
  );
}
