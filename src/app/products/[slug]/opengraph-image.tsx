import { ImageResponse } from "next/og";

import { categories, getProduct } from "@/data/products";
import { formatPrice } from "@/lib/money";
import { categoryArtDataUrl, logoDataUrl, ogFonts, ogSize, productArtDataUrl } from "@/lib/og";

export const alt = "A freeze dried treat from Freeze Bros";
export const size = ogSize;
export const contentType = "image/png";

export default async function ProductOpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);

  const name = product?.name ?? "Freeze Bros";
  const tagline = product?.tagline ?? "Freeze dried fruit & lollies";
  const theme = product?.theme ?? { from: "#ffe1ee", to: "#dcf4ff" };
  const art =
    (product && productArtDataUrl(product.image)) ??
    categoryArtDataUrl(product?.category === "fruit" ? "fruit" : "lollies");

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#fff8f0", fontFamily: "DM Sans" }}>
        <div
          style={{
            width: 560,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `linear-gradient(140deg, ${theme.from}, ${theme.to})`,
          }}
        >
          <img src={art} width={500} height={500} alt="" />
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 56px 52px",
            color: "#1e1240",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img src={logoDataUrl} width={56} height={56} alt="" />
            <div style={{ display: "flex", fontFamily: "Fredoka", fontWeight: 700, fontSize: 36 }}>
              <span>Freeze</span>
              <span style={{ color: "#e6006e", marginLeft: 10 }}>Bros</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {product ? (
              <div
                style={{
                  fontFamily: "Fredoka",
                  fontWeight: 600,
                  fontSize: 26,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  color: "#e6006e",
                }}
              >
                {categories[product.category].name}
              </div>
            ) : null}
            <div style={{ fontFamily: "Fredoka", fontWeight: 700, fontSize: 72, lineHeight: 1.02, marginTop: 10 }}>
              {name}
            </div>
            <div style={{ fontSize: 30, marginTop: 18, color: "#5b5675" }}>{tagline}</div>
          </div>
          {product ? (
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div
                style={{
                  display: "flex",
                  background: "#1e1240",
                  color: "#ffffff",
                  borderRadius: 999,
                  padding: "12px 28px",
                  fontSize: 34,
                  fontFamily: "Fredoka",
                  fontWeight: 700,
                }}
              >
                {formatPrice(product.price)}
              </div>
              <div style={{ fontSize: 28, color: "#5b5675" }}>{product.size}</div>
            </div>
          ) : (
            <div style={{ display: "flex" }} />
          )}
        </div>
      </div>
    ),
    { ...ogSize, fonts: ogFonts },
  );
}
