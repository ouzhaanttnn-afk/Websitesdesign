import { randomUUID } from "node:crypto";
import { getDb } from "@/lib/db/client";
import type { Lead, LeadFilter, LeadInput, LeadStatus } from "./types";

interface LeadRow {
  id: string;
  type: string;
  product_id: string | null;
  product_sku: string | null;
  product_name: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  message: string | null;
  source: string | null;
  page_url: string | null;
  status: string;
  created_at: string;
}

function toLead(row: LeadRow): Lead {
  return {
    id: row.id,
    type: row.type as Lead["type"],
    productId: row.product_id,
    productSku: row.product_sku,
    productName: row.product_name,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    message: row.message,
    source: row.source,
    pageUrl: row.page_url,
    status: row.status as LeadStatus,
    createdAt: row.created_at,
  };
}

export function createLead(input: LeadInput): Lead {
  const db = getDb();
  const id = randomUUID();
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO leads
      (id, type, product_id, product_sku, product_name, customer_name, customer_phone, message, source, page_url, status, created_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,'NEW',?)`,
  ).run(
    id,
    input.type,
    input.productId ?? null,
    input.productSku ?? null,
    input.productName ?? null,
    input.customerName ?? null,
    input.customerPhone ?? null,
    input.message ?? null,
    input.source ?? null,
    input.pageUrl ?? null,
    now,
  );

  const row = db.prepare("SELECT * FROM leads WHERE id = ?").get(id) as unknown as LeadRow;
  return toLead(row);
}

export function listLeads(filter: LeadFilter = {}): Lead[] {
  const db = getDb();
  const clauses: string[] = [];
  const params: string[] = [];
  if (filter.status) {
    clauses.push("status = ?");
    params.push(filter.status);
  }
  if (filter.type) {
    clauses.push("type = ?");
    params.push(filter.type);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const rows = db
    .prepare(`SELECT * FROM leads ${where} ORDER BY created_at DESC`)
    .all(...params) as unknown as LeadRow[];
  return rows.map(toLead);
}

export function getLeadById(id: string): Lead | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM leads WHERE id = ?").get(id) as LeadRow | undefined;
  return row ? toLead(row) : null;
}

export function updateLeadStatus(id: string, status: LeadStatus): Lead | null {
  const db = getDb();
  db.prepare("UPDATE leads SET status = ? WHERE id = ?").run(status, id);
  return getLeadById(id);
}

export function countLeadsByStatus(): Record<LeadStatus, number> {
  const db = getDb();
  const rows = db.prepare("SELECT status, COUNT(*) as count FROM leads GROUP BY status").all() as unknown as {
    status: LeadStatus;
    count: number;
  }[];
  const result: Record<LeadStatus, number> = { NEW: 0, CONTACTED: 0, WON: 0, LOST: 0 };
  for (const row of rows) result[row.status] = row.count;
  return result;
}

export function countLeadsToday(): number {
  const db = getDb();
  const todayPrefix = new Date().toISOString().slice(0, 10);
  const row = db
    .prepare("SELECT COUNT(*) as count FROM leads WHERE created_at LIKE ?")
    .get(`${todayPrefix}%`) as { count: number };
  return row.count;
}

export function countLeadsTodayByType(type: Lead["type"]): number {
  const db = getDb();
  const todayPrefix = new Date().toISOString().slice(0, 10);
  const row = db
    .prepare("SELECT COUNT(*) as count FROM leads WHERE type = ? AND created_at LIKE ?")
    .get(type, `${todayPrefix}%`) as { count: number };
  return row.count;
}
