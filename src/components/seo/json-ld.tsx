import type { Thing, WithContext } from "schema-dts";

type JsonLdData = WithContext<Thing> | Array<WithContext<Thing>>;

/**
 * Adds structured data (JSON-LD) to the page so search engines and AI
 * assistants can understand products, prices, FAQs and more.
 */
export function JsonLd({ data }: { data: JsonLdData }) {
  return (
    <script
      type="application/ld+json"
      // Escape "<" so the JSON can never break out of the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
