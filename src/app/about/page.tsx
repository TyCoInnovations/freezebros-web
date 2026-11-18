import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/ui/icons";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeading } from "@/components/ui/section-heading";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "About Us",
  description:
    "Meet Freeze Bros. We freeze dry real fruit and classic lollies to give your favourite treats a light, crunchy texture and bigger flavour.",
  path: "/about",
});

const steps = [
  {
    title: "Pick",
    text: "We start with quality fruit and the classic lollies everyone loves.",
    className: "bg-pink-soft",
    numberClass: "bg-pink-strong text-white",
  },
  {
    title: "Freeze",
    text: "Each batch is frozen solid at a very low temperature to lock in the flavour.",
    className: "bg-ice-soft",
    numberClass: "bg-ice text-ink",
  },
  {
    title: "Dry",
    text: "In a vacuum, the ice turns straight into vapour. No frying, no baking.",
    className: "bg-sun-soft",
    numberClass: "bg-sun text-ink",
  },
  {
    title: "Crunch",
    text: "What's left is a light, crispy treat with all of the taste and none of the chew.",
    className: "bg-lime-soft",
    numberClass: "bg-lime text-ink",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="Hi, we're Freeze Bros"
        intro="We make snacking more fun by giving your favourite treats a whole new crunch."
        breadcrumbs={[{ name: "About", path: "/about" }]}
      />

      <section className="container-page grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2">
        <div className="prose-fb max-w-xl">
          <h2>Our story</h2>
          <p>
            Freeze Bros started with a simple question: what happens if you freeze dry a lolly? The
            answer was a puffy, crunchy, flavour-packed treat we couldn&apos;t stop eating.
          </p>
          <p>
            We tried the same with fruit and loved it just as much. Strawberries turned crisp and
            tangy. Mango turned into golden, crunchy bites. So we started sharing them.
          </p>
          <p>
            Today we freeze dry fruit and lollies in small batches and send them right across
            Australia. Our goal is simple: <strong>make every bite fun</strong>.
          </p>
        </div>
        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute inset-[6%] rounded-full bg-gradient-to-br from-sun via-pink to-purple opacity-80 blur-2xl" />
          <Image
            src="/images/categories/lollies.svg"
            alt="Illustration of freeze dried lollies including sour worms, gummy bears and cola bottles"
            width={640}
            height={480}
            className="relative h-auto w-full"
          />
        </div>
      </section>

      <section aria-labelledby="process-heading" className="bg-white py-16 sm:py-24">
        <div className="container-page">
          <SectionHeading
            id="process-heading"
            eyebrow="How we make it"
            title="From soft to super crunchy in four steps"
            align="center"
          />
          <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <li key={step.title} className={`rounded-3xl p-7 ${step.className}`}>
                <span
                  className={`flex size-11 items-center justify-center rounded-full font-display text-lg font-bold ${step.numberClass}`}
                >
                  {index + 1}
                </span>
                <h3 className="mt-4 text-2xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-ink-soft">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <div aria-hidden="true" className="absolute -top-20 -left-20 size-64 rounded-full bg-pink/40 blur-3xl" />
          <div aria-hidden="true" className="absolute -right-20 -bottom-20 size-64 rounded-full bg-ice/40 blur-3xl" />
          <h2 className="relative text-3xl font-bold sm:text-4xl">Ready to try the crunch?</h2>
          <p className="relative mx-auto mt-3 max-w-md text-lg text-white/80">
            Start with a best seller, or build your own mix of fruit and lollies.
          </p>
          <Link href="/shop" className="btn btn-primary btn-lg relative mt-8">
            Shop all treats
            <ArrowRightIcon size={20} />
          </Link>
        </div>
      </section>
    </>
  );
}
