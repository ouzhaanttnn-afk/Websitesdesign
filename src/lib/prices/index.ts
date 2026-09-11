import { MockPriceProvider } from "./mock-provider";
import { OzanDovizPriceProvider } from "./live-provider";
import { ResilientPriceProvider } from "./resilient-provider";
import type { PriceProvider } from "./types";

export type { PriceProvider, PriceQuote, PriceQuoteId, PriceSnapshot } from "./types";

/**
 * Uygulamanın kullandığı tek fiyat sağlayıcısı erişim noktası.
 *
 * Canlı kaynak (Ozan Döviz) başarısız olursa `ResilientPriceProvider`
 * otomatik olarak `MockPriceProvider`'a döner — bileşenler her zaman
 * `PriceProvider` arayüzüyle konuşur, hangi sağlayıcının aktif olduğunu
 * bilmez. Farklı/ek bir kaynak bağlanacağında tek yapılması gereken bu
 * fonksiyonun döndürdüğü sınıfı değiştirmektir.
 */
export function getPriceProvider(): PriceProvider {
  return new ResilientPriceProvider(new OzanDovizPriceProvider(), new MockPriceProvider());
}
