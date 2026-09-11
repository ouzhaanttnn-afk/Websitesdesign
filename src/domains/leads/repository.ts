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

export async function createLead(input: LeadInput): Promise<Lead> {
  const db = await getDb();
  const id = randomUUID();
  const now = new Date().toISOString();

  await db.query(
    `INSERT INTO leads
      (id, type, product_id, product_sku, product_name, customer_name, customer_phone, message, source, page_url, status, created_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'NEW',$11)`,
    [
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
    ],
  );

  const { rows } = await db.query("SELECT * FROM leads WHERE id = $1", [id]);
  return toLead(rows[0] as LeadRow);
}

export async function listLeads(filter: LeadFilter = {}): Promise<Lead[]> {
  const db = await getDb();
  const clauses: string[] = [];
  const params: string[] = [];
  if (filter.status) {
    params.push(filter.status);
    clauses.push(`status = $${params.length}`);
  }
  if (filter.type) {
    params.push(filter.type);
    clauses.push(`type = $${params.length}`);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const { rows } = await db.query(`SELECT * FROM leads ${where} ORDER BY created_at DESC`, params);
  return (rows as LeadRow[]).map(toLead);
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const db = await getDb();
  const { rows } = await db.query("SELECT * FROM leads WHERE id = $1", [id]);
  return rows[0] ? toLead(rows[0] as LeadRow) : null;
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<Lead | null> {
  const db = await getDb();
  await db.query("UPDATE leads SET status = $1 WHERE id = $2", [status, id]);
  return getLeadById(id);
}

export async function countLeadsByStatus(): Promise<Record<LeadStatus, number>> {
  const db = await getDb();
  const { rows } = await db.query("SELECT status, COUNT(*)::int as count FROM leads GROUP BY status");
  const result: Record<LeadStatus, number> = { NEW: 0, CONTACTED: 0, WON: 0, LOST: 0 };
  for (const row of rows as { status: LeadStatus; count: number }[]) result[row.status] = row.count;
  return result;
}

export async function countLeadsToday(): Promise<number> {
  const db = await getDb();
  const todayPrefix = new Date().toISOString().slice(0, 10);
  const { rows } = await db.query("SELECT COUNT(*)::int as count FROM leads WHERE created_at LIKE $1", [
    `${todayPrefix}%`,
  ]);
  return (rows[0] as { count: number }).count;
}

export async function countLeadsTodayByType(type: Lead["type"]): Promise<number> {
  const db = await getDb();
  const todayPrefix = new Date().toISOString().slice(0, 10);
  const { rows } = await db.query(
    "SELECT COUNT(*)::int as count FROM leads WHERE type = $1 AND created_at LIKE $2",
    [type, `${todayPrefix}%`],
  );
  return (rows[0] as { count: number }).count;
}
