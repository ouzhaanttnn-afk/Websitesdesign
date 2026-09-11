export type AnalyticsEventName =
  | "page_view"
  | "product_view"
  | "price_view"
  | "price_request_click"
  | "price_request_created"
  | "whatsapp_click"
  | "reservation_click"
  | "reservation_created"
  | "similar_product_click";

export interface AnalyticsEventContext {
  productId?: string;
  sku?: string;
  category?: string;
  source?: string;
  page?: string;
}

export interface AnalyticsEvent extends AnalyticsEventContext {
  id: string;
  name: AnalyticsEventName;
  createdAt: string;
}
