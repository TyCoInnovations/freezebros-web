import Link from "next/link";

import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { Price } from "@/components/product/price";
import { ProductImage } from "@/components/product/product-image";
import { categories, type Product, type ProductBadge } from "@/data/products";
import { cn } from "@/lib/cn";

const badgeStyles: Record<ProductBadge, string> = {
  "Best seller": "bg-sun text-ink",
  New: "bg-lime text-ink",
  "Fan favourite": "bg-purple text-white",
  "Extra sour": "bg-ice text-ink",
};

export function ProductBadgeLabel({ badge, className }: { badge: ProductBadge; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase shadow-sm",
        badgeStyles[badge],
        className,
      )}
    >
      {badge}
    </span>
  );
}

interface ProductCardProps {
  product: Product;
  /** Load the image straight away (for cards visible without scrolling). */
  eager?: boolean;
  /** Give this card's image top loading priority (the first card on a page). */
  priority?: boolean;
  headingLevel?: "h2" | "h3";
}

export function ProductCard({
  product,
  eager = false,
  priority = false,
  headingLevel = "h3",
}: ProductCardProps) {
  const Heading = headingLevel;
  const category = categories[product.category];

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-ink/5 transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative">
        <ProductImage
          product={product}
          eager={eager}
          priority={priority}
          sizes="(min-width: 1280px) 296px, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          className="aspect-square"
          imageClassName="p-2 transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {product.badge ? (
          <ProductBadgeLabel badge={product.badge} className="absolute top-3 left-3" />
        ) : null}
        {!product.inStock ? (
          <span className="absolute top-3 right-3 rounded-full bg-ink px-3 py-1 text-xs font-bold text-white uppercase">
            Sold out
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-5">
        <p className="text-[0.7rem] font-semibold tracking-wider text-ink-soft uppercase sm:text-xs">
          {category.shortName} · {product.size}
        </p>
        <Heading className="mt-1 text-lg leading-tight font-semibold sm:text-xl">
          <Link
            href={`/products/${product.slug}`}
            className="stretched-link transition-colors group-hover:text-pink-strong"
          >
            {product.name}
          </Link>
        </Heading>
        <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{product.tagline}</p>
        <div className="mt-auto pt-4">
          <Price amount={product.price} compareAt={product.compareAtPrice} className="text-lg" />
          <AddToCartButton
            slug={product.slug}
            productName={product.name}
            inStock={product.inStock}
            size="sm"
            compact
            className="relative z-10 mt-3 w-full px-3"
          />
        </div>
      </div>
    </article>
  );
}
