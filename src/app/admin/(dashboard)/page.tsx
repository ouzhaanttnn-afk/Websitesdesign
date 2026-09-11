import Link from "next/link";
import { countEventsTodayByName, getTopViewedProductsToday, type TopProductRow } from "@/domains/analytics/repository";
import { countLeadsTodayByType } from "@/domains/leads/repository";
import { getProductById } from "@/domains/products/repository";
import type { Product } from "@/domains/products/types";

// Canlı istatistikler — build-time'da cache'lenmemeli.
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [visitCount, productViewCount, whatsappCount, priceRequestCount, reservationCount, topViewedRows] =
    await Promise.all([
      countEventsTodayByName("page_view"),
      countEventsTodayByName("product_view"),
      countEventsTodayByName("whatsapp_click"),
      countLeadsTodayByType("PRICE_REQUEST"),
      countLeadsTodayByType("RESERVATION"),
      getTopViewedProductsToday(5),
    ]);

  const stats = [
    { label: "Ziyaret", value: visitCount },
    { label: "Ürün görüntüleme", value: productViewCount },
    { label: "WhatsApp tıklama", value: whatsappCount },
    { label: "Fiyat talebi", value: priceRequestCount },
    { label: "Rezervasyon talebi", value: reservationCount },
  ];

  const topViewedResolved = await Promise.all(
    topViewedRows.map(async (row) => ({ row, product: await getProductById(row.productId) })),
  );
  const topViewed = topViewedResolved.filter(
    (entry): entry is { row: TopProductRow; product: Product } => entry.product !== null,
  );

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
