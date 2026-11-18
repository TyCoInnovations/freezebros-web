import "server-only";

import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Shared assets for the generated social sharing images (Open Graph).
 * Paths are kept inside fixed folders so only these files are bundled.
 */

export const ogSize = { width: 1200, height: 630 };

export const ogFonts = [
  {
    name: "Fredoka",
    data: readFileSync(join(process.cwd(), "src/assets/fonts/fredoka-700.woff")),
    weight: 700 as const,
    style: "normal" as const,
  },
  {
    name: "Fredoka",
    data: readFileSync(join(process.cwd(), "src/assets/fonts/fredoka-600.woff")),
    weight: 600 as const,
    style: "normal" as const,
  },
  {
    name: "DM Sans",
    data: readFileSync(join(process.cwd(), "src/assets/fonts/dm-sans-500.woff")),
    weight: 500 as const,
    style: "normal" as const,
  },
];

const MIME_TYPES = { svg: "image/svg+xml", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg" };

function toDataUrl(data: Buffer, extension: keyof typeof MIME_TYPES): string {
  return `data:${MIME_TYPES[extension]};base64,${data.toString("base64")}`;
}

export const logoDataUrl = toDataUrl(readFileSync(join(process.cwd(), "src/app/icon.svg")), "svg");

/** Category illustrations from /public/images/categories. */
export function categoryArtDataUrl(name: "fruit" | "lollies"): string {
  return toDataUrl(readFileSync(join(process.cwd(), "public/images/categories", `${name}.svg`)), "svg");
}

/**
 * A product image from /public/images/products as a data URL, or null if the
 * image lives elsewhere or uses a format the image renderer can't draw.
 */
export function productArtDataUrl(image: string): string | null {
  const match = /^\/images\/products\/([\w-]+)\.(svg|png|jpe?g)$/i.exec(image);
  if (!match) return null;
  const [, name, rawExtension] = match;
  const extension = rawExtension.toLowerCase() as keyof typeof MIME_TYPES;
  try {
    return toDataUrl(
      readFileSync(join(process.cwd(), "public/images/products", `${name}.${extension}`)),
      extension,
    );
  } catch {
    return null;
  }
}
