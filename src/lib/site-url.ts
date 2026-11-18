import { siteConfig } from "@/config/site";

function withoutTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

/**
 * The public address of the store, used for canonical links, the sitemap and
 * social sharing images. Set NEXT_PUBLIC_SITE_URL (e.g. https://www.freezebros.com.au)
 * in production. On Vercel the production domain is detected automatically.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return withoutTrailingSlash(explicit);

  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProduction) return `https://${withoutTrailingSlash(vercelProduction)}`;

  return siteConfig.defaultUrl;
}

/** Builds a full URL for a path on this site, e.g. "/shop" -> "https://.../shop". */
export function absoluteUrl(path = "/"): string {
  const normalisedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalisedPath}`;
}
