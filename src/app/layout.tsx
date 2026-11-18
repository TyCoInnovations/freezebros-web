import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartProvider } from "@/components/cart/cart-provider";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site";
import { organizationJsonLd, websiteJsonLd } from "@/lib/structured-data";
import { getSiteUrl } from "@/lib/site-url";
import { isStripeConfigured } from "@/lib/stripe";

import "./globals.css";

const fredoka = localFont({
  src: "./fonts/fredoka-latin-wght.woff2",
  weight: "300 700",
  variable: "--font-fredoka",
  display: "swap",
  fallback: ["ui-rounded", "system-ui", "sans-serif"],
});

const dmSans = localFont({
  src: "./fonts/dm-sans-latin-wght.woff2",
  weight: "100 1000",
  variable: "--font-dm-sans",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "Arial", "sans-serif"],
});

const title = `${siteConfig.name} | Freeze Dried Fruit & Lollies`;

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "freeze dried lollies",
    "freeze dried candy",
    "freeze dried fruit",
    "freeze dried strawberries",
    "freeze dried sour worms",
    "crunchy lollies",
    "Australia",
  ],
  category: "shopping",
  // Each page sets its own canonical URL and social tags via pageMetadata().
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: siteConfig.locale.replace("-", "_"),
    title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#fff8f0",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const demoMode = !isStripeConfigured();

  return (
    <html lang="en-AU" className={`${fredoka.variable} ${dmSans.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <CartProvider>
          <Header />
          <main id="main" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <Footer />
          <CartDrawer demoMode={demoMode} />
        </CartProvider>
      </body>
    </html>
  );
}
