import { randomUUID } from "node:crypto";
import { getDb } from "@/lib/db/client";
import type { AnalyticsEventContext, AnalyticsEventName } from "./types";

export async function recordEvent(name: AnalyticsEventName, context: AnalyticsEventContext = {}): Promise<void> {
  const db = await getDb();
  await db.query(
    `INSERT INTO analytics_events (id, name, product_id, sku, category, source, page, created_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [
      randomUUID(),
      name,
      context.productId ?? null,
      context.sku ?? null,
      context.category ?? null,
      context.source ?? null,
      context.page ?? null,
      new Date().toISOString(),
    ],
  );
}

export async function countEventsTodayByName(name: AnalyticsEventName): Promise<number> {
  const db = await getDb();
  const todayPrefix = new Date().toISOString().slice(0, 10);
  const { rows } = await db.query(
    "SELECT COUNT(*)::int as count FROM analytics_events WHERE name = $1 AND created_at LIKE $2",
    [name, `${todayPrefix}%`],
  );
  return (rows[0] as { count: number }).count;
}

export interface TopProductRow {
  productId: string;
  sku: string | null;
  count: number;
}

/** Bugün en çok "product_view" alan ürünler — dashboard'un "en çok ilgi gören ürünler" listesi için. */
export async function getTopViewedProductsToday(limit = 5): Promise<TopProductRow[]> {
  const db = await getDb();
  const todayPrefix = new Date().toISOString().slice(0, 10);
  const { rows } = await db.query(
    `SELECT product_id as "productId", MAX(sku) as sku, COUNT(*)::int as count
     FROM analytics_events
     WHERE name = 'product_view' AND product_id IS NOT NULL AND created_at LIKE $1
     GROUP BY product_id
     ORDER BY count DESC
     LIMIT $2`,
    [`${todayPrefix}%`, limit],
  );
  return rows as TopProductRow[];
}
