import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import type { Category } from "@/config/categories";

export function CollectionSection({ category, reversed }: { category: Category; reversed: boolean }) {
  return (
    <section id={category.slug} className="scroll-mt-24 border-t border-border py-16 sm:py-20">
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
              <p className="mt-6 text-body-sm text-ink-faint">
                Ürün kataloğu yakında eklenecek — mağazamızdan veya WhatsApp
                üzerinden güncel model ve fiyat bilgisi alabilirsiniz.
              </p>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
