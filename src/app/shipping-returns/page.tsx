import type { Metadata } from "next";

import { PolicyPage } from "@/components/ui/policy-page";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";
import { formatPrice, formatPriceShort } from "@/lib/money";

export const metadata: Metadata = pageMetadata({
  title: "Shipping & Returns",
  description: `Freeze Bros ships Australia-wide for a flat ${formatPrice(siteConfig.shipping.flatRate)}, free on orders over ${formatPriceShort(siteConfig.shipping.freeThreshold)}. Read our shipping and returns policy.`,
  path: "/shipping-returns",
});

export default function ShippingReturnsPage() {
  const { shipping, returns, contact } = siteConfig;

  return (
    <PolicyPage
      title="Shipping & returns"
      intro="How we get your treats to you, and what to do if something isn't right."
      path="/shipping-returns"
    >
      <h2>Shipping</h2>
      <ul>
        <li>
          We ship Australia-wide for a flat rate of <strong>{formatPrice(shipping.flatRate)}</strong>.
        </li>
        <li>
          Orders over <strong>{formatPriceShort(shipping.freeThreshold)}</strong> ship free.
        </li>
        <li>
          We pack and send orders within {shipping.dispatchDays.min}–{shipping.dispatchDays.max}{" "}
          business days.
        </li>
        <li>
          Delivery usually takes {shipping.deliveryEstimate.minDays}–
          {shipping.deliveryEstimate.maxDays} business days after dispatch, depending on your
          location.
        </li>
        <li>You&apos;ll get an email with tracking details once your order is on its way.</li>
      </ul>

      <h2>Damaged or incorrect orders</h2>
      <p>
        If your order arrives damaged, or something is missing or wrong, email us at{" "}
        <a href={`mailto:${contact.email}`}>{contact.email}</a> within {returns.days} days of
        delivery. Please include your order reference and a photo. We&apos;ll send a replacement or
        give you a refund.
      </p>

      <h2>Change of mind</h2>
      <p>
        Because our products are food, we can&apos;t accept returns for change of mind. This does not
        affect your rights under the Australian Consumer Law.
      </p>

      <h2>Refunds</h2>
      <p>
        Approved refunds go back to your original payment method. Depending on your bank, they can
        take 5–10 business days to appear.
      </p>
    </PolicyPage>
  );
}
