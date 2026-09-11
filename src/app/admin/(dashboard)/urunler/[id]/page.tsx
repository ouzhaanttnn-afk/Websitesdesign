import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductById } from "@/domains/products/repository";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  return (
    <div>
      <ProductForm initial={product} />

      <div className="container-content max-w-xl pb-10">
        <div className="rounded-lg border border-border bg-surface p-5">
          <p className="text-body-sm font-medium text-ink-soft">QR Kod</p>
          <p className="mt-1 text-body-sm text-ink-faint">
            Mağaza etiketinde kullanmak için — doğrudan bu ürünün sayfasına yönlendirir.
          </p>
          <div className="mt-4 flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/api/qr/${product.slug}`} alt="" width={120} height={120} className="border border-border" />
            <a
              href={`/api/qr/${product.slug}`}
              download={`${product.sku}-qr.png`}
              className="text-body-sm font-medium text-ink underline decoration-border underline-offset-4 hover:text-accent-strong"
            >
              PNG indir
            </a>
          </div>
        </div>

        <Link
          href={`/urun/${product.slug}`}
          target="_blank"
          className="mt-4 inline-block text-body-sm text-ink-soft underline decoration-border underline-offset-4 hover:text-accent-strong"
        >
          Sitede görüntüle ↗
        </Link>
      </div>
    </div>
  );
}
