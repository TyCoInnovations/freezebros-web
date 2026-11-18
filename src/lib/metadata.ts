import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

interface PageMetadataOptions {
  /** Page title. The site name is added automatically (e.g. "FAQ | Freeze Bros"). */
  title: string;
  description: string;
  /** Path of the page, e.g. "/shop/fruit". Used for the canonical URL. */
  path: string;
  /** Set to false for pages search engines shouldn't list (e.g. the cart). */
  index?: boolean;
  /** Use the title exactly as given, without adding the site name. */
  absoluteTitle?: boolean;
  /** Social sharing image (defaults to the generated brand image). */
  image?: { url: string; alt: string };
}

const defaultImage = {
  url: "/opengraph-image",
  alt: `${siteConfig.name} – freeze dried fruit and lollies`,
};

/**
 * Builds consistent metadata for a page: title, description, canonical URL and
 * social sharing tags. Next.js replaces (rather than merges) nested metadata
 * like openGraph, so every page sets the full set here.
 */
export function pageMetadata({
  title,
  description,
  path,
  index = true,
  absoluteTitle = false,
  image = defaultImage,
}: PageMetadataOptions): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${siteConfig.name}`;
  const images = [{ url: image.url, width: 1200, height: 630, alt: image.alt }];

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: siteConfig.locale.replace("-", "_"),
      url: path,
      title: fullTitle,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images,
    },
    ...(index ? {} : { robots: { index: false, follow: true } }),
  };
}
