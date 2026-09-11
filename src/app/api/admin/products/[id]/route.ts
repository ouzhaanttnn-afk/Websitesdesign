import { NextResponse, type NextRequest } from "next/server";
import { getProductById, updateProduct } from "@/domains/products/repository";
import type { ProductInput } from "@/domains/products/types";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const existing = await getProductById(id);
  if (!existing) return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });

  const body = (await request.json().catch(() => null)) as Partial<ProductInput> | null;
  if (!body) return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });

  const product = await updateProduct(id, body);
  return NextResponse.json({ product });
}
