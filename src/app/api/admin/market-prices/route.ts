import { NextResponse, type NextRequest } from "next/server";
import { getMarketPriceRows, updateMarketPrices } from "@/domains/pricing/repository";
import type { MarketPriceKey } from "@/domains/pricing/types";

export async function GET() {
  return NextResponse.json({ prices: getMarketPriceRows() });
}

export async function PUT(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as Partial<Record<MarketPriceKey, number>> | null;
  if (!body) return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });

  updateMarketPrices(body);
  return NextResponse.json({ prices: getMarketPriceRows() });
}
