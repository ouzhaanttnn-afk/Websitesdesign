import type { MarketPrices, PriceProvider } from "./types";

/** Demo/test amaçlı sabit değerler — DB'ye hiç dokunmaz. Gelecekte test/preview ortamlarında kullanılabilir. */
export class MockPriceProvider implements PriceProvider {
  async getPrices(): Promise<MarketPrices> {
    return {
      gramAltin: 6800,
      ayar22: 6230,
      ayar18: 5100,
      ayar14: 3970,
      usd: 48.5,
      eur: 56.1,
      updatedAt: new Date().toISOString(),
    };
  }
}
