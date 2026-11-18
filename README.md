# Freeze Bros – website

A proof of concept online store for **Freeze Bros**, selling freeze dried fruit and lollies.
It's a plain static website – just HTML, CSS and JavaScript files. Nothing to install and no build step.

**To view it:** open `index.html` in your web browser (double-click it), or upload the whole folder to any web host.

> Website built by [TyCo](https://www.tyco.it.com/).

---

## What's included

- **Pages:** home, shop, fruit, lollies, 12 product pages, cart, order confirmation, about, FAQ,
  contact, shipping & returns, privacy, terms and a 404 page.
- **Add to cart:** slide-out cart, full cart page, quantity buttons and a free-shipping progress bar.
  The cart is saved in the browser, so it's still there after a refresh.
- **Stripe-ready checkout:** runs in demo mode (no payment taken) until you switch Stripe on – see below.
- **SEO and AI search:** unique titles and descriptions, social sharing images, structured data for
  products, prices and FAQs, plus `sitemap.xml`, `robots.txt` and `llms.txt`.
- **Works everywhere:** phones (from 320px wide) to large screens, keyboard and screen reader friendly.

## Folder guide

| File or folder | What it is |
| --- | --- |
| `index.html` and the other `.html` files | The pages |
| `products/` | One page per product |
| `css/styles.css` | All the styling. Brand colours are at the top |
| `js/store-data.js` | Products, prices, shipping rules and the Stripe on/off switch |
| `js/main.js` | The cart, checkout and mobile menu |
| `images/` | Product illustrations, icons and social sharing images |
| `api/` | Stripe payment code (only used once you switch payments on) |
| `sitemap.xml`, `robots.txt`, `llms.txt` | Files for search engines and AI assistants |

## Making changes

- **Words and pages:** edit the `.html` files in any text editor. The header and footer are repeated
  on every page, so use find-and-replace across all files to change them.
- **Prices and products:** update `js/store-data.js` (used by the cart and checkout) **and** the
  product's page in `products/` (what customers and search engines read).
- **Colours:** change the colour list at the top of `css/styles.css`.
- **Real product photos:** add your photo to `images/products/` (square, around 1200 × 1200px) and
  point the product's image links at it.

### Before launch

The products, prices, business details and policies are **placeholders**. Before going live:

- [ ] Replace the placeholder domain `https://www.freezebros.com.au` everywhere (find and replace)
- [ ] Replace the placeholder email `hello@freezebros.com.au`
- [ ] Check products, prices, pack sizes, ingredients and allergen info
- [ ] Check shipping rates and delivery times (`js/store-data.js` and the shipping page)
- [ ] Review the privacy policy, terms and shipping & returns pages (they show a "Template" note)
- [ ] Swap in real product photos

## Putting it online

- **Quick free preview:** in this GitHub repository go to **Settings → Pages**, choose
  **Deploy from a branch**, pick `main` and `/ (root)`, and save. GitHub gives you a link to the live site.
- **For the real store:** [Vercel](https://vercel.com) is recommended because it also runs the Stripe
  code in `api/`. Import this repository in Vercel and click Deploy – no settings needed.

Netlify or Cloudflare Pages work for the website too, but the Stripe code would need a small change.

## Switching on Stripe payments

A static website can't keep a secret key safe in the browser, so the payment step uses the two small
files in `api/`. Vercel runs them automatically.

1. Create a free [Stripe](https://dashboard.stripe.com/register) account and copy your **test**
   secret key (starts with `sk_test_`) from Developers → API keys.
2. Deploy the site to Vercel (see above).
3. In Vercel go to **Settings → Environment Variables** and add:
   - `STRIPE_SECRET_KEY` – your Stripe secret key
   - `SITE_URL` – your website address, e.g. `https://www.freezebros.com.au` (optional)
4. In `js/store-data.js` change `checkoutEndpoint: ""` to
   `checkoutEndpoint: "/api/create-checkout-session"`, then redeploy.
5. Test a purchase with card number `4242 4242 4242 4242`, any future date and any CVC.

**Order notifications:** in Stripe go to Developers → Webhooks, add the endpoint
`https://YOUR-DOMAIN/api/stripe-webhook` and choose the events `checkout.session.completed`,
`checkout.session.async_payment_succeeded` and `checkout.session.async_payment_failed`. Copy its
signing secret (starts with `whsec_`) into Vercel as `STRIPE_WEBHOOK_SECRET`. Paid orders then
reach `fulfilOrder()` in `api/stripe-webhook.mjs`, ready to connect to email or a spreadsheet.

**Going live:** once Stripe activates your account, swap in your live keys and redeploy.

Prices are always read from `js/store-data.js` on the server, so shoppers can't change them.
Shipping is charged automatically (flat rate, or free over the threshold) and promo codes created in
Stripe work at checkout.

## SEO and AI search

Already done: fast static pages, unique titles and descriptions, canonical links, social sharing
images, structured data (store, products, prices, shipping, breadcrumbs, FAQs), sitemap, robots.txt
(AI assistants welcome) and `llms.txt`.

After launch:

1. Add the site to [Google Search Console](https://search.google.com/search-console) and
   [Bing Webmaster Tools](https://www.bing.com/webmasters) (Bing powers several AI assistants),
   and submit `https://YOUR-DOMAIN/sitemap.xml`.
2. Check a product page with Google's [Rich Results Test](https://search.google.com/test/rich-results).

---

Fonts: [Fredoka](https://fonts.google.com/specimen/Fredoka) and [DM Sans](https://fonts.google.com/specimen/DM+Sans)
(SIL Open Font License, included in `fonts/`).

Website built by [TyCo](https://www.tyco.it.com/).
