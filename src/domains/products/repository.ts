import { randomUUID } from "node:crypto";
import { getDb } from "@/lib/db/client";
import { uniqueSlug } from "./slug";
import type { Product, ProductFilter, ProductInput, StockStatus } from "./types";

interface ProductRow {
  id: string;
  sku: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  images: string;
  karat: string | null;
  weight_gram: number | null;
  workmanship: number | null;
  pricing_mode: string;
  manual_price: number | null;
  stock_status: string;
  is_visible: number;
  featured: number;
  created_at: string;
  updated_at: string;
}

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    sku: row.sku,
    slug: row.slug,
    name: row.name,
    category: row.category as Product["category"],
    description: row.description,
    images: JSON.parse(row.images) as string[],
    karat: row.karat,
    weightGram: row.weight_gram,
    workmanship: row.workmanship,
    pricingMode: row.pricing_mode as Product["pricingMode"],
    manualPrice: row.manual_price,
    stockStatus: row.stock_status as StockStatus,
    isVisible: row.is_visible === 1,
    featured: row.featured === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function slugExists(slug: string, excludeId?: string): boolean {
  const db = getDb();
  const row = db
    .prepare(`SELECT id FROM products WHERE slug = ? ${excludeId ? "AND id != ?" : ""}`)
    .get(...(excludeId ? [slug, excludeId] : [slug]));
  return !!row;
}

export function listProducts(filter: ProductFilter = {}): Product[] {
  const db = getDb();
  const clauses: string[] = [];
  const params: (string | number)[] = [];

  if (filter.category) {
    clauses.push("category = ?");
    params.push(filter.category);
  }
  if (filter.stockStatus) {
    clauses.push("stock_status = ?");
    params.push(filter.stockStatus);
  }
  if (filter.visibleOnly) {
    clauses.push("is_visible = 1 AND stock_status != 'HIDDEN'");
  }
  if (filter.query) {
    clauses.push("(name LIKE ? OR sku LIKE ?)");
    const like = `%${filter.query}%`;
    params.push(like, like);
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const rows = db
    .prepare(`SELECT * FROM products ${where} ORDER BY created_at DESC`)
    .all(...params) as unknown as ProductRow[];
  return rows.map(toProduct);
}

export function getProductBySlug(slug: string): Product | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM products WHERE slug = ?").get(slug) as ProductRow | undefined;
  return row ? toProduct(row) : null;
}

export function getProductById(id: string): Product | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as ProductRow | undefined;
  return row ? toProduct(row) : null;
}

/** Görünür/satılabilir ürünler arasından, aynı kategoriden, verilen ürün hariç. "Benzer ürünler" için. */
export function listSimilarProducts(product: Product, limit = 4): Product[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT * FROM products
       WHERE category = ? AND id != ? AND is_visible = 1 AND stock_status IN ('AVAILABLE','RESERVED')
       ORDER BY created_at DESC LIMIT ?`,
    )
    .all(product.category, product.id, limit) as unknown as ProductRow[];
  return rows.map(toProduct);
}

export function createProduct(input: ProductInput): Product {
  const db = getDb();
  const id = randomUUID();
  const now = new Date().toISOString();
  const slug = uniqueSlug(input.name, (candidate) => slugExists(candidate));

  db.prepare(
    `INSERT INTO products
      (id, sku, slug, name, category, description, images, karat, weight_gram, workmanship,
       pricing_mode, manual_price, stock_status, is_visible, featured, created_at, updated_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
  ).run(
    id,
    input.sku,
    slug,
    input.name,
    input.category,
    input.description,
    JSON.stringify(input.images),
    input.karat,
    input.weightGram,
    input.workmanship,
    input.pricingMode,
    input.manualPrice,
    input.stockStatus,
    input.isVisible ? 1 : 0,
    input.featured ? 1 : 0,
    now,
    now,
  );

  return getProductById(id) as Product;
}

export function updateProduct(id: string, input: Partial<ProductInput>): Product | null {
  const existing = getProductById(id);
  if (!existing) return null;
  const db = getDb();
  const now = new Date().toISOString();

  const next = { ...existing, ...input };
  const slug =
    input.name && input.name !== existing.name
      ? uniqueSlug(input.name, (candidate) => slugExists(candidate, id))
      : existing.slug;

  db.prepare(
    `UPDATE products SET
      sku=?, slug=?, name=?, category=?, description=?, images=?, karat=?, weight_gram=?,
      workmanship=?, pricing_mode=?, manual_price=?, stock_status=?, is_visible=?, featured=?, updated_at=?
     WHERE id=?`,
  ).run(
    next.sku,
    slug,
    next.name,
    next.category,
    next.description,
    JSON.stringify(next.images),
    next.karat,
    next.weightGram,
    next.workmanship,
    next.pricingMode,
    next.manualPrice,
    next.stockStatus,
    next.isVisible ? 1 : 0,
    next.featured ? 1 : 0,
    now,
    id,
  );

  return getProductById(id);
}

/** Hızlı "SATILDI" aksiyonu — admin ürün listesinde tek dokunuşla. */
export function markProductSold(id: string): Product | null {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare("UPDATE products SET stock_status = 'SOLD', updated_at = ? WHERE id = ?").run(now, id);
  return getProductById(id);
}

export function setProductStockStatus(id: string, status: StockStatus): Product | null {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare("UPDATE products SET stock_status = ?, updated_at = ? WHERE id = ?").run(status, now, id);
  return getProductById(id);
}
