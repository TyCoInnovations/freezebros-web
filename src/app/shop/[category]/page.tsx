import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryFilter } from "@/components/product/category-filter";
import { ProductGrid } from "@/components/product/product-grid";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHeader } from "@/components/ui/page-header";
import { categories, getProductsByCategory, isCategory, type Category } from "@/data/products";
import { pageMetadata } from "@/lib/metadata";
import { productListJsonLd } from "@/lib/structured-data";

/** Short, factual copy that helps shoppers (and search engines) understand each range. */
const categoryCopy: Record<Category, { heading: string; paragraphs: string[] }> = {
  fruit: {
    heading: "What is freeze dried fruit?",
    paragraphs: [
      "Freeze dried fruit is fresh fruit with almost all of the water removed. The fruit is frozen, then the ice is gently turned into vapour in a vacuum. This keeps the fruit's shape, colour and flavour, and gives it a light, crunchy texture.",
      "Our freeze dried fruit is 100% fruit with no added sugar. It makes a great snack on its own, a crunchy topping for cereal and yoghurt, or a mess-free lunchbox treat.",
    ],
  },
  lollies: {
    heading: "What are freeze dried lollies?",
    paragraphs: [
      "Freeze dried lollies are classic lollies that have been through the freeze drying process. As the moisture leaves, the lollies puff up and turn light and crunchy, and the flavour gets even stronger.",
      "The result is a totally new way to enjoy your favourites. Sour worms, gummy bears and cola bottles all crunch, crackle and melt in your mouth.",
    ],
  },
};

export function generateStaticParams() {
  return (Object.keys(categories) as Category[]).map((category) => ({ category }));
}

/*
 * Category pages are fully static. Requiring static output also means unknown
 * categories are checked before the response starts, so they return a real 404.
 */
export const ensureStatic = "navigation";

export async function generateMetadata({
  params,
}: PageProps<"/shop/[category]">): Promise<Metadata> {
  const { category } = await params;
  if (!isCategory(category)) return { title: "Category not found" };

  const info = categories[category];
  return pageMetadata({
    title: `Shop ${info.title}`,
    description: info.description,
    path: `/shop/${category}`,
  });
}

export default async function CategoryPage({ params }: PageProps<"/shop/[category]">) {
  const { category } = await params;
  if (!isCategory(category)) notFound();

  const info = categories[category];
  const items = getProductsByCategory(category);
  const copy = categoryCopy[category];

  return (
    <>
      <JsonLd data={productListJsonLd(info.name, items)} />
      <PageHeader
        title={info.title}
        intro={info.intro}
        breadcrumbs={[
          { name: "Shop", path: "/shop" },
          { name: info.shortName, path: `/shop/${category}` },
        ]}
      >
        <CategoryFilter active={category} />
      </PageHeader>

      <div className="container-page py-10 sm:py-14">
        <h2 className="sr-only">{info.name} products</h2>
        <ProductGrid products={items} eagerCount={4} />

        <section className="mt-16 max-w-3xl rounded-3xl bg-white p-6 shadow-card sm:p-8">
          <h2 className="text-2xl font-semibold sm:text-3xl">{copy.heading}</h2>
          {copy.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="mt-3 leading-relaxed text-ink-soft">
              {paragraph}
            </p>
          ))}
        </section>
      </div>
    </>
  );
}
