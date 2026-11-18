import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { ProductBadgeLabel } from "@/components/product/product-card";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductImage } from "@/components/product/product-image";
import { ProductPurchase } from "@/components/product/product-purchase";
import { Price } from "@/components/product/price";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import {
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  LockIcon,
  TruckIcon,
} from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import { categories, getProduct, getRelatedProducts, products } from "@/data/products";
import { pageMetadata } from "@/lib/metadata";
import { formatPrice, formatPriceShort } from "@/lib/money";
import { productJsonLd } from "@/lib/structured-data";

/** Shortens text to a maximum length without cutting a word in half. */
function truncateAtWord(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,.;:]$/, "")}…`;
}

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

/*
 * Product pages are fully static: every product is prerendered at build time.
 * Requiring static output also means an unknown product URL is checked before
 * the response starts, so it returns a real 404 status for search engines.
 */
export const ensureStatic = "navigation";

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product not found" };

  return pageMetadata({
    title: `${product.name} – ${categories[product.category].name}`,
    description: truncateAtWord(`${product.tagline} ${product.description}`, 158),
    path: `/products/${product.slug}`,
    image: {
      url: `/products/${product.slug}/opengraph-image`,
      alt: `${product.name} from ${siteConfig.name}`,
    },
  });
}

function InfoPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details name="product-info" className="group border-b border-ink/10 py-1">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg py-3.5 font-display text-lg font-semibold [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDownIcon
          size={20}
          className="shrink-0 text-ink-soft transition-transform duration-200 group-open:rotate-180"
        />
      </summary>
      <div className="pb-4 leading-relaxed text-ink-soft">{children}</div>
    </details>
  );
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = categories[product.category];
  const related = getRelatedProducts(product, 4);
  const { shipping, returns } = siteConfig;

  return (
    <>
      <JsonLd data={productJsonLd(product)} />

      <div className="container-page pt-6 pb-16 sm:pt-8">
        <Breadcrumbs
          items={[
            { name: "Shop", path: "/shop" },
            { name: category.shortName, path: `/shop/${category.slug}` },
            { name: product.name, path: `/products/${product.slug}` },
          ]}
        />

        <div className="mt-6 grid gap-8 lg:mt-8 lg:grid-cols-2 lg:gap-14">
          <div className="relative lg:sticky lg:top-24 lg:self-start">
            <ProductImage
              product={product}
              priority
              sizes="(min-width: 1280px) 600px, (min-width: 1024px) 50vw, 100vw"
              className="aspect-square rounded-[2rem] shadow-card ring-1 ring-ink/5"
              imageClassName="p-4 sm:p-8"
            />
            {product.badge ? (
              <ProductBadgeLabel badge={product.badge} className="absolute top-4 left-4 text-sm" />
            ) : null}
          </div>

          <div>
            <Link
              href={`/shop/${category.slug}`}
              className="eyebrow rounded hover:underline hover:underline-offset-4"
            >
              {category.name}
            </Link>
            <h1 className="mt-2 text-4xl font-bold sm:text-5xl">{product.name}</h1>
            <p className="mt-3 text-xl text-ink-soft">{product.tagline}</p>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              <Price amount={product.price} compareAt={product.compareAtPrice} className="text-3xl" />
              <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-ink-soft ring-1 ring-ink/10">
                {product.size}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 text-sm font-semibold ${
                  product.inStock ? "text-[#23812b]" : "text-pink-deep"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`size-2 rounded-full ${product.inStock ? "bg-[#2fa23a]" : "bg-pink-deep"}`}
                />
                {product.inStock ? "In stock" : "Sold out"}
              </span>
            </div>

            <p className="mt-6 text-lg leading-relaxed text-ink-soft">{product.description}</p>

            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {product.highlights.map((highlight) => (
                <li key={highlight} className="flex items-center gap-2.5 font-medium">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-lime-soft text-[#23812b]">
                    <CheckIcon size={14} strokeWidth={3} />
                  </span>
                  {highlight}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <ProductPurchase slug={product.slug} productName={product.name} inStock={product.inStock} />
            </div>

            <ul className="mt-6 grid gap-3 rounded-2xl bg-white p-4 text-sm font-medium shadow-card sm:grid-cols-3">
              <li className="flex items-center gap-2">
                <TruckIcon size={18} className="shrink-0 text-pink-strong" />
                Free shipping over {formatPriceShort(shipping.freeThreshold)}
              </li>
              <li className="flex items-center gap-2">
                <ClockIcon size={18} className="shrink-0 text-pink-strong" />
                Ships in {shipping.dispatchDays.min}–{shipping.dispatchDays.max} business days
              </li>
              <li className="flex items-center gap-2">
                <LockIcon size={18} className="shrink-0 text-pink-strong" />
                Secure checkout
              </li>
            </ul>

            <div className="mt-8 border-t border-ink/10">
              <InfoPanel title="Ingredients">
                <p>{product.ingredients}</p>
              </InfoPanel>
              <InfoPanel title="Storage">
                <p>
                  Store in a cool, dry place. Reseal the bag after opening to keep the crunch, and
                  enjoy within a few days of opening.
                </p>
              </InfoPanel>
              <InfoPanel title="Shipping & returns">
                <p>
                  Flat-rate shipping of {formatPrice(shipping.flatRate)} Australia-wide, free on
                  orders over {formatPriceShort(shipping.freeThreshold)}. If your order arrives damaged,
                  let us know within {returns.days} days and we&apos;ll make it right.{" "}
                  <Link href="/shipping-returns" className="text-link">
                    Read our shipping policy
                  </Link>
                  .
                </p>
              </InfoPanel>
            </div>
          </div>
        </div>

        {related.length > 0 ? (
          <section aria-labelledby="related-heading" className="mt-20">
            <h2 id="related-heading" className="text-3xl font-bold sm:text-4xl">
              You might also like
            </h2>
            <ProductGrid products={related} className="mt-8" />
          </section>
        ) : null}
      </div>
    </>
  );
}
