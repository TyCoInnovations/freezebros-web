/**
 * Product catalogue.
 *
 * These are PLACEHOLDER products for the proof of concept. To change the range,
 * edit this list - every page, the cart, the sitemap and Stripe checkout read
 * from here.
 *
 * Prices are stored in cents (e.g. 995 = $9.95) to avoid rounding errors.
 *
 * Images: each product points at an illustration in /public/images/products.
 * Swap `image` for a real product photo (e.g. "/images/products/mango.jpg")
 * whenever you're ready - no other code changes are needed.
 *
 * Stripe: checkout works straight away using the price below. If you'd rather
 * manage prices in the Stripe Dashboard, create the product there and paste its
 * Price ID (starts with "price_") into `stripePriceId`.
 */

export type Category = "fruit" | "lollies";

export type ProductBadge = "Best seller" | "New" | "Fan favourite" | "Extra sour";

export interface Product {
  /** Unique, URL-friendly ID. Used in links, the cart and Stripe metadata. */
  slug: string;
  /** Stock keeping unit, shown to search engines. */
  sku: string;
  name: string;
  category: Category;
  /** Price in cents. */
  price: number;
  /** Optional "was" price in cents, shown crossed out. */
  compareAtPrice?: number;
  /** Pack size, e.g. "30g bag". */
  size: string;
  /** One short line for product cards. */
  tagline: string;
  /** Longer description for the product page. */
  description: string;
  /** Quick selling points shown as a checklist. */
  highlights: string[];
  ingredients: string;
  badge?: ProductBadge;
  /** Featured products appear in "Best sellers" on the home page. */
  featured?: boolean;
  inStock: boolean;
  image: string;
  imageAlt: string;
  /** Soft background colours behind the product image. */
  theme: { from: string; to: string };
  /** Optional Stripe Price ID. Leave undefined to use `price` directly. */
  stripePriceId?: string;
}

export const categories: Record<
  Category,
  {
    slug: Category;
    name: string;
    shortName: string;
    title: string;
    description: string;
    intro: string;
  }
> = {
  fruit: {
    slug: "fruit",
    name: "Freeze dried fruit",
    shortName: "Fruit",
    title: "Freeze Dried Fruit",
    description:
      "Shop freeze dried fruit from Freeze Bros. Strawberries, mango, banana, apple and more, freeze dried until light and crunchy with no added sugar.",
    intro:
      "Real fruit with the water taken out and all the flavour left in. Crunchy, naturally sweet and easy to take anywhere.",
  },
  lollies: {
    slug: "lollies",
    name: "Freeze dried lollies",
    shortName: "Lollies",
    title: "Freeze Dried Lollies",
    description:
      "Shop freeze dried lollies from Freeze Bros. Sour worms, gummy bears, cola bottles and more, puffed up and crunchy with an even bigger flavour.",
    intro:
      "Your favourite lollies, puffed up and turned crunchy. Same great taste, totally new texture.",
  },
};

