import { NextResponse, type NextRequest } from "next/server";
import { getProductById, setProductStockStatus } from "@/domains/products/repository";
import type { StockStatus } from "@/domains/products/types";

const VALID: StockStatus[] = ["AVAILABLE", "RESERVED", "SOLD", "HIDDEN"];

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getProductById(id)) return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });

  const body = (await request.json().catch(() => null)) as { status?: string } | null;
  if (!body?.status || !VALID.includes(body.status as StockStatus)) {
    return NextResponse.json({ error: "Geçersiz durum." }, { status: 400 });
  }

  const product = setProductStockStatus(id, body.status as StockStatus);
  return NextResponse.json({ product });
}
