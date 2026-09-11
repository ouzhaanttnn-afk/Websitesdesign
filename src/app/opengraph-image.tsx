import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { brand } from "@/config/brand";

export const alt = `${brand.name} — ${brand.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logoBuffer = await readFile(join(process.cwd(), "public/brand/alvera-logo-gold.png"));
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1C1917",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            right: 28,
            bottom: 28,
            border: "1px solid rgba(250,250,249,0.16)",
            display: "flex",
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 20,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#C08A2E",
            marginBottom: 28,
          }}
        >
          {brand.locationLabel}
        </div>
        <img src={logoSrc} width={520} height={171} alt="" />
        <div
          style={{
            display: "flex",
            fontSize: 32,
            fontStyle: "italic",
            color: "rgba(250,250,249,0.85)",
            marginTop: 26,
          }}
        >
          {brand.tagline}
        </div>
      </div>
    ),
    { ...size },
  );
}
