import { getDb } from "@/lib/db/client";
import type { MarketPriceKey, MarketPrices } from "./types";

interface MarketPriceRow {
  key: string;
  label: string;
  value: number;
  updated_at: string;
}

const KEY_TO_FIELD: Record<MarketPriceKey, keyof Omit<MarketPrices, "updatedAt">> = {
  gram_altin: "gramAltin",
  ayar22: "ayar22",
  ayar18: "ayar18",
  ayar14: "ayar14",
  usd: "usd",
  eur: "eur",
};

export interface MarketPriceRowView {
  key: MarketPriceKey;
  label: string;
  value: number;
  updatedAt: string;
}

export function getMarketPriceRows(): MarketPriceRowView[] {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM market_prices ORDER BY key").all() as unknown as MarketPriceRow[];
  return rows.map((r) => ({ key: r.key as MarketPriceKey, label: r.label, value: r.value, updatedAt: r.updated_at }));
}

export function getMarketPrices(): MarketPrices {
  const rows = getMarketPriceRows();
  const byKey = new Map(rows.map((r) => [r.key, r]));
  const latestUpdate = rows.reduce((acc, r) => (r.updatedAt > acc ? r.updatedAt : acc), rows[0]?.updatedAt ?? new Date().toISOString());

  const result = {} as MarketPrices;
  for (const key of Object.keys(KEY_TO_FIELD) as MarketPriceKey[]) {
    result[KEY_TO_FIELD[key]] = byKey.get(key)?.value ?? 0;
  }
  result.updatedAt = latestUpdate;
  return result;
}

export function updateMarketPrice(key: MarketPriceKey, value: number): void {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare("UPDATE market_prices SET value = ?, updated_at = ? WHERE key = ?").run(value, now, key);
}

export function updateMarketPrices(values: Partial<Record<MarketPriceKey, number>>): void {
  const db = getDb();
  const now = new Date().toISOString();
  const stmt = db.prepare("UPDATE market_prices SET value = ?, updated_at = ? WHERE key = ?");
  for (const [key, value] of Object.entries(values)) {
    if (typeof value === "number" && Number.isFinite(value)) {
      stmt.run(value, now, key);
    }
  }
}
