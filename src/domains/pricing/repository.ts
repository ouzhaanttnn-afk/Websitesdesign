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

export async function getMarketPriceRows(): Promise<MarketPriceRowView[]> {
  const db = await getDb();
  const { rows } = await db.query("SELECT * FROM market_prices ORDER BY key");
  return (rows as MarketPriceRow[]).map((r) => ({
    key: r.key as MarketPriceKey,
    label: r.label,
    value: r.value,
    updatedAt: r.updated_at,
  }));
}

export async function getMarketPrices(): Promise<MarketPrices> {
  const rows = await getMarketPriceRows();
  const byKey = new Map(rows.map((r) => [r.key, r]));
  const latestUpdate = rows.reduce(
    (acc, r) => (r.updatedAt > acc ? r.updatedAt : acc),
    rows[0]?.updatedAt ?? new Date().toISOString(),
  );

  const result = {} as MarketPrices;
  for (const key of Object.keys(KEY_TO_FIELD) as MarketPriceKey[]) {
    result[KEY_TO_FIELD[key]] = byKey.get(key)?.value ?? 0;
  }
  result.updatedAt = latestUpdate;
  return result;
}

export async function updateMarketPrice(key: MarketPriceKey, value: number): Promise<void> {
  const db = await getDb();
  const now = new Date().toISOString();
  await db.query("UPDATE market_prices SET value = $1, updated_at = $2 WHERE key = $3", [value, now, key]);
}

export async function updateMarketPrices(values: Partial<Record<MarketPriceKey, number>>): Promise<void> {
  const db = await getDb();
  const now = new Date().toISOString();
  for (const [key, value] of Object.entries(values)) {
    if (typeof value === "number" && Number.isFinite(value)) {
      await db.query("UPDATE market_prices SET value = $1, updated_at = $2 WHERE key = $3", [value, now, key]);
    }
  }
}
