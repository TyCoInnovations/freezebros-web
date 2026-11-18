import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { categories } from "@/data/products";

const tiles = [
  {
    category: categories.fruit,
    blurb: "100% real fruit, no added sugar. Nature's candy, with a crunch.",
    className: "from-[#ffe57a] via-[#ffc96b] to-[#ffa36b]",
  },
  {
    category: categories.lollies,
    blurb: "Your favourite lollies, puffed up and turned crunchy.",
    className: "from-[#ffb8d9] via-[#e9b5ff] to-[#b9c7ff]",
  },
];

export function CategoryTiles() {
  return (
    <section aria-labelledby="categories-heading" className="container-page py-14 sm:py-20">
      <SectionHeading
        id="categories-heading"
        eyebrow="Shop by category"
        title="Pick your crunch"
        align="center"
      />
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:gap-6">
        {tiles.map(({ category, blurb, className }) => (
          <Link
            key={category.slug}
            href={`/shop/${category.slug}`}
            className={`group relative flex min-h-[21rem] flex-col overflow-hidden rounded-[2rem] bg-gradient-to-br p-7 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift sm:min-h-[24rem] sm:p-9 ${className}`}
          >
            <div className="relative z-10 max-w-[16rem] sm:max-w-[18rem]">
              <h3 className="text-[2rem] leading-none font-bold sm:text-4xl">{category.name}</h3>
              <p className="mt-3 text-[0.95rem] font-medium text-ink/80 sm:text-base">{blurb}</p>
            </div>
            <span className="btn btn-dark relative z-10 mt-6 self-start">
              Shop {category.shortName.toLowerCase()}
              <ArrowRightIcon size={18} className="transition-transform group-hover:translate-x-1" />
            </span>
            <Image
              src={`/images/categories/${category.slug}.svg`}
              alt=""
              aria-hidden="true"
              width={640}
              height={480}
              className="pointer-events-none absolute -right-[10%] -bottom-[8%] h-auto w-[78%] max-w-[26rem] transition-transform duration-500 ease-out group-hover:scale-105 group-hover:-rotate-2 sm:w-[66%]"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