export const products: Product[] = [
  // ---------- Lollies ----------
  {
    slug: "sour-rainbow-worms",
    sku: "FB-LOL-WORM-60",
    name: "Sour Rainbow Worms",
    category: "lollies",
    price: 1195,
    size: "60g bag",
    tagline: "Puffed up, sour and seriously crunchy.",
    description:
      "Classic sour worms, freeze dried until they puff up and turn crunchy. You still get that sweet and sour hit, but now every bite cracks before it melts away.",
    highlights: [
      "Sweet and sour flavour",
      "Light, airy crunch",
      "Great for sharing",
    ],
    ingredients:
      "Full ingredient and allergen details are printed on every pack.",
    badge: "Best seller",
    featured: true,
    inStock: true,
    image: "/images/products/sour-rainbow-worms.svg",
    imageAlt: "Illustration of colourful freeze dried sour worms",
    theme: { from: "#FFE3F1", to: "#E9DDFF" },
  },
  {
    slug: "gummy-bear-puffs",
    sku: "FB-LOL-BEAR-60",
    name: "Gummy Bear Puffs",
    category: "lollies",
    price: 1095,
    size: "60g bag",
    tagline: "Your favourite bears, now light and crispy.",
    description:
      "Fruity gummy bears that grow bigger and crunchier when freeze dried. They taste just like the bears you know, with a crisp texture that melts in your mouth.",
    highlights: ["Mixed fruit flavours", "Puffed and crunchy", "Fun for all ages"],
    ingredients:
      "Full ingredient and allergen details are printed on every pack.",
    inStock: true,
    image: "/images/products/gummy-bear-puffs.svg",
    imageAlt: "Illustration of puffed gummy bears in red, orange, yellow and green",
    theme: { from: "#FFF1D6", to: "#FFE0E0" },
  },
  {
    slug: "fizzy-cola-bottles",
    sku: "FB-LOL-COLA-60",
    name: "Fizzy Cola Bottles",
    category: "lollies",
    price: 1095,
    size: "60g bag",
    tagline: "Fizzy cola flavour with a crunchy bite.",
    description:
      "A fizzy favourite with a brand new crunch. These cola bottles are coated in tangy sugar, then freeze dried until they're light, crispy and full of cola flavour.",
    highlights: ["Tangy, fizzy coating", "Big cola flavour", "Crunchy texture"],
    ingredients:
      "Full ingredient and allergen details are printed on every pack.",
    inStock: true,
    image: "/images/products/fizzy-cola-bottles.svg",
    imageAlt: "Illustration of sugar-coated freeze dried cola bottle lollies",
    theme: { from: "#FFEBD9", to: "#FFF6CC" },
  },
  {
    slug: "marshmallow-clouds",
    sku: "FB-LOL-MALLOW-40",
    name: "Marshmallow Clouds",
    category: "lollies",
    price: 995,
    size: "40g bag",
    tagline: "Light as air and melt in your mouth.",
    description:
      "Soft pastel marshmallows, freeze dried into crunchy little clouds. They melt the second they hit your tongue. Eat them by the handful or pop them on hot chocolate.",
    highlights: ["Melt-in-your-mouth crunch", "Pastel colours", "Great on hot chocolate"],
    ingredients:
      "Full ingredient and allergen details are printed on every pack.",
    inStock: true,
    image: "/images/products/marshmallow-clouds.svg",
    imageAlt: "Illustration of pastel freeze dried marshmallows",
    theme: { from: "#FDE7FF", to: "#DDF6FF" },
  },
  {
    slug: "rainbow-crunch-bites",
    sku: "FB-LOL-BITES-70",
    name: "Rainbow Crunch Bites",
    category: "lollies",
    price: 1295,
    size: "70g bag",
    tagline: "Fruity candy bites that puff and crack.",
    description:
      "Chewy fruit candies that puff up and crack open when freeze dried. Each bite is packed with fruity flavour and a satisfying crunch. Our most popular treat for parties.",
    highlights: ["Five fruity flavours", "Puffs and cracks open", "Perfect for parties"],
    ingredients:
      "Full ingredient and allergen details are printed on every pack.",
    badge: "Fan favourite",
    featured: true,
    inStock: true,
    image: "/images/products/rainbow-crunch-bites.svg",
    imageAlt: "Illustration of puffed rainbow candy bites cracking open",
    theme: { from: "#E3F6FF", to: "#FFE6F2" },
  },
  {
    slug: "sour-watermelon-slices",
    sku: "FB-LOL-MELON-60",
    name: "Sour Watermelon Slices",
    category: "lollies",
    price: 1195,
    size: "60g bag",
    tagline: "Tangy watermelon with a sugary crunch.",
    description:
      "Watermelon lollies with a sour sugar coating, freeze dried until crisp. Expect a mouth-puckering tang followed by sweet watermelon flavour.",
    highlights: ["Extra sour coating", "Juicy watermelon flavour", "Crunchy and airy"],
    ingredients:
      "Full ingredient and allergen details are printed on every pack.",
    badge: "Extra sour",
    inStock: true,
    image: "/images/products/sour-watermelon-slices.svg",
    imageAlt: "Illustration of sour watermelon slice lollies",
    theme: { from: "#E2FBEA", to: "#FFE3EA" },
  },

  // ---------- Fruit ----------
  {
    slug: "strawberry-slices",
    sku: "FB-FRT-STRAW-30",
    name: "Strawberry Slices",
    category: "fruit",
    price: 995,
    size: "30g bag",
    tagline: "Sweet, tangy and super crunchy.",
    description:
      "Real strawberries, sliced and freeze dried until light and crisp. They melt in your mouth with a burst of bright strawberry flavour. Enjoy them on their own, on cereal or in smoothies.",
    highlights: ["100% real fruit", "No added sugar", "Light, crunchy texture"],
    ingredients: "Strawberries (100%).",
    badge: "Best seller",
    featured: true,
    inStock: true,
    image: "/images/products/strawberry-slices.svg",
    imageAlt: "Illustration of freeze dried strawberry slices",
    theme: { from: "#FFE4E8", to: "#FFF0DE" },
  },
  {
    slug: "mango-chunks",
    sku: "FB-FRT-MANGO-35",
    name: "Mango Chunks",
    category: "fruit",
    price: 1095,
    size: "35g bag",
    tagline: "Tropical, tangy and naturally sweet.",
    description:
      "Juicy mango chunks freeze dried into crunchy, golden bites. All the tropical flavour of fresh mango, without the sticky fingers.",
    highlights: ["100% real fruit", "No added sugar", "Tropical flavour"],
    ingredients: "Mango (100%).",
    featured: true,
    inStock: true,
    image: "/images/products/mango-chunks.svg",
    imageAlt: "Illustration of golden freeze dried mango chunks",
    theme: { from: "#FFF3CF", to: "#FFE1C7" },
  },
  {
    slug: "banana-coins",
    sku: "FB-FRT-BANANA-40",
    name: "Banana Coins",
    category: "fruit",
    price: 895,
    size: "40g bag",
    tagline: "Crispy coins of creamy banana.",
    description:
      "Ripe bananas, sliced into coins and freeze dried until crisp. They taste like fresh banana with a light crunch. A lunchbox favourite.",
    highlights: ["100% real fruit", "No added sugar", "Lunchbox friendly"],
    ingredients: "Banana (100%).",
    inStock: true,
    image: "/images/products/banana-coins.svg",
    imageAlt: "Illustration of freeze dried banana coins",
    theme: { from: "#FFF8D1", to: "#EAF7D9" },
  },
  {
    slug: "apple-rings",
    sku: "FB-FRT-APPLE-30",
    name: "Crunchy Apple Rings",
    category: "fruit",
    price: 895,
    size: "30g bag",
    tagline: "Like chips, but made from apples.",
    description:
      "Crisp apple rings with a gentle sweetness and a satisfying snap. A simple snack made from just one ingredient: apples.",
    highlights: ["100% real fruit", "No added sugar", "Snappy, chip-like crunch"],
    ingredients: "Apple (100%).",
    inStock: true,
    image: "/images/products/apple-rings.svg",
    imageAlt: "Illustration of freeze dried apple rings",
    theme: { from: "#FFF4DA", to: "#FFE3E3" },
  },
  {
    slug: "pineapple-pieces",
    sku: "FB-FRT-PINE-35",
    name: "Pineapple Pieces",
    category: "fruit",
    price: 995,
    size: "35g bag",
    tagline: "A sweet and zingy tropical crunch.",
    description:
      "Sweet pineapple pieces with a zingy kick, freeze dried until light and crunchy. Like a holiday in a bag.",
    highlights: ["100% real fruit", "No added sugar", "Sweet and zingy"],
    ingredients: "Pineapple (100%).",
    inStock: true,
    image: "/images/products/pineapple-pieces.svg",
    imageAlt: "Illustration of freeze dried pineapple pieces",
    theme: { from: "#FFF7C9", to: "#E3F8E9" },
  },
  {
    slug: "mixed-berry-blast",
    sku: "FB-FRT-BERRY-35",
    name: "Mixed Berry Blast",
    category: "fruit",
    price: 1195,
    size: "35g bag",
    tagline: "Strawberries, raspberries and blueberries.",
    description:
      "A colourful mix of strawberries, raspberries and blueberries, freeze dried for a tangy, crunchy berry hit. Great for snacking or topping yoghurt.",
    highlights: ["Three kinds of berries", "No added sugar", "Tangy and bright"],
    ingredients: "Strawberries, raspberries, blueberries.",
    badge: "New",
    inStock: true,
    image: "/images/products/mixed-berry-blast.svg",
    imageAlt: "Illustration of freeze dried strawberries, raspberries and blueberries",
    theme: { from: "#EDE4FF", to: "#FFE3EC" },
  },
];

const productsBySlug = new Map(products.map((product) => [product.slug, product]));

export function getProduct(slug: string): Product | undefined {
  return productsBySlug.get(slug);
}

export function getProductsByCategory(category: Category): Product[] {
  return products.filter((product) => product.category === category);
}

export function getFeaturedProducts(limit = 4): Product[] {
  return products.filter((product) => product.featured).slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, limit);
}

export function isCategory(value: string): value is Category {
  return value === "fruit" || value === "lollies";
}
