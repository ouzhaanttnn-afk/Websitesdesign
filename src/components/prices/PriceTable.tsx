import type { PriceSnapshot } from "@/lib/prices";

function formatNumber(value: number) {
  return value.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatUpdatedAt(iso: string) {
  return new Date(iso).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function PriceTable({ snapshot }: { snapshot: PriceSnapshot }) {
  return (
    <div>
      <div className="flex flex-col gap-2 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-body-sm text-ink-faint">
          Son güncelleme: <span className="tabular">{formatUpdatedAt(snapshot.updatedAt)}</span>
          {snapshot.isLive && snapshot.source && <> · Kaynak: {snapshot.source}</>}
        </p>
        {!snapshot.isLive && (
          <span className="inline-flex w-fit items-center gap-2 rounded-pill border border-accent-strong/25 bg-accent-strong/[0.06] px-3 py-1.5 text-body-sm font-medium text-accent-strong">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-strong" aria-hidden="true" />
            Demo veri — anlık piyasa verisi değildir
          </span>
        )}
      </div>

      {/* Masaüstü: tablo */}
      <table className="mt-4 hidden w-full border-collapse sm:table">
        <caption className="sr-only">Güncel altın ve döviz alış/satış fiyatları</caption>
        <thead>
          <tr className="border-b-2 border-ink/10 text-left">
            <th scope="col" className="py-4 text-eyebrow font-medium uppercase tracking-widest text-ink-faint">Kalem</th>
            <th scope="col" className="py-4 text-eyebrow font-medium uppercase tracking-widest text-ink-faint">Alış</th>
            <th scope="col" className="py-4 text-eyebrow font-medium uppercase tracking-widest text-accent-strong">Satış</th>
            <th scope="col" className="py-4 text-eyebrow font-medium uppercase tracking-widest text-ink-faint">Birim</th>
          </tr>
        </thead>
        <tbody>
          {snapshot.quotes.map((quote) => (
            <tr
              key={quote.id}
              className="border-b border-border transition-colors duration-300 ease-quiet hover:bg-surface-alt/70"
            >
              <th scope="row" className="py-5 text-body-md font-medium text-ink">
                {quote.label}
              </th>
              <td className="tabular py-5 text-body-md text-ink-soft">{formatNumber(quote.buy)}</td>
              <td className="tabular py-5 text-body-md font-semibold text-accent-strong">{formatNumber(quote.sell)}</td>
              <td className="py-5 text-body-sm text-ink-faint">{quote.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobil: kart-satır düzeni */}
      <ul className="mt-4 flex flex-col divide-y divide-border sm:hidden">
        {snapshot.quotes.map((quote) => (
          <li key={quote.id} className="py-5">
            <p className="text-body-md font-medium text-ink">{quote.label}</p>
            <p className="mt-1 text-body-sm text-ink-faint">{quote.unit}</p>
            <div className="mt-3 flex items-center gap-6">
              <div>
                <p className="text-body-sm text-ink-faint">Alış</p>
                <p className="tabular text-body-md text-ink-soft">{formatNumber(quote.buy)}</p>
              </div>
              <div>
                <p className="text-body-sm font-medium text-accent-strong">Satış</p>
                <p className="tabular text-body-md font-semibold text-accent-strong">{formatNumber(quote.sell)}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
