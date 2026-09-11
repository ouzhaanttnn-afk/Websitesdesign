import { Pool } from "pg";

/**
 * Kalıcı katman: Vercel Postgres (Neon) — proje "Storage" sekmesinden
 * bağlanınca `POSTGRES_URL` ortam değişkenini otomatik enjekte eder.
 *
 * ÖNCEKİ SÜRÜM (node:sqlite, os.tmpdir()) canlıda çalışmıyordu: Next.js'in
 * her route/sayfası Vercel'de ayrı bir serverless fonksiyon olarak
 * çalışabiliyor, her biri kendi izole `/tmp` dosya sistemine sahip — admin
 * panelinden eklenen bir ürün, müşterinin gördüğü sayfanın çalıştığı farklı
 * bir fonksiyon örneğinde hiç görünmüyordu. Gerçek, ağ üzerinden erişilen
 * bir veritabanı olmadan bu asla güvenilir çalışmaz — bu yüzden Postgres'e
 * geçildi.
 */
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

  var __alveraPool: Pool | undefined;

  var __alveraSchemaReady: Promise<void> | undefined;
}

function createPool(): Pool {
  const connectionString = process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error(
      "POSTGRES_URL tanımlı değil. Vercel projesinde Storage → Postgres bağlanmalı (bkz. README 'Veritabanı' bölümü).",
    );
  }
  const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
  // Boşta bekleyen bir bağlantıda ağ hatası oluşursa Node süreci çökertmesin.
  pool.on("error", (err) => {
    console.error("Postgres pool hatası:", err);
  });
  return pool;
}

async function ensureSchema(pool: Pool): Promise<void> {
  await pool.query(SCHEMA);
  const now = new Date().toISOString();
  for (const row of DEFAULT_MARKET_PRICES) {
    await pool.query(
      `INSERT INTO market_prices (key, label, value, updated_at) VALUES ($1, $2, $3, $4)
       ON CONFLICT (key) DO NOTHING`,
      [row.key, row.label, row.value, now],
    );
  }
}

/** Süreç genelinde tek bir pool + tek seferlik şema kurulumu (globalThis'e cache'lenir). */
export async function getDb(): Promise<Pool> {
  if (!globalThis.__alveraPool) {
    globalThis.__alveraPool = createPool();
  }
  if (!globalThis.__alveraSchemaReady) {
    globalThis.__alveraSchemaReady = ensureSchema(globalThis.__alveraPool);
  }
  await globalThis.__alveraSchemaReady;
  return globalThis.__alveraPool;
}
