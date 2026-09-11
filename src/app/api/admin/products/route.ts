import { NextResponse, type NextRequest } from "next/server";
import { createProduct, listProducts } from "@/domains/products/repository";
import type { ProductCategory, ProductInput, StockStatus } from "@/domains/products/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category") as ProductCategory | null;
  const stockStatus = searchParams.get("status") as StockStatus | null;
  const query = searchParams.get("q");

  const products = listProducts({
    category: category ?? undefined,
    stockStatus: stockStatus ?? undefined,
    query: query ?? undefined,
  });

  return NextResponse.json({ products });
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as ProductInput | null;
  if (!body?.sku?.trim() || !body?.name?.trim() || !body?.category) {
    return NextResponse.json({ error: "SKU, ürün adı ve kategori zorunlu." }, { status: 400 });
  }

  try {
    const product = createProduct({
      sku: body.sku.trim(),
      name: body.name.trim(),
      category: body.category,
      description: body.description?.trim() ?? "",
      images: Array.isArray(body.images) ? body.images : [],
      karat: body.karat ?? null,
      weightGram: body.weightGram ?? null,
      workmanship: body.workmanship ?? null,
      pricingMode: body.pricingMode === "CALCULATED" ? "CALCULATED" : "MANUAL",
      manualPrice: body.manualPrice ?? null,
      stockStatus: body.stockStatus ?? "AVAILABLE",
      isVisible: body.isVisible ?? true,
      featured: body.featured ?? false,
    });
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ürün oluşturulamadı.";
    const isDuplicateSku = message.includes("UNIQUE") && message.includes("sku");
    return NextResponse.json(
      { error: isDuplicateSku ? "Bu SKU zaten kullanılıyor." : "Ürün oluşturulamadı." },
      { status: 400 },
    );
  }
}
