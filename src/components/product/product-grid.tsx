import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/data/products";
import { cn } from "@/lib/cn";

interface ProductGridProps {
  products: Product[];
  /** How many cards (from the start) should load their images immediately. */
  eagerCount?: number;
  headingLevel?: "h2" | "h3";
  className?: string;
}

export function ProductGrid({ products, eagerCount = 0, headingLevel, className }: ProductGridProps) {
  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6",
        className,
      )}
    >
      {products.map((product, index) => (
        <li key={product.slug}>
          <ProductCard
            product={product}
            eager={index < eagerCount}
            priority={eagerCount > 0 && index === 0}
            headingLevel={headingLevel}
          />
        </li>
      ))}
    </ul>
  );
}
