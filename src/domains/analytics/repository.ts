import { randomUUID } from "node:crypto";
import { getDb } from "@/lib/db/client";
import type { AnalyticsEventContext, AnalyticsEventName } from "./types";

export function recordEvent(name: AnalyticsEventName, context: AnalyticsEventContext = {}): void {
  const db = getDb();
  db.prepare(
    `INSERT INTO analytics_events (id, name, product_id, sku, category, source, page, created_at)
     VALUES (?,?,?,?,?,?,?,?)`,
  ).run(
    randomUUID(),
    name,
    context.productId ?? null,
    context.sku ?? null,
    context.category ?? null,
    context.source ?? null,
    context.page ?? null,
    new Date().toISOString(),
  );
}

export function countEventsTodayByName(name: AnalyticsEventName): number {
  const db = getDb();
  const todayPrefix = new Date().toISOString().slice(0, 10);
  const row = db
    .prepare("SELECT COUNT(*) as count FROM analytics_events WHERE name = ? AND created_at LIKE ?")
    .get(name, `${todayPrefix}%`) as { count: number };
  return row.count;
}

export interface TopProductRow {
  productId: string;
  sku: string | null;
  count: number;
}

/** Bugün en çok "product_view" alan ürünler — dashboard'un "en çok ilgi gören ürünler" listesi için. */
export function getTopViewedProductsToday(limit = 5): TopProductRow[] {
  const db = getDb();
  const todayPrefix = new Date().toISOString().slice(0, 10);
  const rows = db
    .prepare(
      `SELECT product_id as productId, sku, COUNT(*) as count
       FROM analytics_events
       WHERE name = 'product_view' AND product_id IS NOT NULL AND created_at LIKE ?
       GROUP BY product_id
       ORDER BY count DESC
       LIMIT ?`,
    )
    .all(`${todayPrefix}%`, limit) as unknown as TopProductRow[];
  return rows;
}
