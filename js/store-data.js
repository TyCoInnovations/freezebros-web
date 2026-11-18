/*
 * Freeze Bros store data
 * ----------------------
 * Products, prices and shipping rules for the cart and checkout.
 * This one file is used by the website AND by the Stripe checkout code in
 * /api, so prices always match.
 *
 * - Prices are in cents (995 = $9.95) to avoid rounding errors.
 * - If you change a product's name or price here, also update its page in
 *   /products (that copy is what search engines read).
 * - The products below are PLACEHOLDERS for the proof of concept.
 */
(function (root, factory) {
  var data = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = data; // Used by the Stripe functions in /api
  } else {
    root.FreezeBrosData = data; // Used by the website
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var settings = {
    storeName: "Freeze Bros",
    currency: "AUD",
    locale: "en-AU",

    shipping: {
      flatRate: 995, // $9.95
      freeThreshold: 6000, // Free shipping on orders of $60 or more
      countries: ["AU"], // Countries Stripe will accept shipping addresses for
      dispatchDays: { min: 1, max: 2 }, // Business days to pack and send
      deliveryDays: { min: 2, max: 7 }, // Business days with the courier
    },

    // The most anyone can add of one product.
    maxQuantityPerItem: 20,

    /*
     * STRIPE CHECKOUT
     * Leave blank to run the store in demo mode (no payment is taken).
     * Once the Stripe functions in /api are deployed (see README), set this to
     * "/api/create-checkout-session" to take real payments.
     */
    checkoutEndpoint: "",
  };

  var categories = {
    fruit: { name: "Freeze dried fruit", shortName: "Fruit", page: "freeze-dried-fruit.html" },
    lollies: { name: "Freeze dried lollies", shortName: "Lollies", page: "freeze-dried-lollies.html" },
  };

  var products = [
    {
      slug: "sour-rainbow-worms",
      sku: "FB-LOL-WORM-60",
      name: "Sour Rainbow Worms",
      category: "lollies",
      price: 1195,
      size: "60g bag",
      tagline: "Puffed up, sour and seriously crunchy.",
      badge: "Best seller",
      featured: true,
      inStock: true,
      theme: ["#FFE3F1", "#E9DDFF"],
      stripePriceId: "", // Optional: a Stripe Price ID (price_...) to use instead of the price above
    },
    {
      slug: "gummy-bear-puffs",
      sku: "FB-LOL-BEAR-60",
      name: "Gummy Bear Puffs",
      category: "lollies",
      price: 1095,
      size: "60g bag",
      tagline: "Your favourite bears, now light and crispy.",
      badge: "",
      featured: false,
      inStock: true,
      theme: ["#FFF1D6", "#FFE0E0"],
      stripePriceId: "",
    },
    {
      slug: "fizzy-cola-bottles",
      sku: "FB-LOL-COLA-60",
      name: "Fizzy Cola Bottles",
      category: "lollies",
      price: 1095,
      size: "60g bag",
      tagline: "Fizzy cola flavour with a crunchy bite.",
      badge: "",
      featured: false,
      inStock: true,
      theme: ["#FFEBD9", "#FFF6CC"],
      stripePriceId: "",
    },
    {
      slug: "marshmallow-clouds",
      sku: "FB-LOL-MALLOW-40",
      name: "Marshmallow Clouds",
      category: "lollies",
      price: 995,
      size: "40g bag",
      tagline: "Light as air and melt in your mouth.",
      badge: "",
      featured: false,
      inStock: true,
      theme: ["#FDE7FF", "#DDF6FF"],
      stripePriceId: "",
    },
    {
      slug: "rainbow-crunch-bites",
      sku: "FB-LOL-BITES-70",
      name: "Rainbow Crunch Bites",
      category: "lollies",
      price: 1295,
      size: "70g bag",
      tagline: "Fruity candy bites that puff and crack.",
      badge: "Fan favourite",
      featured: true,
      inStock: true,
      theme: ["#E3F6FF", "#FFE6F2"],
      stripePriceId: "",
    },
    {
      slug: "sour-watermelon-slices",
      sku: "FB-LOL-MELON-60",
      name: "Sour Watermelon Slices",
      category: "lollies",
      price: 1195,
      size: "60g bag",
      tagline: "Tangy watermelon with a sugary crunch.",
      badge: "Extra sour",
      featured: false,
      inStock: true,
      theme: ["#E2FBEA", "#FFE3EA"],
      stripePriceId: "",
    },
    {
      slug: "strawberry-slices",
      sku: "FB-FRT-STRAW-30",
      name: "Strawberry Slices",
      category: "fruit",
      price: 995,
      size: "30g bag",
      tagline: "Sweet, tangy and super crunchy.",
      badge: "Best seller",
      featured: true,
      inStock: true,
      theme: ["#FFE4E8", "#FFF0DE"],
      stripePriceId: "",
    },
    {
      slug: "mango-chunks",
      sku: "FB-FRT-MANGO-35",
      name: "Mango Chunks",
      category: "fruit",
      price: 1095,
      size: "35g bag",
      tagline: "Tropical, tangy and naturally sweet.",
      badge: "",
      featured: true,
      inStock: true,
      theme: ["#FFF3CF", "#FFE1C7"],
      stripePriceId: "",
    },
    {
      slug: "banana-coins",
      sku: "FB-FRT-BANANA-40",
      name: "Banana Coins",
      category: "fruit",
      price: 895,
      size: "40g bag",
      tagline: "Crispy coins of creamy banana.",
      badge: "",
      featured: false,
      inStock: true,
      theme: ["#FFF8D1", "#EAF7D9"],
      stripePriceId: "",
    },
    {
      slug: "apple-rings",
      sku: "FB-FRT-APPLE-30",
      name: "Crunchy Apple Rings",
      category: "fruit",
      price: 895,
      size: "30g bag",
      tagline: "Like chips, but made from apples.",
      badge: "",
      featured: false,
      inStock: true,
      theme: ["#FFF4DA", "#FFE3E3"],
      stripePriceId: "",
    },
    {
      slug: "pineapple-pieces",
      sku: "FB-FRT-PINE-35",
      name: "Pineapple Pieces",
      category: "fruit",
      price: 995,
      size: "35g bag",
      tagline: "A sweet and zingy tropical crunch.",
      badge: "",
      featured: false,
      inStock: true,
      theme: ["#FFF7C9", "#E3F8E9"],
      stripePriceId: "",
    },
    {
      slug: "mixed-berry-blast",
      sku: "FB-FRT-BERRY-35",
      name: "Mixed Berry Blast",
      category: "fruit",
      price: 1195,
      size: "35g bag",
      tagline: "Strawberries, raspberries and blueberries.",
      badge: "New",
      featured: false,
      inStock: true,
      theme: ["#EDE4FF", "#FFE3EC"],
      stripePriceId: "",
    },
  ];

  // Every product's image lives at images/products/<slug>.svg (swap for a .jpg/.png
  // photo whenever you like and update the "image" path here and on the product page).
  products.forEach(function (product) {
    product.image = product.image || "images/products/" + product.slug + ".svg";
    product.url = "products/" + product.slug + ".html";
  });

  return { settings: settings, categories: categories, products: products };
});
