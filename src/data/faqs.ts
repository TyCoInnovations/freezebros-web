import { siteConfig } from "@/config/site";
import { formatPrice, formatPriceShort } from "@/lib/money";

export interface Faq {
  question: string;
  answer: string;
}

export interface FaqGroup {
  title: string;
  faqs: Faq[];
}

const { shipping, returns, contact } = siteConfig;

/**
 * Frequently asked questions. Shown on /faq, marked up for search engines
 * (FAQPage schema) and included in /llms.txt for AI assistants.
 * Placeholder answers - review them before launch.
 */
export const faqGroups: FaqGroup[] = [
  {
    title: "About our treats",
    faqs: [
      {
        question: "What does freeze dried mean?",
        answer:
          "Freeze drying is a way of taking the water out of food. We freeze the treats, then place them in a vacuum chamber where the ice turns straight into vapour. This leaves the flavour and shape behind and turns the treat light and crunchy.",
      },
      {
        question: "What do freeze dried lollies taste like?",
        answer:
          "They taste like the lollies you already love, but with a big flavour boost and a brand new texture. Instead of chewy, they are light, airy and crunchy, and they melt in your mouth.",
      },
      {
        question: "Does your freeze dried fruit have added sugar?",
        answer:
          "No. Our freeze dried fruit is made from 100% fruit with nothing added. The sweetness comes from the fruit itself.",
      },
      {
        question: "Are your products suitable for people with allergies?",
        answer:
          "Ingredients and allergen information are printed on every pack. If you have an allergy, please read the label before eating, or contact us and we will be happy to help.",
      },
    ],
  },
  {
    title: "Storage and freshness",
    faqs: [
      {
        question: "How long do freeze dried treats last?",
        answer:
          "Unopened packs stay fresh for many months. Check the best before date on the pack. Once opened, enjoy them within a few days for the best crunch.",
      },
      {
        question: "How should I store them?",
        answer:
          "Keep them in a cool, dry place away from sunlight. Reseal the bag tightly after opening, because moisture in the air can make them lose their crunch.",
      },
    ],
  },
  {
    title: "Orders and shipping",
    faqs: [
      {
        question: "How much is shipping?",
        answer: `Shipping is a flat ${formatPrice(shipping.flatRate)} Australia-wide, and it is free on orders over ${formatPriceShort(shipping.freeThreshold)}.`,
      },
      {
        question: "How long will my order take to arrive?",
        answer: `We pack and send orders within ${shipping.dispatchDays.min}–${shipping.dispatchDays.max} business days. Delivery usually takes ${shipping.deliveryEstimate.minDays}–${shipping.deliveryEstimate.maxDays} business days after that, depending on where you live.`,
      },
      {
        question: "How can I pay?",
        answer:
          "Checkout is handled securely by Stripe. You can pay with all major credit and debit cards, plus Apple Pay and Google Pay on supported devices.",
      },
      {
        question: "What if my order arrives damaged?",
        answer: `Sorry about that! Email us at ${contact.email} within ${returns.days} days with a photo of the damage, and we will send a replacement or a refund.`,
      },
    ],
  },
];

export const allFaqs: Faq[] = faqGroups.flatMap((group) => group.faqs);
