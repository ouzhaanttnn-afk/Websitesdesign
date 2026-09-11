"use client";

import { useEffect, useState } from "react";
import type { MarketPriceKey } from "@/domains/pricing/types";

interface PriceRow {
  key: MarketPriceKey;
  label: string;
  value: number;
  updatedAt: string;
}

export default function AdminMarketPricesPage() {
  const [rows, setRows] = useState<PriceRow[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/market-prices")
      .then((res) => res.json())
      .then((data: { prices: PriceRow[] }) => {
        setRows(data.prices);
        setValues(Object.fromEntries(data.prices.map((r) => [r.key, String(r.value)])));
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    const payload = Object.fromEntries(
      Object.entries(values).map(([key, v]) => [key, Number(v)]),
    );
    const res = await fetch("/api/admin/market-prices", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as { prices: PriceRow[] };
    setRows(data.prices);
    setSaving(false);
    setSavedAt(Date.now());
  }

  if (loading) {
    return <p className="container-content py-6 text-body-sm text-ink-faint">Yükleniyor…</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="container-content max-w-md py-6">
      <h1 className="font-display text-display-lg">Piyasa Ayarları</h1>
      <p className="mt-2 text-body-sm text-ink-faint">
        Buradaki değerler, &ldquo;Hesaplanan&rdquo; fiyatlandırma modundaki tüm ürünlerin satış fiyatını anında etkiler.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        {rows.map((row) => (
          <div key={row.key}>
            <label htmlFor={row.key} className="mb-1.5 block text-body-sm font-medium text-ink-soft">
              {row.label}
            </label>
            <div className="flex items-center gap-2">
              <input
                id={row.key}
                type="number"
                step="0.01"
                value={values[row.key] ?? ""}
                onChange={(e) => setValues((prev) => ({ ...prev, [row.key]: e.target.value }))}
                className="w-full rounded border border-border bg-surface px-4 py-3 text-body-md text-ink outline-none focus:border-accent-strong"
              />
              <span className="text-body-sm text-ink-faint">TRY</span>
            </div>
          </div>
        ))}
      </div>

      {savedAt && (
        <p className="mt-4 text-body-sm text-accent-strong">Kaydedildi.</p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="mt-4 rounded bg-ink px-6 py-3.5 text-body-sm font-medium text-canvas disabled:opacity-60"
      >
        {saving ? "Kaydediliyor…" : "Kaydet"}
      </button>
    </form>
  );
}
