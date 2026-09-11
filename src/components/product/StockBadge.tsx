import type { StockStatus } from "@/domains/products/types";

const CONFIG: Partial<Record<StockStatus, { label: string; className: string }>> = {
  RESERVED: { label: "Rezerve", className: "border-accent-strong/30 bg-accent-strong/[0.06] text-accent-strong" },
  SOLD: { label: "Satıldı", className: "border-ink/20 bg-ink/[0.04] text-ink-soft" },
};

/** AVAILABLE için hiçbir rozet göstermez (varsayılan/nötr durum) — HIDDEN zaten müşteriye hiç gösterilmez. */
export function StockBadge({ status }: { status: StockStatus }) {
  const config = CONFIG[status];
  if (!config) return null;

  return (
    <span
      className={`inline-flex w-fit items-center gap-2 rounded-pill border px-3 py-1.5 text-body-sm font-medium ${config.className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {config.label}
    </span>
  );
}
