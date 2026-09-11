import Link from "next/link";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import type { Product } from "@/domains/products/types";

export function SimilarProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <div className="mt-12">
      <p className="eyebrow mb-4">Benzer ürünler</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {products.map((product) => (
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
          </Link>
        ))}
      </div>
    </div>
  );
}
