import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { siteUrl } from "@/lib/site-url";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const url = `${siteUrl}/urun/${slug}`;

  const buffer = await QRCode.toBuffer(url, {
    width: 480,
    margin: 2,
    color: { dark: "#1C1917", light: "#FFFFFF" },
  });

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
