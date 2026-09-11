"use client";

import { useEffect, useId, useRef, useState } from "react";
import { trackEvent } from "@/domains/analytics/track";

type Mode = "PRICE_REQUEST" | "RESERVATION";

const COPY: Record<Mode, { title: string; cta: string; successTitle: string; successBody: string }> = {
  PRICE_REQUEST: {
    title: "Güncel fiyatı öğren",
    cta: "Fiyat Talebi Gönder",
    successTitle: "Talebiniz alındı",
    successBody: "En kısa sürede sizi arayacağız.",
  },
  RESERVATION: {
    title: "Mağazada ayırt",
    cta: "Ayırt Talebi Gönder",
    successTitle: "Talebiniz alındı",
    successBody: "Ürününüzü ayırmak için mağazamız sizinle iletişime geçecek.",
  },
};

interface QuickLeadModalProps {
  open: boolean;
  onClose: () => void;
  mode: Mode;
  product: { id: string; sku: string; name: string };
}

export function QuickLeadModal({ open, onClose, mode, product }: QuickLeadModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const headingId = useId();

  useEffect(() => {
    if (!open) return;
    setName("");
    setPhone("");
    setMessage("");
    setError(null);
    setSuccess(false);
  }, [open, mode]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const copy = COPY[mode];

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Ad ve telefon zorunlu alanlardır.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: mode,
        productId: product.id,
        customerName: name.trim(),
        customerPhone: phone.trim(),
        message: message.trim() || null,
        source: "quick_lead_modal",
        pageUrl: window.location.href,
        website,
      }),
    });

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Talep gönderilemedi, lütfen tekrar deneyin.");
      setSubmitting(false);
      return;
    }

    trackEvent(mode === "PRICE_REQUEST" ? "price_request_created" : "reservation_created", {
      productId: product.id,
      sku: product.sku,
    });
    setSuccess(true);
    setSubmitting(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 sm:items-center sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="w-full max-w-md rounded-t-lg border-t border-border bg-surface p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-elevated sm:rounded-lg sm:border"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id={headingId} className="font-display text-display-md">
              {success ? copy.successTitle : copy.title}
            </h2>
            {!success && (
              <p className="mt-1 text-body-sm text-ink-faint">
                {product.name} · {product.sku}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="rounded p-1 text-ink-faint hover:text-ink"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {success ? (
          <p className="mt-6 text-body-md text-ink-soft">{copy.successBody}</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div>
              <label htmlFor={`${headingId}-name`} className="mb-1.5 block text-body-sm font-medium text-ink-soft">
                Ad Soyad
              </label>
              <input
                id={`${headingId}-name`}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded border border-border bg-canvas px-4 py-3 text-body-md text-ink outline-none transition-colors duration-300 ease-quiet focus:border-accent-strong"
              />
            </div>
            <div>
              <label htmlFor={`${headingId}-phone`} className="mb-1.5 block text-body-sm font-medium text-ink-soft">
                Telefon
              </label>
              <input
                id={`${headingId}-phone`}
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded border border-border bg-canvas px-4 py-3 text-body-md text-ink outline-none transition-colors duration-300 ease-quiet focus:border-accent-strong"
              />
            </div>
            <div>
              <label htmlFor={`${headingId}-message`} className="mb-1.5 block text-body-sm font-medium text-ink-soft">
                Mesajınız <span className="text-ink-faint">(isteğe bağlı)</span>
              </label>
              <textarea
                id={`${headingId}-message`}
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full resize-none rounded border border-border bg-canvas px-4 py-3 text-body-md text-ink outline-none transition-colors duration-300 ease-quiet focus:border-accent-strong"
              />
            </div>

            {/* Honeypot — insan kullanıcıya görünmez/erişilmez, botlar genelde doldurur. */}
            <input
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
              aria-hidden="true"
            />

            {error && (
              <p role="alert" className="text-body-sm text-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-1 rounded bg-ink px-6 py-3.5 text-body-sm font-medium text-canvas transition-colors duration-300 ease-quiet hover:bg-ink/90 disabled:opacity-60"
            >
              {submitting ? "Gönderiliyor…" : copy.cta}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
