import type { PriceProvider, PriceQuote, PriceSnapshot } from "./types";

/**
 * Demo/mock veriyle çalışan fiyat sağlayıcısı. Hiçbir harici API'ye bağlanmaz.
 * Sadece arayüzün (UI) gerçek veriyle nasıl çalışacağını göstermek için
 * kullanılır. Gerçek bir kaynak (ör. bir borsa/veri sağlayıcı API'si)
 * bağlanacağında bu dosyanın yanına `live-provider.ts` gibi yeni bir sınıf
 * eklenip `getPriceProvider()` içinde seçilmesi yeterlidir — UI bileşenleri
 * değişmez.
 */
const MOCK_QUOTES: PriceQuote[] = [
  { id: "gram-altin", label: "Gram Altın", buy: 4123.5, sell: 4141.2, unit: "TRY / gr" },
  { id: "ceyrek-altin", label: "Çeyrek Altın", buy: 6842.0, sell: 6931.0, unit: "TRY / adet" },
  { id: "yarim-altin", label: "Yarım Altın", buy: 13684.0, sell: 13862.0, unit: "TRY / adet" },
  { id: "tam-altin", label: "Tam Altın", buy: 27368.0, sell: 27724.0, unit: "TRY / adet" },
  { id: "cumhuriyet-altini", label: "Cumhuriyet Altını", buy: 27920.0, sell: 28340.0, unit: "TRY / adet" },
  { id: "22-ayar-bilezik", label: "22 Ayar Bilezik", buy: 3874.0, sell: 3958.0, unit: "TRY / gr" },
  { id: "usd", label: "Dolar", buy: 34.18, sell: 34.32, unit: "TRY" },
  { id: "eur", label: "Euro", buy: 37.02, sell: 37.19, unit: "TRY" },
];

export class MockPriceProvider implements PriceProvider {
  async getSnapshot(): Promise<PriceSnapshot> {
    return {
      quotes: MOCK_QUOTES,
      updatedAt: new Date().toISOString(),
      isLive: false,
    };
  }
}
