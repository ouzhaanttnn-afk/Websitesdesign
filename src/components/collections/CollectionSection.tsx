import Link from "next/link";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { StockBadge } from "@/components/product/StockBadge";
import { calculateProductPrice } from "@/domains/pricing/engine";
import type { MarketPrices } from "@/domains/pricing/types";
import type { Product } from "@/domains/products/types";
import type { Category } from "@/config/categories";

function formatPrice(value: number) {
  return value.toLocaleString("tr-TR", { maximumFractionDigits: 0 });
}

function ProductCard({ product, market }: { product: Product; market: MarketPrices }) {
  const price = calculateProductPrice(product, market);
  return (
    <Link key={product.id} href={`/urun/${product.slug}`} className="group block">
      {product.images[0] ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={product.images[0]}
          alt={product.name}
          className="aspect-square w-full object-cover transition-shadow duration-300 ease-quiet group-hover:shadow-soft"
        />
      ) : (
        <ImagePlaceholder
          label={product.name}
          aspect="aspect-square"
          className="transition-shadow duration-300 ease-quiet group-hover:shadow-soft"
        />
      )}
      <p className="mt-2 text-body-sm font-medium text-ink group-hover:text-accent-strong">{product.name}</p>
      <div className="mt-1 flex items-center gap-2">
        {price != null ? (
          <p className="tabular text-body-sm text-accent-strong">{formatPrice(price)} TRY</p>
        ) : (
          <p className="text-body-sm text-ink-faint">Fiyat için sorun</p>
        )}
        {product.stockStatus !== "AVAILABLE" && <StockBadge status={product.stockStatus} />}
      </div>
    </Link>
  );
}

export function CollectionSection({
  category,
  reversed,
  products,
  market,
}: {
  category: Category;
  reversed: boolean;
  products: Product[];
  market: MarketPrices;
}) {
  return (
    <section id={category.slug} className="scroll-mt-32 border-t border-border py-16 sm:py-20">
      <div className="container-content">
        <RevealOnScroll>
          <div
            className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${
              reversed ? "md:[&>*:first-child]:order-2" : ""
            }`}
          >
            <ImagePlaceholder label={category.imageAlt} aspect="aspect-[4/5]" />
            <div>
              <p className="eyebrow mb-4">Koleksiyon</p>
              <h2 className="font-display text-display-lg">{category.label}</h2>
              <p className="mt-5 max-w-md text-body-lg text-ink-soft">{category.description}</p>
              {products.length === 0 && (
                <p className="mt-6 text-body-sm text-ink-faint">
                  Ürün kataloğu yakında eklenecek — mağazamızdan veya WhatsApp
                  üzerinden güncel model ve fiyat bilgisi alabilirsiniz.
                </p>
              )}
            </div>
          </div>
        </RevealOnScroll>

        {products.length > 0 && (
          <RevealOnScroll className="mt-12" delay={100}>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} market={market} />
              ))}
            </div>
          </RevealOnScroll>
        )}
      </div>
    </section>
  );
}
