import Link from "next/link";
import { countEventsTodayByName, getTopViewedProductsToday, type TopProductRow } from "@/domains/analytics/repository";
import { countLeadsTodayByType } from "@/domains/leads/repository";
import { getProductById } from "@/domains/products/repository";
import type { Product } from "@/domains/products/types";

// Canlı istatistikler — build-time'da cache'lenmemeli.
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = [
    { label: "Ziyaret", value: countEventsTodayByName("page_view") },
    { label: "Ürün görüntüleme", value: countEventsTodayByName("product_view") },
    { label: "WhatsApp tıklama", value: countEventsTodayByName("whatsapp_click") },
    { label: "Fiyat talebi", value: countLeadsTodayByType("PRICE_REQUEST") },
    { label: "Rezervasyon talebi", value: countLeadsTodayByType("RESERVATION") },
  ];

  const topViewed = getTopViewedProductsToday(5)
    .map((row) => ({ row, product: getProductById(row.productId) }))
    .filter((entry): entry is { row: TopProductRow; product: Product } => entry.product !== null);

  return (
    <div className="container-content py-8">
      <h1 className="font-display text-display-lg">Bugün</h1>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-surface p-4">
            <p className="tabular font-display text-display-md font-medium text-ink">{s.value}</p>
            <p className="mt-1 text-body-sm text-ink-faint">{s.label}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-body-sm font-medium uppercase tracking-widest text-ink-faint">
        En çok ilgi gören ürünler
      </h2>
      {topViewed.length === 0 ? (
        <p className="mt-4 text-body-sm text-ink-faint">Bugün henüz ürün görüntülemesi yok.</p>
      ) : (
        <ul className="mt-4 flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
          {topViewed.map(({ row, product }) => (
            <li key={row.productId}>
              <Link href={`/admin/urunler/${product.id}`} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-body-md font-medium text-ink">{product.name}</p>
                  <p className="text-body-sm text-ink-faint">{product.sku}</p>
                </div>
                <span className="tabular text-body-sm font-medium text-accent-strong">{row.count} görüntüleme</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
