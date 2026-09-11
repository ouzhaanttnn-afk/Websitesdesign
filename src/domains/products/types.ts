import type { Category } from "@/config/categories";

export type ProductCategory = Category["slug"];

/**
 * AVAILABLE: normal gösterilir.
 * RESERVED: "Rezerve" etiketiyle gösterilir, hâlâ görünür.
 * SOLD: sayfa korunur ("Satıldı" + benzer ürün/"Benzerini sor" akışı) — asla 404 değildir.
 * HIDDEN: müşteriye hiç gösterilmez.
 */
export type StockStatus = "AVAILABLE" | "RESERVED" | "SOLD" | "HIDDEN";

export type PricingMode = "MANUAL" | "CALCULATED";

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  category: ProductCategory;
  description: string;
  /** data: URI'ler veya /uploads yolları — bkz. domains/products/images.ts */
  images: string[];
  karat: string | null;
  weightGram: number | null;
  workmanship: number | null;
  pricingMode: PricingMode;
  manualPrice: number | null;
  stockStatus: StockStatus;
  isVisible: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductInput {
  sku: string;
  name: string;
  category: ProductCategory;
  description: string;
  images: string[];
  karat: string | null;
  weightGram: number | null;
  workmanship: number | null;
  pricingMode: PricingMode;
  manualPrice: number | null;
  stockStatus: StockStatus;
  isVisible: boolean;
  featured: boolean;
}

export interface ProductFilter {
  category?: ProductCategory;
  stockStatus?: StockStatus;
  query?: string;
  /** false ise HIDDEN olanlar da dahil edilir (admin listesi için) */
  visibleOnly?: boolean;
}
