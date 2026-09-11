import Link from "next/link";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { categories } from "@/config/categories";

const featured = categories.slice(0, 3);
const rest = categories.slice(3);

export function CategoryShowcase() {
  return (
    <section className="section-y">
      <div className="container-content">
        <RevealOnScroll>
          <Eyebrow>Koleksiyon</Eyebrow>
          <h2 className="max-w-xl font-display text-display-lg">
            Her parça, zamanın ötesinde bir zarafet taşır.
          </h2>
        </RevealOnScroll>
      </div>

      <div className="mt-16 flex flex-col gap-20 sm:mt-20 sm:gap-28">
        {featured.map((category, index) => {
          const reversed = index % 2 === 1;
          return (
            <RevealOnScroll key={category.slug}>
              <div className="container-content">
                <div
                  className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${
                    reversed ? "md:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <ImagePlaceholder label={category.imageAlt} aspect="aspect-[4/5]" />
                  <div>
                    <p className="eyebrow mb-4">{category.label}</p>
                    <p className="max-w-md text-body-lg text-ink-soft">{category.description}</p>
                    <Link
                      href={`/koleksiyonlar#${category.slug}`}
                      className="mt-6 inline-block text-body-sm font-medium text-ink underline decoration-border underline-offset-4 transition-colors duration-300 ease-quiet hover:text-accent-strong hover:decoration-accent-strong"
                    >
                      {category.label} koleksiyonunu incele
                    </Link>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          );
        })}
      </div>

      <RevealOnScroll className="mt-20 sm:mt-28">
        <div className="container-content">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {rest.map((category) => (
              <Link
                key={category.slug}
                href={`/koleksiyonlar#${category.slug}`}
                className="group block"
              >
                <ImagePlaceholder label={category.imageAlt} aspect="aspect-square" />
                <p className="mt-3 text-body-sm font-medium text-ink group-hover:text-accent-strong">
                  {category.label}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
