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
  { id: "ceyrek-yeni", label: "Çeyrek Altın (Yeni)", buy: 10870.0, sell: 11060.0, unit: "TRY / adet" },
  { id: "ceyrek-eski", label: "Çeyrek Altın (Eski)", buy: 10740.0, sell: 10850.0, unit: "TRY / adet" },
  { id: "yarim-yeni", label: "Yarım Altın (Yeni)", buy: 21780.0, sell: 22100.0, unit: "TRY / adet" },
  { id: "yarim-eski", label: "Yarım Altın (Eski)", buy: 21480.0, sell: 21680.0, unit: "TRY / adet" },
  { id: "tam-yeni", label: "Tam Altın (Yeni)", buy: 43420.0, sell: 44020.0, unit: "TRY / adet" },
  { id: "tam-eski", label: "Tam Altın (Eski)", buy: 42970.0, sell: 43350.0, unit: "TRY / adet" },
  { id: "gremse-yeni", label: "Gremse Altın (Yeni)", buy: 108100.0, sell: 109670.0, unit: "TRY / adet" },
  { id: "gremse-eski", label: "Gremse Altın (Eski)", buy: 107400.0, sell: 108450.0, unit: "TRY / adet" },
  { id: "ata-lirasi-yeni", label: "Ata Lirası (Yeni)", buy: 44240.0, sell: 45220.0, unit: "TRY / adet" },
  { id: "ata-lirasi-eski", label: "Ata Lirası (Eski)", buy: 44250.0, sell: 44640.0, unit: "TRY / adet" },
  { id: "ata-besli-yeni", label: "Ata Beşli (Yeni)", buy: 223200.0, sell: 226100.0, unit: "TRY / adet" },
  { id: "ata-besli-eski", label: "Ata Beşli (Eski)", buy: 220900.0, sell: 223900.0, unit: "TRY / adet" },
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
