/**
 * Site-wide settings for Freeze Bros.
 *
 * Most of the business details below are PLACEHOLDERS for the proof of concept.
 * Update them here and every page, the footer, SEO tags and Stripe checkout
 * will pick up the change automatically.
 */
export const siteConfig = {
  name: "Freeze Bros",
  shortName: "Freeze Bros",
  tagline: "Freeze dried fruit & lollies",
  description:
    "Shop freeze dried fruit and freeze dried lollies from Freeze Bros. Light, crunchy treats packed with flavour, delivered Australia-wide.",

  /** Used in SEO metadata. Set NEXT_PUBLIC_SITE_URL in production. */
  defaultUrl: "http://localhost:3000",

  locale: "en-AU",
  /** ISO 4217 currency code used for prices and Stripe Checkout. */
  currency: "AUD",
  country: "AU",

  contact: {
    // Placeholder email - replace with the real inbox before launch.
    email: "hello@freezebros.com.au",
    responseTime: "within 1 business day",
    location: "Australia",
  },

  /** Social profiles. Leave blank to hide them. */
  social: {
    instagram: "",
    tiktok: "",
    facebook: "",
  },

  shipping: {
    /** Flat shipping rate in cents. */
    flatRate: 995,
    /** Orders at or above this subtotal (in cents) ship free. */
    freeThreshold: 6000,
    /** Countries Stripe Checkout will accept shipping addresses for. */
    countries: ["AU"] as const,
    /** Business days to pack and send an order. */
    dispatchDays: { min: 1, max: 2 },
    /** Business days in transit with the courier. */
    deliveryEstimate: { minDays: 2, maxDays: 7 },
  },

  returns: {
    /** Days customers have to report a damaged or incorrect order. */
    days: 14,
  },

  /** Shown under cart totals. Update if your business is not GST registered. */
  taxNote: "All prices are in AUD and include GST.",

  /** The most anyone can add of a single product. */
  maxQuantityPerItem: 20,

  builtBy: {
    name: "TyCo",
    url: "https://www.tyco.it.com/",
  },
} as const;

export type SiteConfig = typeof siteConfig;

export const mainNav = [
  { href: "/shop", label: "Shop all" },
  { href: "/shop/fruit", label: "Fruit" },
  { href: "/shop/lollies", label: "Lollies" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
] as const;

export const footerNav = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All treats" },
      { href: "/shop/fruit", label: "Freeze dried fruit" },
      { href: "/shop/lollies", label: "Freeze dried lollies" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/shipping-returns", label: "Shipping & returns" },
      { href: "/contact", label: "Contact us" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/privacy", label: "Privacy policy" },
      { href: "/terms", label: "Terms of service" },
    ],
  },
] as const;
