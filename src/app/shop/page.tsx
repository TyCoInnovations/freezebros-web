import type { Metadata } from "next";

import { CategoryFilter } from "@/components/product/category-filter";
import { ProductGrid } from "@/components/product/product-grid";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHeader } from "@/components/ui/page-header";
import { siteConfig } from "@/config/site";
import { products } from "@/data/products";
import { pageMetadata } from "@/lib/metadata";
import { formatPriceShort } from "@/lib/money";
import { productListJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = pageMetadata({
  title: "Shop Freeze Dried Fruit & Lollies",
  description: `Browse every Freeze Bros treat: crunchy freeze dried fruit and puffed-up freeze dried lollies. Free shipping on orders over ${formatPriceShort(siteConfig.shipping.freeThreshold)} Australia-wide.`,
  path: "/shop",
});

export default function ShopPage() {
  // Best sellers first, then the rest of the range.
  const sorted = [...products].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));

  return (
    <>
      <JsonLd data={productListJsonLd("All Freeze Bros treats", sorted)} />
      <PageHeader
        title="Shop all treats"
        intro="Crunchy freeze dried fruit and puffed-up lollies. Mix and match your favourites."
        breadcrumbs={[{ name: "Shop", path: "/shop" }]}
      >
        <CategoryFilter active="all" />
      </PageHeader>
      <div className="container-page py-10 sm:py-14">
        <h2 className="sr-only">All products</h2>
        <ProductGrid products={sorted} eagerCount={4} />
      </div>
    </>
  );
}
