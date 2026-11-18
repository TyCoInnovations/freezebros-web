import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { ChevronDownIcon, MailIcon } from "@/components/ui/icons";
import { PageHeader } from "@/components/ui/page-header";
import { allFaqs, faqGroups } from "@/data/faqs";
import { pageMetadata } from "@/lib/metadata";
import { faqJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = pageMetadata({
  title: "FAQ",
  description:
    "Answers to common questions about Freeze Bros freeze dried fruit and lollies: what freeze drying is, how long treats last, shipping, payments and more.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(allFaqs)} />
      <PageHeader
        title="Frequently asked questions"
        intro="Everything you need to know about our treats, orders and shipping."
        breadcrumbs={[{ name: "FAQ", path: "/faq" }]}
      />

      <div className="container-page grid gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-12">
          {faqGroups.map((group) => (
            <section key={group.title} aria-label={group.title}>
              <h2 className="text-2xl font-bold sm:text-3xl">{group.title}</h2>
              <div className="mt-5 space-y-3">
                {group.faqs.map((faq) => (
                  <details
                    key={faq.question}
                    className="group rounded-2xl bg-white shadow-card ring-1 ring-ink/5 open:ring-pink/40"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 text-lg font-semibold sm:px-6 [&::-webkit-details-marker]:hidden">
                      <h3 className="font-sans text-[1.05rem] leading-snug font-semibold">{faq.question}</h3>
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-pink-soft text-pink-deep transition-transform duration-200 group-open:rotate-180">
                        <ChevronDownIcon size={18} />
                      </span>
                    </summary>
                    <p className="px-5 pb-5 leading-relaxed text-ink-soft sm:px-6">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl bg-gradient-to-br from-purple to-pink p-7 text-white shadow-lift">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-white/20">
              <MailIcon size={24} />
            </span>
            <h2 className="mt-4 text-2xl font-bold">Still have a question?</h2>
            <p className="mt-2 text-white/90">We&apos;re real people and we&apos;re happy to help.</p>
            <Link href="/contact" className="btn mt-5 bg-white text-ink hover:bg-cream">
              Contact us
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
