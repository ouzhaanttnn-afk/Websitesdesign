"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { categories } from "@/config/categories";
import { KARAT_OPTIONS } from "@/domains/pricing/engine";
import { fileToOptimizedDataUrl } from "@/domains/products/images";
import type { Product, ProductCategory, ProductInput, StockStatus } from "@/domains/products/types";

const STATUS_LABEL: Record<StockStatus, string> = {
  AVAILABLE: "Satışta",
  RESERVED: "Rezerve",
  SOLD: "Satıldı",
  HIDDEN: "Gizli",
};

interface ProductFormProps {
  initial?: Product;
}

export function ProductForm({ initial }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!initial;

  const [sku, setSku] = useState(initial?.sku ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState<ProductCategory>(initial?.category ?? categories[0]!.slug);
  const [description, setDescription] = useState(initial?.description ?? "");
  const [karat, setKarat] = useState(initial?.karat ?? "");
  const [weightGram, setWeightGram] = useState(initial?.weightGram?.toString() ?? "");
  const [workmanship, setWorkmanship] = useState(initial?.workmanship?.toString() ?? "");
  const [pricingMode, setPricingMode] = useState<"MANUAL" | "CALCULATED">(initial?.pricingMode ?? "MANUAL");
  const [manualPrice, setManualPrice] = useState(initial?.manualPrice?.toString() ?? "");
  const [stockStatus, setStockStatus] = useState<StockStatus>(initial?.stockStatus ?? "AVAILABLE");
  const [isVisible, setIsVisible] = useState(initial?.isVisible ?? true);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    try {
      const next: string[] = [];
      for (const file of Array.from(fileList)) {
        if (!file.type.startsWith("image/")) continue;
        next.push(await fileToOptimizedDataUrl(file));
      }
      setImages((prev) => [...prev, ...next]);
    } catch {
      setError("Görsel işlenemedi.");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!sku.trim() || !name.trim()) {
      setError("SKU ve ürün adı zorunlu.");
      return;
    }
    setSaving(true);
    setError(null);

    const payload: ProductInput = {
      sku: sku.trim(),
      name: name.trim(),
      category,
      description: description.trim(),
      images,
      karat: karat || null,
      weightGram: weightGram ? Number(weightGram) : null,
      workmanship: workmanship ? Number(workmanship) : null,
      pricingMode,
      manualPrice: manualPrice ? Number(manualPrice) : null,
      stockStatus,
      isVisible,
      featured,
    };

    const res = await fetch(isEdit ? `/api/admin/products/${initial!.id}` : "/api/admin/products", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Kaydedilemedi.");
      setSaving(false);
      return;
    }

    router.push("/admin/urunler");
    router.refresh();
  }

  const inputClass =
    "w-full rounded border border-border bg-surface px-4 py-3 text-body-md text-ink outline-none focus:border-accent-strong";
  const labelClass = "mb-1.5 block text-body-sm font-medium text-ink-soft";

  return (
    <form onSubmit={handleSubmit} className="container-content max-w-xl py-6">
      <h1 className="font-display text-display-lg">{isEdit ? "Ürünü Düzenle" : "Yeni Ürün"}</h1>

      <div className="mt-6 flex flex-col gap-4">
        <div>
          <label className={labelClass}>Fotoğraflar</label>
          <div className="flex flex-wrap gap-2">
            {images.map((src, i) => (
              <div key={src.slice(0, 30) + i} className="relative h-20 w-20 overflow-hidden rounded border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  aria-label="Görseli kaldır"
                  className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink/80 text-canvas"
                >
                  ×
                </button>
              </div>
            ))}
            <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded border border-dashed border-border text-body-sm text-ink-faint">
              {uploading ? "…" : "+ Ekle"}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="sku" className={labelClass}>SKU</label>
            <input id="sku" required value={sku} onChange={(e) => setSku(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="category" className={labelClass}>Kategori</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ProductCategory)}
              className={inputClass}
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="name" className={labelClass}>Ürün Adı</label>
          <input id="name" required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>Açıklama</label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label htmlFor="karat" className={labelClass}>Ayar</label>
            <select id="karat" value={karat} onChange={(e) => setKarat(e.target.value)} className={inputClass}>
              <option value="">—</option>
              {KARAT_OPTIONS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="weight" className={labelClass}>Gram</label>
            <input
              id="weight"
              type="number"
              step="0.01"
              min="0"
              value={weightGram}
              onChange={(e) => setWeightGram(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="workmanship" className={labelClass}>İşçilik (TRY)</label>
            <input
              id="workmanship"
              type="number"
              step="1"
              min="0"
              value={workmanship}
              onChange={(e) => setWorkmanship(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Fiyatlandırma</label>
          <div className="flex gap-4 text-body-sm text-ink-soft">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={pricingMode === "MANUAL"}
                onChange={() => setPricingMode("MANUAL")}
              />
              Manuel
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={pricingMode === "CALCULATED"}
                onChange={() => setPricingMode("CALCULATED")}
              />
              Hesaplanan (ayar + gram + işçilik)
            </label>
          </div>
          {pricingMode === "MANUAL" && (
            <input
              type="number"
              step="1"
              min="0"
              placeholder="Fiyat (TRY)"
              value={manualPrice}
              onChange={(e) => setManualPrice(e.target.value)}
              className={`${inputClass} mt-2`}
            />
          )}
        </div>

        <div>
          <label htmlFor="status" className={labelClass}>Stok Durumu</label>
          <select
            id="status"
            value={stockStatus}
            onChange={(e) => setStockStatus(e.target.value as StockStatus)}
            className={inputClass}
          >
            {(Object.keys(STATUS_LABEL) as StockStatus[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-6 text-body-sm text-ink-soft">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={isVisible} onChange={(e) => setIsVisible(e.target.checked)} />
            Görünür
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
            Öne çıkan
          </label>
        </div>

        {error && (
          <p role="alert" className="text-body-sm text-error">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving || uploading}
          className="rounded bg-ink px-6 py-3.5 text-body-sm font-medium text-canvas disabled:opacity-60"
        >
          {saving ? "Kaydediliyor…" : isEdit ? "Değişiklikleri Kaydet" : "Ürünü Oluştur"}
        </button>
      </div>
    </form>
  );
}
