import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";
import { formatPriceShort } from "@/lib/money";
import { categoryArtDataUrl, logoDataUrl, ogFonts, ogSize } from "@/lib/og";

export const alt = "Freeze Bros – freeze dried fruit and lollies with a big crunch";
export const size = ogSize;
export const contentType = "image/png";

const fruitArt = categoryArtDataUrl("fruit");
const lolliesArt = categoryArtDataUrl("lollies");

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #ff2e7e 0%, #9b3cf0 55%, #2f8bff 100%)",
          fontFamily: "DM Sans",
          color: "#ffffff",
          padding: 64,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 600 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <img src={logoDataUrl} width={84} height={84} alt="" />
            <div style={{ fontFamily: "Fredoka", fontWeight: 700, fontSize: 54 }}>Freeze Bros</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "Fredoka", fontWeight: 700, fontSize: 78, lineHeight: 1.02 }}>
              Freeze dried fruit &amp; lollies
            </div>
            <div style={{ fontSize: 32, marginTop: 20, opacity: 0.92 }}>
              Light, crunchy and packed with flavour.
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              background: "#1e1240",
              borderRadius: 999,
              padding: "14px 28px",
              fontSize: 26,
            }}
          >
            Free shipping over {formatPriceShort(siteConfig.shipping.freeThreshold)}
          </div>
        </div>
        <div style={{ display: "flex", flex: 1, position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: 40,
              left: 30,
              width: 440,
              height: 440,
              borderRadius: 999,
              background: "rgba(255,255,255,0.22)",
            }}
          />
          <img src={lolliesArt} width={420} height={315} alt="" style={{ position: "absolute", top: -10, left: 20 }} />
          <img src={fruitArt} width={400} height={300} alt="" style={{ position: "absolute", top: 220, left: 70 }} />
        </div>
      </div>
    ),
    { ...ogSize, fonts: ogFonts },
  );
}
