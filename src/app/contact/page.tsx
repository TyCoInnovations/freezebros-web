import type { Metadata } from "next";
import Link from "next/link";

import { ClockIcon, GiftIcon, MailIcon, TruckIcon } from "@/components/ui/icons";
import { PageHeader } from "@/components/ui/page-header";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Get in touch with Freeze Bros. Questions about an order, our freeze dried treats, wholesale or events? We're happy to help.",
  path: "/contact",
});

export default function ContactPage() {
  const { contact } = siteConfig;

  return (
    <>
      <PageHeader
        title="Get in touch"
        intro="Questions about an order or our treats? Send us a message and a real person will get back to you."
        breadcrumbs={[{ name: "Contact", path: "/contact" }]}
      />

      <div className="container-page py-12 sm:py-16">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <section className="rounded-[2rem] bg-white p-7 shadow-card sm:p-10">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-pink-strong text-white">
              <MailIcon size={28} />
            </span>
            <h2 className="mt-5 text-3xl font-bold">Email us</h2>
            <p className="mt-2 text-lg text-ink-soft">
              The quickest way to reach us. Include your order reference if your question is about
              an order.
            </p>
            <a
              href={`mailto:${contact.email}`}
              className="btn btn-primary btn-lg mt-6 max-w-full whitespace-normal break-all"
            >
              {contact.email}
            </a>
            <p className="mt-5 flex items-center gap-2 text-sm font-medium text-ink-soft">
              <ClockIcon size={16} />
              We usually reply {contact.responseTime}.
            </p>
          </section>

          <div className="grid gap-6">
            <section className="rounded-[2rem] bg-sun-soft p-7">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-sun text-ink">
                <TruckIcon size={24} />
              </span>
              <h2 className="mt-4 text-2xl font-bold">Order help</h2>
              <p className="mt-2 text-ink-soft">
                Shipping times, damaged items and more are covered on our{" "}
                <Link href="/shipping-returns" className="text-link">
                  shipping &amp; returns
                </Link>{" "}
                page and in our{" "}
                <Link href="/faq" className="text-link">
                  FAQ
                </Link>
                .
              </p>
            </section>
            <section className="rounded-[2rem] bg-purple-soft p-7">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-purple text-white">
                <GiftIcon size={24} />
              </span>
              <h2 className="mt-4 text-2xl font-bold">Wholesale &amp; events</h2>
              <p className="mt-2 text-ink-soft">
                Want to stock Freeze Bros, or need treats for a party, wedding or corporate event?
                Email us and we&apos;ll put together a quote.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
