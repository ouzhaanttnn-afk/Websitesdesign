"use client";

import { useState } from "react";
import { trackEvent } from "@/domains/analytics/track";
import { createWhatsAppMessage, createSimilarProductWhatsAppMessage, buildWhatsAppUrl } from "@/domains/whatsapp/message";
import type { StockStatus } from "@/domains/products/types";
import { QuickLeadModal } from "./QuickLeadModal";

interface ProductActionsProduct {
  id: string;
  sku: string;
  name: string;
  slug: string;
  stockStatus: StockStatus;
}

function recordWhatsAppLead(product: ProductActionsProduct) {
  fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "WHATSAPP",
      productId: product.id,
      source: "product_page",
      pageUrl: window.location.href,
    }),
    keepalive: true,
  }).catch(() => {});
}

/**
 * Ürün sayfasındaki tüm dönüşüm aksiyonlarının tek kaynağı: normal CTA
 * satırı (her ekran boyutunda) + mobilde ekranın altına yapışan kısa
 * conversion bar (bkz. proje talebi §4) — aynı state/modal'ı paylaşır,
 * ikisi de ayrı bileşenler olarak çoğaltılmaz.
 */
export function ProductActions({ product }: { product: ProductActionsProduct }) {
  const [modalMode, setModalMode] = useState<"PRICE_REQUEST" | "RESERVATION" | null>(null);

  const whatsappUrl = buildWhatsAppUrl(createWhatsAppMessage(product));
  const similarWhatsappUrl = buildWhatsAppUrl(createSimilarProductWhatsAppMessage(product));

  function openPriceRequest() {
    trackEvent("price_request_click", { productId: product.id, sku: product.sku });
    setModalMode("PRICE_REQUEST");
  }

  function openReservation() {
    trackEvent("reservation_click", { productId: product.id, sku: product.sku });
    setModalMode("RESERVATION");
  }

  function handleWhatsAppClick() {
    trackEvent("whatsapp_click", { productId: product.id, sku: product.sku, source: "product_page" });
    recordWhatsAppLead(product);
  }

  if (product.stockStatus === "SOLD") {
    return (
      <a
        href={similarWhatsappUrl}
        target="_blank"
        rel="noreferrer noopener"
        onClick={() => trackEvent("whatsapp_click", { productId: product.id, sku: product.sku, source: "sold_similar" })}
        className="inline-flex items-center justify-center gap-2 rounded bg-ink px-8 py-4 text-body-sm font-medium text-canvas transition-colors duration-300 ease-quiet hover:bg-ink/90"
      >
        Benzerini WhatsApp&apos;tan Sor
      </a>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={openPriceRequest}
          className="inline-flex items-center justify-center gap-2 rounded bg-ink px-8 py-4 text-body-sm font-medium text-canvas transition-colors duration-300 ease-quiet hover:bg-ink/90"
        >
          Fiyat Sor
        </button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer noopener"
          onClick={handleWhatsAppClick}
          className="inline-flex items-center justify-center gap-2 rounded border border-border px-8 py-4 text-body-sm font-medium text-ink transition-colors duration-300 ease-quiet hover:bg-surface-alt"
        >
          WhatsApp&apos;tan Sor
        </a>
        {product.stockStatus === "AVAILABLE" && (
          <button
            type="button"
            onClick={openReservation}
            className="inline-flex items-center justify-center gap-2 rounded border border-border px-8 py-4 text-body-sm font-medium text-ink transition-colors duration-300 ease-quiet hover:bg-surface-alt"
          >
            Mağazada Ayırt
          </button>
        )}
      </div>

      {/* Mobil sticky conversion bar — sade, iki birincil aksiyon, iOS güvenli alan destekli. */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-border bg-surface/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-[2px] sm:hidden">
        <button
          type="button"
          onClick={openPriceRequest}
          className="flex-1 rounded bg-ink px-4 py-3 text-body-sm font-medium text-canvas"
        >
          Fiyat Sor
        </button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer noopener"
          onClick={handleWhatsAppClick}
          className="flex flex-1 items-center justify-center rounded bg-[#25D366] px-4 py-3 text-body-sm font-medium text-white"
        >
          WhatsApp
        </a>
      </div>
      {/* Sticky bar'ın içerik üstünü kapatmaması için mobilde alt boşluk. */}
      <div className="h-20 sm:hidden" aria-hidden="true" />

      {modalMode && (
        <QuickLeadModal open mode={modalMode} product={product} onClose={() => setModalMode(null)} />
      )}
    </>
  );
}
