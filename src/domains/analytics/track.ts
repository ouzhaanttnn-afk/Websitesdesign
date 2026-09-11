"use client";

import type { AnalyticsEventContext, AnalyticsEventName } from "./types";

/**
 * İstemci tarafı event tracking soyutlaması. Hiçbir component analytics
 * sağlayıcısına (bu haliyle: kendi /api/analytics uç noktamız) doğrudan
 * bağımlı olmaz — ileride GA4/PostHog eklenecekse yalnızca bu dosya değişir.
 * `navigator.sendBeacon` kullanılır: sayfa hemen terk edilse bile (ör.
 * WhatsApp'a yönlenme) istek atılmış olur.
 */
export function trackEvent(name: AnalyticsEventName, context: AnalyticsEventContext = {}): void {
  try {
    const payload = JSON.stringify({ name, ...context, page: context.page ?? window.location.pathname });
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/analytics", blob);
    } else {
      fetch("/api/analytics", { method: "POST", body: payload, keepalive: true });
    }
  } catch {
    // Analytics hiçbir zaman kullanıcı akışını bozmamalı.
  }
}
