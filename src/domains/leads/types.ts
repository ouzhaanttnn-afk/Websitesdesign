export type LeadType = "PRICE_REQUEST" | "WHATSAPP" | "RESERVATION" | "PRODUCT_INFO" | "SIMILAR_PRODUCT";

export type LeadStatus = "NEW" | "CONTACTED" | "WON" | "LOST";

export interface Lead {
  id: string;
  type: LeadType;
  productId: string | null;
  productSku: string | null;
  productName: string | null;
  customerName: string | null;
  customerPhone: string | null;
  message: string | null;
  source: string | null;
  pageUrl: string | null;
  status: LeadStatus;
  createdAt: string;
}

export interface LeadInput {
  type: LeadType;
  productId?: string | null;
  productSku?: string | null;
  productName?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  message?: string | null;
  source?: string | null;
  pageUrl?: string | null;
}

export interface LeadFilter {
  status?: LeadStatus;
  type?: LeadType;
}
