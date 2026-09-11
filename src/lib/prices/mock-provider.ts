import type { PriceProvider, PriceQuote, PriceSnapshot } from "./types";

/**
 * Demo veriyle çalışan yedek fiyat sağlayıcısı. Hiçbir harici API'ye
 * bağlanmaz. `OzanDovizPriceProvider` (bkz. live-provider.ts) bir sebeple
 * başarısız olursa `ResilientPriceProvider` otomatik olarak buna döner —
 * böylece fiyatlar sayfası hiçbir zaman kırılmaz. Değerler, canlı kaynağın
 * o anki mertebesine yakın tutuldu (gerçek veri değil).
 */
const MOCK_QUOTES: PriceQuote[] = [
  { id: "has-altin", label: "Has Altın", buy: 6700.0, sell: 6760.0, unit: "TRY / gr" },
  { id: "gram-altin", label: "Gram Altın", buy: 6670.0, sell: 6785.0, unit: "TRY / gr" },
  { id: "ceyrek-altin", label: "Çeyrek Altın", buy: 10850.0, sell: 11050.0, unit: "TRY / adet" },
  { id: "yarim-altin", label: "Yarım Altın", buy: 21700.0, sell: 22100.0, unit: "TRY / adet" },
  { id: "tam-altin", label: "Tam Altın", buy: 43300.0, sell: 44000.0, unit: "TRY / adet" },
  { id: "ata-besli", label: "Ata Beşli", buy: 222500.0, sell: 226000.0, unit: "TRY / adet" },
  { id: "usd", label: "Dolar", buy: 48.4, sell: 48.6, unit: "TRY" },
  { id: "eur", label: "Euro", buy: 55.95, sell: 56.35, unit: "TRY" },
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
