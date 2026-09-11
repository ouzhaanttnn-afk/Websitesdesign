import Link from "next/link";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getPriceProvider } from "@/lib/prices";

const teaserIds = new Set(["gram-altin", "ceyrek-altin", "usd"]);

export async function PriceTeaser() {
  const provider = getPriceProvider();
  const snapshot = await provider.getSnapshot();
  const rows = snapshot.quotes.filter((q) => teaserIds.has(q.id));

  return (
    <section className="section-y bg-surface-alt">
      <div className="container-content">
        <RevealOnScroll>
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow>Piyasa</Eyebrow>
              <h2 className="max-w-md font-display text-display-lg">Güncel altın ve döviz fiyatları</h2>
            </div>
            <Link
              href="/fiyatlar"
              className="text-body-sm font-medium text-ink underline decoration-border underline-offset-4 transition-colors duration-300 ease-quiet hover:text-accent-strong hover:decoration-accent-strong"
            >
              Tüm fiyatları görüntüle
            </Link>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={100} className="mt-12">
          <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
            {rows.map((row) => (
              <div key={row.id} className="bg-surface px-6 py-8">
                <p className="text-body-sm text-ink-faint">{row.label}</p>
                <p className="tabular mt-3 font-display text-display-md text-ink">
                  {row.sell.toLocaleString("tr-TR", { maximumFractionDigits: 2 })}
                </p>
                <p className="tabular mt-1 text-body-sm text-ink-soft">
                  Alış {row.buy.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} {row.unit}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-body-sm text-ink-faint">
            Gösterilen fiyatlar demo amaçlıdır, anlık piyasa verisi değildir.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
