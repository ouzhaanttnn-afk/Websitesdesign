"use client";

import { useEffect } from "react";
import { trackEvent } from "@/domains/analytics/track";

export function ProductViewTracker({
  productId,
  sku,
  category,
  hasPrice,
}: {
  productId: string;
  sku: string;
  category: string;
  hasPrice: boolean;
}) {
  useEffect(() => {
    trackEvent("product_view", { productId, sku, category });
    if (hasPrice) {
      trackEvent("price_view", { productId, sku, category });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  return null;
}
