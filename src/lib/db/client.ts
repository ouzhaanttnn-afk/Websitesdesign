import { DatabaseSync } from "node:sqlite";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

/**
 * V0.1 kalıcı katmanı: Node'un yerleşik `node:sqlite` modülü (Node 22.5+,
 * deneysel — derleme gerektirmeyen tek bağımlılıksız seçenek, bkz.
 * package.json `engines`). Dosya `.data/alvera.db` içinde tutulur ve
 * `.gitignore`'da hariç tutulur.
 *
 * ÖNEMLİ SINIRLAMA: Vercel'in serverless ortamında dosya sistemi kalıcı
 * değildir — her yeni deploy/soğuk başlatmada veri sıfırlanabilir. Bu,
 * kullanıcıyla netleştirilmiş, bilinçli bir V0.1 kararıdır (gerçek bir
 * Postgres/Supabase bağlanana kadar). Geçiş şu şekilde yapılır: bu
 * dosyadaki `getDb()` ve her domain'in `repository.ts` dosyası, aynı
 * fonksiyon imzalarını koruyarak gerçek bir istemciye (ör. `pg`,
 * `@supabase/supabase-js`) yönlendirilir — üst katmanlar (API route'lar,
 * sayfalar) hiç değişmez.
 */
const DB_DIR = join(process.cwd(), ".data");
const DB_PATH = join(DB_DIR, "alvera.db");

const SCHEMA = `
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  images TEXT NOT NULL DEFAULT '[]',
  karat TEXT,
  weight_gram REAL,
  workmanship REAL,
  pricing_mode TEXT NOT NULL DEFAULT 'MANUAL',
  manual_price REAL,
  stock_status TEXT NOT NULL DEFAULT 'AVAILABLE',
  is_visible INTEGER NOT NULL DEFAULT 1,
  featured INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  product_id TEXT,
  product_sku TEXT,
  product_name TEXT,
  customer_name TEXT,
  customer_phone TEXT,
  message TEXT,
  source TEXT,
  page_url TEXT,
  status TEXT NOT NULL DEFAULT 'NEW',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS market_prices (
  key TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  value REAL NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  product_id TEXT,
  sku TEXT,
  category TEXT,
  source TEXT,
  page TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_products_status ON products(stock_status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_events_name ON analytics_events(name);
CREATE INDEX IF NOT EXISTS idx_events_created ON analytics_events(created_at);
`;

const DEFAULT_MARKET_PRICES: Array<{ key: string; label: string; value: number }> = [
  { key: "gram_altin", label: "Gram Altın (24 Ayar)", value: 6800 },
  { key: "ayar22", label: "22 Ayar", value: 6230 },
  { key: "ayar18", label: "18 Ayar", value: 5100 },
  { key: "ayar14", label: "14 Ayar", value: 3970 },
  { key: "usd", label: "Dolar", value: 48.5 },
  { key: "eur", label: "Euro", value: 56.1 },
];

declare global {
   
  var __alveraDb: DatabaseSync | undefined;
}

function seedDefaults(db: DatabaseSync) {
  const now = new Date().toISOString();
  const insert = db.prepare(
    `INSERT OR IGNORE INTO market_prices (key, label, value, updated_at) VALUES (?, ?, ?, ?)`,
  );
  for (const row of DEFAULT_MARKET_PRICES) {
    insert.run(row.key, row.label, row.value, now);
  }
}

function createDatabase(): DatabaseSync {
  if (!existsSync(DB_DIR)) mkdirSync(DB_DIR, { recursive: true });
  const db = new DatabaseSync(DB_PATH);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec(SCHEMA);
  seedDefaults(db);
  return db;
}

/** Süreç genelinde tek bir bağlantı (dev'de hot-reload'da yeniden açılmasın diye globalThis'e cache'lenir). */
export function getDb(): DatabaseSync {
  if (!globalThis.__alveraDb) {
    globalThis.__alveraDb = createDatabase();
  }
  return globalThis.__alveraDb;
}
