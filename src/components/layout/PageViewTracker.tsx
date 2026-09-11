"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/domains/analytics/track";

/** Dashboard'daki "Ziyaret" sayısı için — her sayfa geçişinde bir `page_view` olayı kaydeder. */
export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackEvent("page_view", { page: pathname ?? undefined });
  }, [pathname]);

  return null;
}
