import type {
  BreadcrumbList,
  FAQPage,
  ItemList,
  OnlineStore,
  Product as ProductSchema,
  WebSite,
  WithContext,
} from "schema-dts";

import { siteConfig } from "@/config/site";
import type { Faq } from "@/data/faqs";
import { categories, type Product } from "@/data/products";
import { toDecimalString } from "@/lib/money";
import { absoluteUrl, getSiteUrl } from "@/lib/site-url";

/**
 * Structured data (schema.org JSON-LD). This is how search engines and AI
 * assistants learn the facts about the store: what it sells, prices, stock,
 * shipping and common questions.
 */

const organizationId = () => `${getSiteUrl()}/#organization`;
const websiteId = () => `${getSiteUrl()}/#website`;

export function organizationJsonLd(): WithContext<OnlineStore> {
  const sameAs = Object.values(siteConfig.social).filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    "@id": organizationId(),
    name: siteConfig.name,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/icons/icon-512.png"),
    image: absoluteUrl("/opengraph-image"),
    description: siteConfig.description,
    email: siteConfig.contact.email,
    areaServed: { "@type": "Country", name: "Australia" },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: siteConfig.contact.email,
      availableLanguage: ["English"],
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function websiteJsonLd(): WithContext<WebSite> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId(),
    name: siteConfig.name,
    url: absoluteUrl("/"),
    description: siteConfig.description,
    inLanguage: siteConfig.locale,
    publisher: { "@id": organizationId() },
  };
}

export function productJsonLd(product: Product): WithContext<ProductSchema> {
  const url = absoluteUrl(`/products/${product.slug}`);
  const { shipping } = siteConfig;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    description: product.description,
    sku: product.sku,
    image: [absoluteUrl(product.image)],
    url,
    category: categories[product.category].name,
    brand: { "@type": "Brand", name: siteConfig.name },
    size: product.size,
    offers: {
      "@type": "Offer",
      url,
      price: toDecimalString(product.price),
      priceCurrency: siteConfig.currency,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": organizationId() },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: toDecimalString(shipping.flatRate),
          currency: siteConfig.currency,
        },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: siteConfig.country },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: shipping.dispatchDays.min,
            maxValue: shipping.dispatchDays.max,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: shipping.deliveryEstimate.minDays,
            maxValue: shipping.deliveryEstimate.maxDays,
            unitCode: "DAY",
          },
        },
      },
    },
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(faqs: Faq[]): WithContext<FAQPage> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function productListJsonLd(name: string, items: Product[]): WithContext<ItemList> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/products/${product.slug}`),
      name: product.name,
    })),
  };
}
