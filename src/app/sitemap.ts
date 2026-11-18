import type { MetadataRoute } from "next";

import { products } from "@/data/products";
import { absoluteUrl } from "@/lib/site-url";

type ChangeFrequency = MetadataRoute.Sitemap[number]["changeFrequency"];

const pages: Array<{ path: string; priority: number; changeFrequency: ChangeFrequency }> = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/shop", priority: 0.9, changeFrequency: "weekly" },
  { path: "/shop/fruit", priority: 0.8, changeFrequency: "weekly" },
  { path: "/shop/lollies", priority: 0.8, changeFrequency: "weekly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
  { path: "/shipping-returns", priority: 0.4, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.map(({ path, priority, changeFrequency }) => ({
      url: absoluteUrl(path),
      changeFrequency,
      priority,
    })),
    ...products.map((product) => ({
      url: absoluteUrl(`/products/${product.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: [absoluteUrl(product.image)],
    })),
  ];
}
