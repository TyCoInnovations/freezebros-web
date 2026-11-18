import type { Metadata } from "next";
import Link from "next/link";

import { CategoryTiles } from "@/components/home/category-tiles";
import { Hero } from "@/components/home/hero";
import { Marquee } from "@/components/home/marquee";
import { WhyFreezeDried } from "@/components/home/why-freeze-dried";
import { ProductGrid } from "@/components/product/product-grid";
import { ArrowRightIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";
import { getFeaturedProducts } from "@/data/products";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: `${siteConfig.name} | Freeze Dried Fruit & Lollies`,
  absoluteTitle: true,
  description: siteConfig.description,
  path: "/",
});

export default function HomePage() {
  const bestSellers = getFeaturedProducts(4);

  return (
    <>
      <Hero />
      <Marquee />
      <CategoryTiles />

      <section
        id="best-sellers"
        aria-labelledby="best-sellers-heading"
        className="container-page pb-16 sm:pb-24"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            id="best-sellers-heading"
            eyebrow="Customer favourites"
            title="Best sellers"
            description="The crunchy treats everyone keeps coming back for."
          />
          <Link href="/shop" className="btn btn-outline btn-sm hidden sm:inline-flex">
            Shop all treats
            <ArrowRightIcon size={16} />
          </Link>
        </div>
        <ProductGrid products={bestSellers} className="mt-8 sm:mt-10" />
        <Link href="/shop" className="btn btn-outline mt-6 w-full sm:hidden">
          Shop all treats
          <ArrowRightIcon size={16} />
        </Link>
      </section>

      <WhyFreezeDried />
    </>
  );
}
