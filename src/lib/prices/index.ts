import { MockPriceProvider } from "./mock-provider";
import type { PriceProvider } from "./types";

export type { PriceProvider, PriceQuote, PriceQuoteId, PriceSnapshot } from "./types";

/**
 * Uygulamanın kullandığı tek fiyat sağlayıcısı erişim noktası.
 *
 * Şimdilik hiçbir harici fiyat API'sine bağlanmıyoruz; mock veri döndüren
 * `MockPriceProvider` kullanılıyor. Gerçek bir piyasa veri kaynağı hazır
 * olduğunda, bu fonksiyonun döndürdüğü sınıfı değiştirmek yeterlidir —
 * bileşenler `PriceProvider` arayüzüyle konuştuğu için başka hiçbir yer
 * değişmez.
 */
export function getPriceProvider(): PriceProvider {
  return new MockPriceProvider();
}
