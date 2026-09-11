import { NextResponse, type NextRequest } from "next/server";
import { recordEvent } from "@/domains/analytics/repository";
import type { AnalyticsEventName } from "@/domains/analytics/types";

const VALID_NAMES: AnalyticsEventName[] = [
  "page_view",
  "product_view",
  "price_view",
  "price_request_click",
  "price_request_created",
  "whatsapp_click",
  "reservation_click",
  "reservation_created",
  "similar_product_click",
];

export async function POST(request: NextRequest) {
  // sendBeacon bazı tarayıcılarda text/plain gönderebilir — yine de JSON parse ediyoruz.
  const body = (await request.json().catch(() => null)) as
    | { name?: string; productId?: string; sku?: string; category?: string; source?: string; page?: string }
    | null;

  if (!body?.name || !VALID_NAMES.includes(body.name as AnalyticsEventName)) {
    return NextResponse.json({ error: "Geçersiz event" }, { status: 400 });
  }

  recordEvent(body.name as AnalyticsEventName, {
    productId: body.productId,
    sku: body.sku,
    category: body.category,
    source: body.source,
    page: body.page,
  });

  return NextResponse.json({ ok: true });
}
