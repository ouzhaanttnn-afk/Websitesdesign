import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, listSimilarProducts } from "@/domains/products/repository";
import { getPricingProvider, calculateProductPrice } from "@/domains/pricing";
import { categories } from "@/config/categories";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { StockBadge } from "@/components/product/StockBadge";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductActions } from "@/components/product/ProductActions";
import { ProductViewTracker } from "@/components/product/ProductViewTracker";
import { SimilarProducts } from "@/components/product/SimilarProducts";

// Stok durumu/fiyat admin panelinden her an değişebilir — her istekte taze veri.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || product.stockStatus === "HIDDEN" || !product.isVisible) {
    return { title: "Ürün bulunamadı" };
  }
  return {
    title: product.name,
    description: product.description || `${product.name} — Alvera Kuyumculuk`,
  };
}

function formatPrice(value: number) {
  return value.toLocaleString("tr-TR", { maximumFractionDigits: 0 });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || product.stockStatus === "HIDDEN" || !product.isVisible) {
    notFound();
  }

  const market = await getPricingProvider().getPrices();
  const price = calculateProductPrice(product, market);
  const categoryLabel = categories.find((c) => c.slug === product.category)?.label ?? product.category;
  const isSold = product.stockStatus === "SOLD";
  const similarProducts = isSold ? await listSimilarProducts(product) : [];

  return (
    <div className="section-y">
      <ProductViewTracker
        productId={product.id}
        sku={product.sku}
        category={product.category}
        hasPrice={price != null}
      />

      <div className="container-content grid gap-10 md:grid-cols-2 md:gap-16">
        <ProductGallery images={product.images} alt={product.name} />

        <div>
          <Eyebrow>{categoryLabel}</Eyebrow>
          <h1 className="font-display text-display-xl">{product.name}</h1>
          <p className="mt-2 text-body-sm text-ink-faint">Ürün Kodu: {product.sku}</p>

          <div className="mt-4">
            <StockBadge status={product.stockStatus} />
          </div>

          {isSold ? (
            <div className="mt-6 rounded-lg border border-border bg-surface-alt p-5">
              <p className="font-display text-display-md text-ink">Bu ürün satıldı.</p>
              <p className="mt-2 text-body-sm text-ink-soft">
                Bu modeli veya benzerlerini görmek isterseniz aşağıdan bize ulaşabilirsiniz.
              </p>
            </div>
          ) : (
            <div className="mt-6">
              {price != null ? (
                <p className="tabular font-display text-display-lg font-medium text-accent-strong">
                  {formatPrice(price)} TRY
                </p>
              ) : (
                <p className="text-body-md text-ink-faint">Güncel fiyat için bizimle iletişime geçin.</p>
              )}
            </div>
          )}

          <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-border py-5 text-body-sm">
            {product.karat && (
              <div>
                <dt className="text-ink-faint">Ayar</dt>
                <dd className="mt-1 font-medium text-ink">{product.karat}</dd>
              </div>
            )}
            {product.weightGram != null && (
              <div>
                <dt className="text-ink-faint">Gram</dt>
                <dd className="tabular mt-1 font-medium text-ink">{product.weightGram} g</dd>
              </div>
            )}
          </dl>

          {product.description && <p className="mt-6 text-body-lg text-ink-soft">{product.description}</p>}

          <div className="mt-8">
            <ProductActions
              product={{
                id: product.id,
                sku: product.sku,
                name: product.name,
                slug: product.slug,
                stockStatus: product.stockStatus,
              }}
            />
          </div>

          {isSold && <SimilarProducts products={similarProducts} />}
        </div>
      </div>
    </div>
  );
}
