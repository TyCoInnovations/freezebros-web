import Link from "next/link";

import { ArrowRightIcon, ClockIcon, CrunchIcon, SmileIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";

const reasons = [
  {
    icon: CrunchIcon,
    title: "Crunchy, not chewy",
    text: "Freeze drying turns soft treats light and crispy. Every bite cracks, then melts in your mouth.",
    className: "bg-pink-soft",
    iconClass: "bg-pink-strong text-white",
  },
  {
    icon: SmileIcon,
    title: "Big, bold flavour",
    text: "Taking the water out leaves all the flavour in. It's the treat you know, turned right up.",
    className: "bg-sun-soft",
    iconClass: "bg-sun text-ink",
  },
  {
    icon: ClockIcon,
    title: "Stays fresh for ages",
    text: "Sealed packs keep for months. Perfect for the pantry, the lunchbox or a long road trip.",
    className: "bg-ice-soft",
    iconClass: "bg-ice text-ink",
  },
];

export function WhyFreezeDried() {
  return (
    <section aria-labelledby="why-heading" className="bg-white py-16 sm:py-24">
      <div className="container-page">
        <SectionHeading
          id="why-heading"
          eyebrow="Why freeze dried?"
          title="Same treats. Totally new crunch."
          align="center"
        />
        <ul className="mt-12 grid gap-5 md:grid-cols-3 lg:gap-6">
          {reasons.map(({ icon: Icon, title, text, className, iconClass }) => (
            <li key={title} className={`rounded-3xl p-7 sm:p-8 ${className}`}>
              <span className={`flex size-14 items-center justify-center rounded-2xl ${iconClass}`}>
                <Icon size={28} />
              </span>
              <h3 className="mt-5 text-2xl font-semibold">{title}</h3>
              <p className="mt-2 text-ink-soft">{text}</p>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-center">
          <Link href="/about" className="text-link inline-flex items-center gap-1.5">
            See how we make them
            <ArrowRightIcon size={18} />
          </Link>
        </p>
      </div>
    </section>
  );
}
