"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { categories } from "@/config/categories";
import type { Product, ProductCategory, StockStatus } from "@/domains/products/types";

const STATUS_LABEL: Record<StockStatus, string> = {
  AVAILABLE: "Satışta",
  RESERVED: "Rezerve",
  SOLD: "Satıldı",
  HIDDEN: "Gizli",
};

const STATUS_DOT: Record<StockStatus, string> = {
  AVAILABLE: "bg-emerald-600",
  RESERVED: "bg-accent-strong",
  SOLD: "bg-ink-faint",
  HIDDEN: "bg-ink-faint",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ProductCategory | "">("");
  const [status, setStatus] = useState<StockStatus | "">("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category) params.set("category", category);
    if (status) params.set("status", status);
    fetch(`/api/admin/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products ?? []))
      .finally(() => setLoading(false));
  }, [query, category, status]);

  useEffect(() => {
    const timeout = setTimeout(load, 250);
    return () => clearTimeout(timeout);
  }, [load]);

  async function markSold(product: Product) {
    if (!window.confirm(`"${product.name}" ürününü SATILDI olarak işaretlemek istediğinize emin misiniz?`)) return;
    setBusyId(product.id);
    await fetch(`/api/admin/products/${product.id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "SOLD" }),
    });
    setBusyId(null);
    load();
  }

  return (
    <div className="container-content py-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-display-lg">Ürünler</h1>
        <Link
          href="/admin/urunler/yeni"
          className="rounded bg-ink px-4 py-2.5 text-body-sm font-medium text-canvas"
        >
          + Yeni Ürün
        </Link>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <input
          type="search"
          placeholder="Ürün ara (isim, SKU)…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded border border-border bg-surface px-4 py-3 text-body-md text-ink outline-none focus:border-accent-strong"
        />
        <div className="flex gap-2 overflow-x-auto">
          <select
            aria-label="Kategoriye göre filtrele"
            value={category}
            onChange={(e) => setCategory(e.target.value as ProductCategory | "")}
            className="shrink-0 rounded border border-border bg-surface px-3 py-2 text-body-sm text-ink"
          >
            <option value="">Tüm kategoriler</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
          {(["AVAILABLE", "RESERVED", "SOLD", "HIDDEN"] as StockStatus[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(status === s ? "" : s)}
              className={`shrink-0 rounded-pill border px-3 py-2 text-body-sm ${
                status === s ? "border-accent-strong bg-surface text-accent-strong" : "border-border text-ink-soft"
              }`}
            >
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-5 flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
        {loading && <li className="p-4 text-body-sm text-ink-faint">Yükleniyor…</li>}
        {!loading && products.length === 0 && <li className="p-4 text-body-sm text-ink-faint">Ürün bulunamadı.</li>}
        {products.map((product) => (
          <li key={product.id} className="flex items-center justify-between gap-3 p-4">
            <Link href={`/admin/urunler/${product.id}`} className="min-w-0 flex-1">
              <p className="truncate text-body-md font-medium text-ink">{product.name}</p>
              <p className="mt-0.5 text-body-sm text-ink-faint">
                {product.sku} · {product.weightGram ? `${product.weightGram} g` : "—"}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-body-sm text-ink-soft">
                <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[product.stockStatus]}`} aria-hidden="true" />
                {STATUS_LABEL[product.stockStatus]}
              </p>
            </Link>
            {product.stockStatus !== "SOLD" && (
              <button
                type="button"
                disabled={busyId === product.id}
                onClick={() => markSold(product)}
                className="shrink-0 rounded border border-border px-3 py-2 text-body-sm font-medium text-ink-soft disabled:opacity-50"
              >
                SATILDI
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
