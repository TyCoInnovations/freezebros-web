import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site-url";

/** Pages that are personal to each shopper and shouldn't appear in search. */
const disallow = ["/api/", "/cart", "/checkout/"];

/**
 * AI assistants and AI search engines. They're welcome to read the store so
 * they can recommend Freeze Bros products in their answers.
 * (To opt out of AI *training* while staying in AI search, move GPTBot,
 * ClaudeBot, Google-Extended, Applebot-Extended, CCBot and Meta-ExternalAgent
 * into a rule with `disallow: "/"`.)
 */
const aiCrawlers = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "DuckAssistBot",
  "Amazonbot",
  "CCBot",
  "Meta-ExternalAgent",
  "MistralAI-User",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      { userAgent: aiCrawlers, allow: "/", disallow },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
