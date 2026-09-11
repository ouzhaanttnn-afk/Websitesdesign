import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PriceTable } from "@/components/prices/PriceTable";
import { contact } from "@/config/contact";
import { getPriceProvider } from "@/lib/prices";

export const metadata: Metadata = {
  title: "Fiyatlar",
  description: "Güncel altın ve döviz alış/satış fiyatları — Alvera Kuyumculuk.",
};

export default async function PricesPage() {
  const provider = getPriceProvider();
  const snapshot = await provider.getSnapshot();

  return (
    <section className="section-y">
      <div className="container-content">
        <Eyebrow>Piyasa</Eyebrow>
        <h1 className="max-w-2xl font-display text-display-xl">Güncel Fiyatlar</h1>
        <p className="mt-6 max-w-prose text-body-lg text-ink-soft">
          Gram altından dövize, güncel piyasa kalemlerini tek ekrandan takip edin.
          Kesin fiyat teyidi için mağazamızı arayabilirsiniz.
        </p>

        <div className="mt-14">
          <PriceTable snapshot={snapshot} />
        </div>

        <p className="mt-10 text-body-sm text-ink-faint">
          Fiyat teyidi için{" "}
          <a href={contact.phoneHref} className="text-ink underline decoration-border underline-offset-4 hover:text-accent-strong hover:decoration-accent-strong">
            {contact.phoneDisplay}
          </a>{" "}
          numarasından bize ulaşabilirsiniz.
        </p>
      </div>
    </section>
  );
}
