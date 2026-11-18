# Freeze Bros – online store

A proof of concept online store for **Freeze Bros**, selling freeze dried fruit and freeze dried lollies.
It's fast, mobile-friendly, built for search engines and AI search, and ready to take real payments with
[Stripe](https://stripe.com) once you add your keys.

> Website built by [TyCo](https://www.tyco.it.com/).

---

## What's included

- **Home page** – hero, shop-by-category tiles, best sellers and a short "why freeze dried" section.
- **Shop pages** – all products, plus separate Fruit and Lollies pages.
- **Product pages** – large image, price, quantity picker, Add to cart, ingredients, storage and
  shipping info, and related products.
- **Add to cart system** – slide-out cart drawer, full cart page, quantity controls, free-shipping
  progress bar. The cart is saved in the browser, so it survives page refreshes and stays in sync
  across tabs.
- **Stripe-ready checkout** – secure Stripe Checkout, shipping rates, promo codes, order confirmation
  page and a webhook for paid orders. Runs in **demo mode** until you add your Stripe keys.
- **Info pages** – About, FAQ, Contact, Shipping & returns, Privacy policy and Terms of service
  (Stripe requires these before you can go live).
- **SEO** – unique titles and descriptions, canonical links, social sharing images for every page and
  product, sitemap, robots.txt and structured data (store, products, prices, breadcrumbs, FAQs).
- **AI search** – `/llms.txt` (a plain-language summary of the store for AI assistants), AI crawlers
  explicitly allowed in robots.txt, and clear, factual content that AI tools can quote.
- **Quality** – works from small phones (320px) to large desktops, keyboard and screen reader
  friendly, and tested for zero console errors.

## Quick start

You'll need [Node.js](https://nodejs.org) 20.9 or newer.

```bash
npm install
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). That's it – the store runs in demo mode out of the box.

### Demo mode

Until Stripe keys are added, the checkout button skips payment and shows a "demo order" confirmation,
so you can try the full shopping journey. The cart shows a small "Demo store: no payment will be
taken" note while demo mode is on.

## Editing the store

Everything you'd normally want to change lives in a few files:

| What | Where |
| --- | --- |
| Products, prices, descriptions, badges, stock | `src/data/products.ts` |
| Business name, email, shipping rates, free-shipping threshold, GST note | `src/config/site.ts` |
| Menu and footer links | `src/config/site.ts` |
| FAQ questions and answers | `src/data/faqs.ts` |
| Brand colours | top of `src/app/globals.css` |
| Policy pages | `src/app/shipping-returns`, `src/app/privacy`, `src/app/terms` |

Prices are stored in **cents** (e.g. `995` = $9.95) to avoid rounding errors.

### Swapping in real product photos

The product images are placeholder illustrations in `public/images/products/`. To use real photos:

1. Add your photo, e.g. `public/images/products/mango-chunks.jpg` (square images look best, ideally
   1200 × 1200px or larger).
2. Update that product's `image` (and `imageAlt`) in `src/data/products.ts`.

Photos are automatically resized and optimised. Transparent PNG cut-outs look great on the coloured
card backgrounds.

### Before launch checklist

The products, prices, business details and policies in this proof of concept are **placeholders**.
Before going live, review:

- [ ] Products, prices, pack sizes, ingredients and allergen info
- [ ] Contact email and social links (`src/config/site.ts`)
- [ ] Shipping rates, delivery times and the GST note
- [ ] About page story
- [ ] Privacy policy, terms and shipping & returns (ideally checked by a legal professional)
- [ ] Real product photos
- [ ] `NEXT_PUBLIC_SITE_URL` set to the real domain (see below)

## Connecting Stripe

The checkout is already built – you only need to add keys.

### 1. Test payments

1. Create a free account at [stripe.com](https://dashboard.stripe.com/register).
2. Copy your **test** secret key (starts with `sk_test_`) from
   [Developers → API keys](https://dashboard.stripe.com/test/apikeys).
3. Copy `.env.example` to `.env.local` and paste the key in:

   ```bash
   STRIPE_SECRET_KEY=sk_test_...
   ```

4. Restart `npm run dev`. Checkout now opens Stripe's secure payment page.
5. Pay with the test card `4242 4242 4242 4242`, any future expiry date and any CVC.

Prices are always looked up on the server from `src/data/products.ts`, so they can't be changed by
shoppers. Shipping is charged automatically (flat rate, or free over the threshold).

### 2. Order notifications (webhooks)

Stripe tells the store when an order is paid by calling `/api/webhooks/stripe`.

**Locally**, install the [Stripe CLI](https://docs.stripe.com/stripe-cli) and run:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the `whsec_...` secret it prints into `.env.local` as `STRIPE_WEBHOOK_SECRET`.

**In production**, go to [Developers → Webhooks](https://dashboard.stripe.com/webhooks), add the
endpoint `https://YOUR-DOMAIN/api/webhooks/stripe` and select these events:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.async_payment_failed`

Then add its signing secret as `STRIPE_WEBHOOK_SECRET` in your hosting settings.

Paid orders arrive in `fulfilOrder()` in `src/app/api/webhooks/stripe/route.ts`. Right now it logs
the order – connect it to your workflow there (e.g. email the packing team or save to a database).
Every order is also visible in the Stripe Dashboard.

### 3. Optional extras

- **Receipts** – turn on customer emails in Stripe under Settings → Customer emails.
- **Promo codes** – create them in the Stripe Dashboard; the checkout already accepts them.
- **Manage prices in Stripe** – create products in the Dashboard and paste each Price ID
  (`price_...`) into `stripePriceId` in `src/data/products.ts`.
- **Payment methods** – Apple Pay, Google Pay and more are switched on in the Stripe Dashboard;
  no code changes needed.

### 4. Going live

Once Stripe has activated your account, swap in your **live** keys (`sk_live_...` and the live
webhook secret) in your hosting settings and redeploy.

## Deploying

The easiest option is [Vercel](https://vercel.com) (made by the creators of Next.js):

1. Push this repository to GitHub and import it in Vercel.
2. Add the environment variables from `.env.example`:
   - `NEXT_PUBLIC_SITE_URL` – your domain, e.g. `https://www.freezebros.com.au`
   - `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` (leave empty for demo mode)
3. Deploy. After changing environment variables, redeploy so they take effect.

Any host that supports Next.js works too (`npm run build`, then `npm run start`).

## SEO and AI search

Built in:

- Server-rendered, prerendered pages that load fast and are easy for search engines to read
- Unique title, description and canonical URL on every page
- Social sharing images generated automatically for the site and every product
- Structured data: online store, website, products with price, stock and shipping, breadcrumbs and FAQs
- `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest` and `/llms.txt`
- Unknown pages return a real 404 so they never get indexed

After launch:

1. Set `NEXT_PUBLIC_SITE_URL` to the real domain (used in the sitemap, canonical links and sharing images).
2. Add the site to [Google Search Console](https://search.google.com/search-console) and
   [Bing Webmaster Tools](https://www.bing.com/webmasters) (Bing powers several AI assistants) and
   submit `https://YOUR-DOMAIN/sitemap.xml`.
3. Check product pages with Google's [Rich Results Test](https://search.google.com/test/rich-results).

To keep the store in AI search but opt out of AI *training*, see the note in `src/app/robots.ts`.

## Project structure

```
src/
  app/                  Pages and routes (Next.js App Router)
    api/checkout/       Creates the Stripe Checkout Session (or demo order)
    api/webhooks/stripe Receives paid-order notifications from Stripe
    products/[slug]/    Product pages (+ social sharing image)
    shop/               Shop and category pages
    llms.txt/           AI-friendly summary of the store
  components/           Reusable building blocks (cart, product cards, layout, home page)
  config/site.ts        Business details, shipping and navigation
  data/                 Products and FAQs
  lib/                  Cart logic, Stripe helpers, SEO helpers, formatting
public/images/          Product, category and decorative illustrations
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Check the code for problems |
| `npm run typecheck` | Check TypeScript types |
| `npm run check` | Lint, type-check and build in one go |

## Built with

[Next.js 16](https://nextjs.org) (App Router), [React 19](https://react.dev),
[TypeScript](https://www.typescriptlang.org), [Tailwind CSS 4](https://tailwindcss.com) and
[Stripe](https://stripe.com). Fonts: [Fredoka](https://fonts.google.com/specimen/Fredoka) and
[DM Sans](https://fonts.google.com/specimen/DM+Sans) (SIL Open Font License, self-hosted).

**Note:** `npm audit` reports an issue in a package used only by the code checker (ESLint) during
development. It has no fix released yet and is never included in the live website.
`npm audit --omit=dev` shows no issues.

---

Website built by [TyCo](https://www.tyco.it.com/).
