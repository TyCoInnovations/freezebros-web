import type { Metadata } from "next";

import { PolicyPage } from "@/components/ui/policy-page";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Freeze Bros collects, uses and protects your personal information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  const { contact, name } = siteConfig;

  return (
    <PolicyPage
      title="Privacy policy"
      intro="We only collect what we need to get your treats to you, and we never sell your details."
      path="/privacy"
    >
      <h2>What we collect</h2>
      <p>When you place an order, we collect:</p>
      <ul>
        <li>your name, email address and phone number (if you provide it)</li>
        <li>your shipping and billing address</li>
        <li>the details of your order</li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>to process, pack and deliver your order</li>
        <li>to send you order updates and answer your questions</li>
        <li>to meet our legal and tax obligations</li>
      </ul>

      <h2>Payments</h2>
      <p>
        Payments are processed securely by Stripe. {name} never sees or stores your full card
        details. You can read how Stripe handles your data in{" "}
        <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">
          Stripe&apos;s privacy policy
        </a>
        .
      </p>

      <h2>Cookies and storage</h2>
      <p>
        We save the contents of your cart in your browser so it&apos;s still there when you come
        back. We don&apos;t use advertising or tracking cookies.
      </p>

      <h2>Sharing your information</h2>
      <p>
        We only share your details with the services needed to fulfil your order, such as our
        payment provider and delivery partners. We never sell your information.
      </p>

      <h2>Your choices</h2>
      <p>
        You can ask to see, correct or delete the personal information we hold about you at any
        time. Email us at <a href={`mailto:${contact.email}`}>{contact.email}</a>.
      </p>
    </PolicyPage>
  );
}
