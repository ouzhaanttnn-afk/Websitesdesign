"use client";

import { useCallback, useEffect, useState } from "react";
import type { Lead, LeadStatus, LeadType } from "@/domains/leads/types";

const STATUS_LABEL: Record<LeadStatus, string> = {
  NEW: "Yeni",
  CONTACTED: "İletişime Geçildi",
  WON: "Satış",
  LOST: "Kaybedildi",
};

const TYPE_LABEL: Record<LeadType, string> = {
  PRICE_REQUEST: "Fiyat Talebi",
  WHATSAPP: "WhatsApp",
  RESERVATION: "Rezervasyon",
  PRODUCT_INFO: "Ürün Bilgisi",
  SIMILAR_PRODUCT: "Benzer Ürün",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [status, setStatus] = useState<LeadStatus | "">("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    fetch(`/api/admin/leads?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setLeads(data.leads ?? []))
      .finally(() => setLoading(false));
  }, [status]);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(lead: Lead, next: LeadStatus) {
    setBusyId(lead.id);
    await fetch(`/api/admin/leads/${lead.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setBusyId(null);
    load();
  }

  return (
    <div className="container-content py-6">
      <h1 className="font-display text-display-lg">Talepler</h1>

      <div className="mt-5 flex gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setStatus("")}
          className={`shrink-0 rounded-pill border px-3 py-2 text-body-sm ${
            status === "" ? "border-accent-strong bg-surface text-accent-strong" : "border-border text-ink-soft"
          }`}
        >
          Tümü
        </button>
        {(Object.keys(STATUS_LABEL) as LeadStatus[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            className={`shrink-0 rounded-pill border px-3 py-2 text-body-sm ${
              status === s ? "border-accent-strong bg-surface text-accent-strong" : "border-border text-ink-soft"
            }`}
          >
            {STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      <ul className="mt-5 flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
        {loading && <li className="p-4 text-body-sm text-ink-faint">Yükleniyor…</li>}
        {!loading && leads.length === 0 && <li className="p-4 text-body-sm text-ink-faint">Talep bulunamadı.</li>}
        {leads.map((lead) => (
          <li key={lead.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-body-sm text-ink-faint">
                  {formatDate(lead.createdAt)} · {TYPE_LABEL[lead.type]}
                </p>
                {lead.productName && (
                  <p className="mt-1 text-body-md font-medium text-ink">
                    {lead.productSku} — {lead.productName}
                  </p>
                )}
                {lead.customerName && <p className="mt-1 text-body-sm text-ink">{lead.customerName}</p>}
                {lead.customerPhone && (
                  <a href={`tel:${lead.customerPhone}`} className="text-body-sm text-accent-strong underline">
                    {lead.customerPhone}
                  </a>
                )}
                {lead.message && <p className="mt-1 text-body-sm text-ink-soft">&ldquo;{lead.message}&rdquo;</p>}
              </div>
              <span className="shrink-0 rounded-pill border border-border px-2.5 py-1 text-eyebrow text-ink-faint">
                {STATUS_LABEL[lead.status]}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {lead.customerPhone && (
                <a
                  href={`tel:${lead.customerPhone}`}
                  onClick={() => updateStatus(lead, "CONTACTED")}
                  className="rounded border border-border px-3 py-1.5 text-body-sm font-medium text-ink-soft"
                >
                  İletişime Geç
                </a>
              )}
              {(["NEW", "CONTACTED", "WON", "LOST"] as LeadStatus[])
                .filter((s) => s !== lead.status)
                .map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={busyId === lead.id}
                    onClick={() => updateStatus(lead, s)}
                    className="rounded border border-border px-3 py-1.5 text-body-sm text-ink-faint disabled:opacity-50"
                  >
                    {STATUS_LABEL[s]}
                  </button>
                ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
