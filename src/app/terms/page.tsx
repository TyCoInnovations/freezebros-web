import type { Metadata } from "next";
import Link from "next/link";

import { PolicyPage } from "@/components/ui/policy-page";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description: "The terms that apply when you shop with Freeze Bros.",
  path: "/terms",
});

export default function TermsPage() {
  const { contact, name } = siteConfig;

  return (
    <PolicyPage
      title="Terms of service"
      intro="The simple rules that apply when you shop with us."
      path="/terms"
    >
      <h2>Using this website</h2>
      <p>
        By using this website and placing an order, you agree to these terms. We may update them
        from time to time, and the version on this page always applies.
      </p>

      <h2>Products and prices</h2>
      <p>
        We do our best to show our products accurately. Colours and shapes can vary slightly
        between batches. {siteConfig.taxNote} Prices can change, but the price shown when you
        place your order is the price you pay.
      </p>

      <h2>Orders and payment</h2>
      <p>
        Your order is confirmed once payment is complete. Payments are processed securely by
        Stripe. If we can&apos;t fill your order for any reason, we&apos;ll let you know and refund
        you in full.
      </p>

      <h2>Shipping and returns</h2>
      <p>
        Please see our <Link href="/shipping-returns">shipping &amp; returns policy</Link> for
        delivery times, damaged items and refunds.
      </p>

      <h2>Allergies</h2>
      <p>
        Always read the ingredients and allergen information on the pack before eating. If you
        have questions about a product, please contact us before ordering.
      </p>

      <h2>Your rights</h2>
      <p>
        Nothing in these terms limits your rights under the Australian Consumer Law.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? Email {name} at{" "}
        <a href={`mailto:${contact.email}`}>{contact.email}</a>.
      </p>
    </PolicyPage>
  );
}
