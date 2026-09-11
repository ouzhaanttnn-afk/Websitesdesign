import { NextResponse, type NextRequest } from "next/server";
import { createLead } from "@/domains/leads/repository";
import { getProductById } from "@/domains/products/repository";
import type { LeadType } from "@/domains/leads/types";

const VALID_TYPES: LeadType[] = ["PRICE_REQUEST", "WHATSAPP", "RESERVATION", "PRODUCT_INFO", "SIMILAR_PRODUCT"];

// Basit, tek-instance bellek içi rate limit — bkz. api/admin/login/route.ts'deki aynı desen.
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 12;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

interface LeadRequestBody {
  type?: string;
  productId?: string;
  customerName?: string;
  customerPhone?: string;
  message?: string;
  source?: string;
  pageUrl?: string;
  /** Honeypot alanı — insan kullanıcılar bunu hiç görmez/doldurmaz. */
  website?: string;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Çok fazla istek. Lütfen biraz sonra tekrar deneyin." }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as LeadRequestBody | null;
  if (!body) {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  // Honeypot dolu → bot. Botu bilgilendirmeden sessizce başarı dön.
  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  if (!body.type || !VALID_TYPES.includes(body.type as LeadType)) {
    return NextResponse.json({ error: "Geçersiz talep türü." }, { status: 400 });
  }

  if (body.type === "PRICE_REQUEST" || body.type === "RESERVATION") {
    if (!body.customerName?.trim() || !body.customerPhone?.trim()) {
      return NextResponse.json({ error: "Ad ve telefon gerekli." }, { status: 400 });
    }
  }

  const product = body.productId ? getProductById(body.productId) : null;

  const lead = createLead({
    type: body.type as LeadType,
    productId: product?.id ?? null,
    productSku: product?.sku ?? null,
    productName: product?.name ?? null,
    customerName: body.customerName?.trim() || null,
    customerPhone: body.customerPhone?.trim() || null,
    message: body.message?.trim() || null,
    source: body.source ?? null,
    pageUrl: body.pageUrl ?? null,
  });

  return NextResponse.json({ ok: true, lead: { id: lead.id } });
}
