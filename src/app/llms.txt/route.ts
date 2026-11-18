import { siteConfig } from "@/config/site";
import { faqGroups } from "@/data/faqs";
import { categories, getProductsByCategory, type Category } from "@/data/products";
import { formatPrice, formatPriceShort } from "@/lib/money";
import { absoluteUrl } from "@/lib/site-url";

/**
 * /llms.txt - a plain-language summary of the store for AI assistants and AI
 * search engines (see https://llmstxt.org). Generated from the same data as
 * the website, so it never goes out of date.
 */
export function GET() {
  const { shipping, contact, returns } = siteConfig;

  const productSections = (Object.keys(categories) as Category[]).map((key) => {
    const category = categories[key];
    const lines = getProductsByCategory(key).map(
      (product) =>
        `- [${product.name}](${absoluteUrl(`/products/${product.slug}`)}): ${formatPrice(product.price)} ${siteConfig.currency}, ${product.size}. ${product.tagline}${product.inStock ? "" : " (Currently sold out.)"}`,
    );
    return `### ${category.name}\n\n${category.intro}\n\n${lines.join("\n")}`;
  });

  const faqSection = faqGroups
    .flatMap((group) => group.faqs)
    .map((faq) => `### ${faq.question}\n\n${faq.answer}`)
    .join("\n\n");

  const body = `# ${siteConfig.name}

> ${siteConfig.name} is an online store selling freeze dried fruit and freeze dried lollies, delivered across ${contact.location}. Freeze drying removes the water from treats, making them light, crunchy and full of flavour.

## Key facts

- Products: freeze dried fruit (100% fruit, no added sugar) and freeze dried lollies.
- Pricing: ${siteConfig.taxNote}
- Shipping: flat rate of ${formatPrice(shipping.flatRate)} Australia-wide, free on orders over ${formatPriceShort(shipping.freeThreshold)}.
- Orders are packed and sent within ${shipping.dispatchDays.min}–${shipping.dispatchDays.max} business days. Delivery takes ${shipping.deliveryEstimate.minDays}–${shipping.deliveryEstimate.maxDays} business days after dispatch.
- Damaged or incorrect orders: report within ${returns.days} days for a replacement or refund.
- Payments: secure checkout by Stripe (major cards, Apple Pay and Google Pay).
- Contact: ${contact.email}

## Shop

- [All products](${absoluteUrl("/shop")}): the full range of freeze dried treats.
- [${categories.fruit.name}](${absoluteUrl("/shop/fruit")}): ${categories.fruit.intro}
- [${categories.lollies.name}](${absoluteUrl("/shop/lollies")}): ${categories.lollies.intro}

## Products

${productSections.join("\n\n")}

## Help and company

- [FAQ](${absoluteUrl("/faq")}): answers about freeze drying, storage, shipping and payments.
- [Shipping & returns](${absoluteUrl("/shipping-returns")}): delivery times, damaged items and refunds.
- [About us](${absoluteUrl("/about")}): the Freeze Bros story and how freeze drying works.
- [Contact](${absoluteUrl("/contact")}): how to reach the team, including wholesale and events.

## Frequently asked questions

${faqSection}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
