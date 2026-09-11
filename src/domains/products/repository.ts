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

async function slugExists(slug: string, excludeId?: string): Promise<boolean> {
  const db = await getDb();
  const { rows } = await db.query(
    `SELECT id FROM products WHERE slug = $1 ${excludeId ? "AND id != $2" : ""}`,
    excludeId ? [slug, excludeId] : [slug],
  );
  return rows.length > 0;
}

export async function listProducts(filter: ProductFilter = {}): Promise<Product[]> {
  const db = await getDb();
  const clauses: string[] = [];
  const params: (string | number)[] = [];

  if (filter.category) {
    params.push(filter.category);
    clauses.push(`category = $${params.length}`);
  }
  if (filter.stockStatus) {
    params.push(filter.stockStatus);
    clauses.push(`stock_status = $${params.length}`);
  }
  if (filter.visibleOnly) {
    clauses.push("is_visible = 1 AND stock_status != 'HIDDEN'");
  }
  if (filter.query) {
    const like = `%${filter.query}%`;
    params.push(like);
    const namePos = params.length;
    params.push(like);
    const skuPos = params.length;
    clauses.push(`(name ILIKE $${namePos} OR sku ILIKE $${skuPos})`);
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const { rows } = await db.query(`SELECT * FROM products ${where} ORDER BY created_at DESC`, params);
  return (rows as ProductRow[]).map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const db = await getDb();
  const { rows } = await db.query("SELECT * FROM products WHERE slug = $1", [slug]);
  return rows[0] ? toProduct(rows[0] as ProductRow) : null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = await getDb();
  const { rows } = await db.query("SELECT * FROM products WHERE id = $1", [id]);
  return rows[0] ? toProduct(rows[0] as ProductRow) : null;
}

/** Görünür/satılabilir ürünler arasından, aynı kategoriden, verilen ürün hariç. "Benzer ürünler" için. */
export async function listSimilarProducts(product: Product, limit = 4): Promise<Product[]> {
  const db = await getDb();
  const { rows } = await db.query(
    `SELECT * FROM products
     WHERE category = $1 AND id != $2 AND is_visible = 1 AND stock_status IN ('AVAILABLE','RESERVED')
     ORDER BY created_at DESC LIMIT $3`,
    [product.category, product.id, limit],
  );
  return (rows as ProductRow[]).map(toProduct);
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const db = await getDb();
  const id = randomUUID();
  const now = new Date().toISOString();
  const slug = await uniqueSlug(input.name, (candidate) => slugExists(candidate));

  await db.query(
    `INSERT INTO products
      (id, sku, slug, name, category, description, images, karat, weight_gram, workmanship,
       pricing_mode, manual_price, stock_status, is_visible, featured, created_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
    [
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
    ],
  );

  return (await getProductById(id)) as Product;
}

export async function updateProduct(id: string, input: Partial<ProductInput>): Promise<Product | null> {
  const existing = await getProductById(id);
  if (!existing) return null;
  const db = await getDb();
  const now = new Date().toISOString();

  const next = { ...existing, ...input };
  const slug =
    input.name && input.name !== existing.name
      ? await uniqueSlug(input.name, (candidate) => slugExists(candidate, id))
      : existing.slug;

  await db.query(
    `UPDATE products SET
      sku=$1, slug=$2, name=$3, category=$4, description=$5, images=$6, karat=$7, weight_gram=$8,
      workmanship=$9, pricing_mode=$10, manual_price=$11, stock_status=$12, is_visible=$13, featured=$14, updated_at=$15
     WHERE id=$16`,
    [
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
    ],
  );

  return getProductById(id);
}

/** Hızlı "SATILDI" aksiyonu — admin ürün listesinde tek dokunuşla. */
export async function markProductSold(id: string): Promise<Product | null> {
  const db = await getDb();
  const now = new Date().toISOString();
  await db.query("UPDATE products SET stock_status = 'SOLD', updated_at = $1 WHERE id = $2", [now, id]);
  return getProductById(id);
}

export async function setProductStockStatus(id: string, status: StockStatus): Promise<Product | null> {
  const db = await getDb();
  const now = new Date().toISOString();
  await db.query("UPDATE products SET stock_status = $1, updated_at = $2 WHERE id = $3", [status, now, id]);
  return getProductById(id);
}
