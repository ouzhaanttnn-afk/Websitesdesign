import type { Product } from "@/domains/products/types";
import { contact } from "@/config/contact";
import { siteUrl } from "@/lib/site-url";

/**
 * WhatsApp mesajını tek yerden üretir — bileşenler kendi mesaj metnini
 * yazmaz. Kısa ve doğal tutulur (bkz. proje talebi §6).
 */
export function createWhatsAppMessage(product: Pick<Product, "sku" | "name" | "slug">): string {
  const url = `${siteUrl}/urun/${product.slug}`;
  return `Merhaba, Alvera Kuyumculuk web sitesinden ulaşıyorum.\n\n${product.sku} kodlu ${product.name} hakkında güncel fiyat ve bilgi almak istiyorum.\n\nÜrün:\n${url}`;
}

export function createSimilarProductWhatsAppMessage(product: Pick<Product, "sku" | "name" | "slug">): string {
  const url = `${siteUrl}/urun/${product.slug}`;
  return `Merhaba, Alvera Kuyumculuk web sitesinden ulaşıyorum.\n\n${product.sku} kodlu ${product.name} satılmış görünüyor. Benzer bir model için bilgi almak istiyorum.\n\nÜrün:\n${url}`;
}

export function buildWhatsAppUrl(message: string): string {
  return `${contact.whatsappHref}?text=${encodeURIComponent(message)}`;
}
