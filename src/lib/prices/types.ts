export type PriceQuoteId =
  | "has-altin"
  | "gram-altin"
  | "ceyrek-altin"
  | "yarim-altin"
  | "tam-altin"
  | "ata-besli"
  | "usd"
  | "eur";

export interface PriceQuote {
  id: PriceQuoteId;
  label: string;
  /** Alış fiyatı (TRY) */
  buy: number;
  /** Satış fiyatı (TRY) */
  sell: number;
  unit: string;
}

export interface PriceSnapshot {
  quotes: PriceQuote[];
  updatedAt: string;
  /** Gösterilen verinin gerçek piyasa verisi olup olmadığını belirtir. */
  isLive: boolean;
  /** isLive true ise veri kaynağının okunabilir adı (ör. "Ozan Döviz"). */
  source?: string;
}

/**
 * Fiyat kaynağı soyutlaması. UI bileşenleri asla ham fiyat verisiyle veya
 * belirli bir sağlayıcının API şekliyle konuşmaz — yalnızca bu arayüzle
 * konuşur. Gerçek bir piyasa veri kaynağı bağlanacağı zaman tek yapılması
 * gereken `PriceProvider`'ı uygulayan yeni bir sınıf yazıp
 * `src/lib/prices/index.ts` içinde onu döndürmektir.
 */
export interface PriceProvider {
  getSnapshot(): Promise<PriceSnapshot>;
}
