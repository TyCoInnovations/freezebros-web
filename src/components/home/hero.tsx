import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon, ClockIcon, LockIcon, SparkleIcon, TruckIcon } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import { getProduct } from "@/data/products";
import { formatPrice, formatPriceShort } from "@/lib/money";

const stickers = [
  { src: "/images/stickers/strawberry.svg", className: "top-[1%] left-[3%] w-[25%]", tilt: -12, delay: 0 },
  { src: "/images/stickers/bear.svg", className: "top-[3%] right-[4%] w-[22%]", tilt: 12, delay: 1.2 },
  { src: "/images/stickers/mango.svg", className: "top-[42%] -right-[3%] w-[19%]", tilt: 8, delay: 2.1 },
  { src: "/images/stickers/banana.svg", className: "bottom-[20%] -left-[2%] w-[21%]", tilt: -6, delay: 0.6 },
];

function HeroVisual() {
  const featured = getProduct("sour-rainbow-worms");

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[19rem] sm:max-w-[26rem] lg:max-w-[33rem]">
      <div
        aria-hidden="true"
        className="absolute inset-[9%] rounded-full bg-gradient-to-br from-pink via-purple to-ice shadow-[0_40px_80px_-30px_rgb(124_58_237/0.6)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-[15%] rounded-full border-2 border-dashed border-white/50"
      />
      <Image
        src="/images/products/sour-rainbow-worms.svg"
        alt="Colourful freeze dried sour worms"
        fill
        preload
        sizes="(min-width: 1024px) 528px, (min-width: 640px) 416px, 304px"
        className="object-contain p-[14%]"
      />
      {stickers.map((sticker) => (
        <Image
          key={sticker.src}
          src={sticker.src}
          alt=""
          width={240}
          height={240}
          aria-hidden="true"
          className={`absolute h-auto animate-float drop-shadow-sm ${sticker.className}`}
          style={{ rotate: `${sticker.tilt}deg`, animationDelay: `${sticker.delay}s` }}
        />
      ))}

      {featured ? (
        <Link
          href={`/products/${featured.slug}`}
          className="absolute bottom-[6%] left-1/2 flex w-max -translate-x-1/2 items-center gap-3 rounded-2xl bg-white/95 py-2 pr-4 pl-2 shadow-lift ring-1 ring-ink/5 backdrop-blur transition-transform hover:scale-[1.03] sm:bottom-[9%] lg:left-[38%]"
        >
          <span className="rounded-xl bg-sun px-2 py-1 text-[0.65rem] font-bold tracking-wide text-ink uppercase">
            Best seller
          </span>
          <span className="text-left leading-tight">
            <span className="block text-sm font-bold">{featured.name}</span>
            <span className="block text-xs text-ink-soft">{formatPrice(featured.price)}</span>
          </span>
        </Link>
      ) : null}
    </div>
  );
}

export function Hero() {
  const trust = [
    { icon: TruckIcon, text: `Free shipping over ${formatPriceShort(siteConfig.shipping.freeThreshold)}` },
    { icon: LockIcon, text: "Secure checkout" },
    {
      icon: ClockIcon,
      text: `Ships in ${siteConfig.shipping.dispatchDays.min}–${siteConfig.shipping.dispatchDays.max} days`,
    },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Soft background glows, faded out towards the bottom so there's no hard edge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black_45%,transparent_95%)]"
      >
        <div className="absolute -top-48 -right-40 size-[38rem] rounded-full bg-pink/20 blur-3xl" />
        <div className="absolute top-1/4 -left-48 size-[30rem] rounded-full bg-ice/20 blur-3xl" />
      </div>

      <div className="container-page relative grid items-center gap-8 pt-10 pb-14 sm:pt-14 lg:grid-cols-[1.08fr_1fr] lg:gap-4 lg:pt-16 lg:pb-20">
        <div className="text-center lg:text-left">
          <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-ink shadow-card ring-1 ring-ink/5">
            <SparkleIcon size={16} className="text-pink-strong" />
            Real fruit · Classic lollies
          </p>
          <h1 className="mt-5 text-[2.6rem] leading-[1.02] font-bold sm:text-6xl lg:text-[4.4rem]">
            Freeze dried treats with a{" "}
            <span className="text-gradient">seriously big crunch</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ink-soft sm:text-xl lg:mx-0">
            We freeze dry real fruit and classic lollies until they&apos;re light, crispy and bursting
            with flavour. One bite and you&apos;ll get it.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link href="/shop" className="btn btn-primary btn-lg">
              Shop all treats
              <ArrowRightIcon size={20} />
            </Link>
            <Link href="#best-sellers" className="btn btn-outline btn-lg">
              See best sellers
            </Link>
          </div>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-semibold text-ink lg:justify-start">
            {trust.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-full bg-white text-pink-strong shadow-card">
                  <Icon size={16} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}
