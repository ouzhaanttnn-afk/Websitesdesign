/**
 * ÜRÜN fiyatlandırma için piyasa değerleri. `/fiyatlar` sayfasındaki genel
 * altın/döviz ticker'ıyla (bkz. src/lib/prices/) KARIŞTIRILMAMALIDIR — o,
 * ziyaretçiye "bugün altın ne kadar" göstermek için var; bu ise admin'in
 * merkezi olarak girdiği, ürün satış fiyatı hesaplamada kullanılan
 * değerlerdir. İkisi kasıtlı olarak ayrı domain'lerdir.
 */
export interface MarketPrices {
  gramAltin: number;
  ayar22: number;
  ayar18: number;
  ayar14: number;
  usd: number;
  eur: number;
  updatedAt: string;
}

export type MarketPriceKey = "gram_altin" | "ayar22" | "ayar18" | "ayar14" | "usd" | "eur";

/**
 * Gerçek harici bir altın/döviz API'si V0.1'de bağlanmıyor (bkz. proje
 * talebi §10) — ama arayüz buna hazır: ileride `LivePriceProvider` yazıp
 * `getPricingProvider()` içinde döndürmek yeterli, hiçbir çağıran kod
 * değişmez.
 */
export interface PriceProvider {
  getPrices(): Promise<MarketPrices>;
}
