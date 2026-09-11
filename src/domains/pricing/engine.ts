import type { Product } from "@/domains/products/types";
import type { MarketPrices } from "./types";

const KARAT_LABELS: Record<string, keyof Omit<MarketPrices, "updatedAt">> = {
  "24 Ayar": "gramAltin",
  "Gram Altın": "gramAltin",
  "22 Ayar": "ayar22",
  "18 Ayar": "ayar18",
  "14 Ayar": "ayar14",
};

function ratePerGram(karat: string | null, market: MarketPrices): number | null {
  if (!karat) return null;
  const field = KARAT_LABELS[karat];
  return field ? market[field] : null;
}

/**
 * Ürün satış fiyatı: metal değeri (gram × ayar birim fiyatı) + işçilik.
 * Bu formül tek merkezden (buradan) değiştirilebilir olacak şekilde
 * tasarlandı — hiçbir component kendi hesaplamasını yapmaz (bkz. proje
 * talebi §10). MANUAL modda admin'in girdiği sabit fiyat aynen döner.
 */
export function calculateProductPrice(product: Product, market: MarketPrices): number | null {
  if (product.pricingMode === "MANUAL") {
    return product.manualPrice;
  }

  if (!product.weightGram || product.weightGram <= 0) return null;
  const rate = ratePerGram(product.karat, market);
  if (rate == null) return null;

  const metalValue = product.weightGram * rate;
  const workmanship = product.workmanship ?? 0;
  return Math.round(metalValue + workmanship);
}

export const KARAT_OPTIONS = Object.keys(KARAT_LABELS).filter((k) => k !== "Gram Altın");
