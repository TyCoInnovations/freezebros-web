import Image from "next/image";

import type { Product } from "@/data/products";
import { cn } from "@/lib/cn";

interface ProductImageProps {
  product: Product;
  /** Tells the browser how wide the image will be shown, for responsive loading. */
  sizes: string;
  /** Load straight away (use for images visible without scrolling). */
  eager?: boolean;
  /** Fetch before other images (use for the single most important image). */
  priority?: boolean;
  className?: string;
  imageClassName?: string;
}

/** A product image on its soft, colour-matched background. */
export function ProductImage({
  product,
  sizes,
  eager,
  priority,
  className,
  imageClassName,
}: ProductImageProps) {
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ backgroundImage: `linear-gradient(140deg, ${product.theme.from}, ${product.theme.to})` }}
    >
      <Image
        src={product.image}
        alt={product.imageAlt}
        fill
        sizes={sizes}
        loading={eager || priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        className={cn("object-contain", imageClassName)}
      />
    </div>
  );
}
