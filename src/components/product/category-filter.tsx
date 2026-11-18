import Link from "next/link";

import { categories, getProductsByCategory, products, type Category } from "@/data/products";
import { cn } from "@/lib/cn";

const filters: Array<{ key: Category | "all"; href: string; label: string; count: number }> = [
  { key: "all", href: "/shop", label: "All treats", count: products.length },
  {
    key: "fruit",
    href: "/shop/fruit",
    label: categories.fruit.shortName,
    count: getProductsByCategory("fruit").length,
  },
  {
    key: "lollies",
    href: "/shop/lollies",
    label: categories.lollies.shortName,
    count: getProductsByCategory("lollies").length,
  },
];

/** Pill links for switching between product categories. */
export function CategoryFilter({ active }: { active: Category | "all" }) {
  return (
    <nav aria-label="Product categories" className="mt-7">
      <ul className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const isActive = filter.key === active;
          return (
            <li key={filter.key}>
              <Link
                href={filter.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm ring-1 transition-colors",
                  isActive
                    ? "bg-ink text-white ring-ink"
                    : "bg-white text-ink ring-ink/10 hover:ring-ink/30",
                )}
              >
                {filter.label}
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs tabular-nums",
                    isActive ? "bg-white/20 text-white" : "bg-ink/5 text-ink-soft",
                  )}
                >
                  {filter.count}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
