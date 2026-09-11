import type { Metadata } from "next";
import Link from "next/link";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CollectionSection } from "@/components/collections/CollectionSection";
import { categories } from "@/config/categories";

export const metadata: Metadata = {
  title: "Koleksiyonlar",
  description: "Alvera Kuyumculuk koleksiyonları: altın, pırlanta, bilezik, kolye, yüzük, küpe ve saat.",
};

export default function CollectionsPage() {
  return (
    <>
      <section className="section-y pb-10 sm:pb-10">
        <div className="container-content">
          <RevealOnScroll>
            <Eyebrow>Koleksiyonlar</Eyebrow>
            <h1 className="max-w-2xl font-display text-display-xl">
              Her kategori, kendi zarafetini taşır.
            </h1>
            <p className="mt-6 max-w-prose text-body-lg text-ink-soft">
              Aşağıdaki kategorilerden birine göz atın veya doğrudan mağazamızı
              ziyaret ederek güncel modelleri inceleyin.
            </p>
          </RevealOnScroll>

          <nav aria-label="Koleksiyon kısayolları" className="mt-10 flex flex-wrap gap-3">
            {categories.map((category) => (
              <a
                key={category.slug}
                href={`#${category.slug}`}
                className="rounded-pill border border-border px-4 py-2 text-body-sm text-ink-soft transition-colors duration-300 ease-quiet hover:border-accent-strong hover:text-accent-strong"
              >
                {category.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {categories.map((category, index) => (
        <CollectionSection key={category.slug} category={category} reversed={index % 2 === 1} />
      ))}

      <section className="section-y bg-surface-alt">
        <div className="container-content text-center">
          <RevealOnScroll>
            <h2 className="font-display text-display-md">Aradığınız modeli bulamadınız mı?</h2>
            <p className="mx-auto mt-4 max-w-prose text-body-md text-ink-soft">
              Güncel ürün kataloğumuz için mağazamızla iletişime geçebilirsiniz.
            </p>
            <Link
              href="/iletisim"
              className="mt-6 inline-block text-body-sm font-medium text-ink underline decoration-border underline-offset-4 transition-colors duration-300 ease-quiet hover:text-accent-strong hover:decoration-accent-strong"
            >
              İletişime geçin
            </Link>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
