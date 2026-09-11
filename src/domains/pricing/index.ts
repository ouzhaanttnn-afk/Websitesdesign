import { ManualPriceProvider } from "./manual-provider";
import type { PriceProvider } from "./types";

export function getPricingProvider(): PriceProvider {
  return new ManualPriceProvider();
}

export * from "./types";
export * from "./engine";
