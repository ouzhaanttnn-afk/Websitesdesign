import type { MarketPrices, PriceProvider } from "./types";
import { getMarketPrices } from "./repository";

/** Admin'in "Piyasa Ayarları" ekranından girdiği değerleri okur. V0.1'de varsayılan aktif sağlayıcı. */
export class ManualPriceProvider implements PriceProvider {
  async getPrices(): Promise<MarketPrices> {
    return getMarketPrices();
  }
}
