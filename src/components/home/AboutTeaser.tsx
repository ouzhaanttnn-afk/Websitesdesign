import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function AboutTeaser() {
  return (
    <section className="section-y">
      <div className="container-content grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <RevealOnScroll>
          <ImagePlaceholder label="Alvera Kuyumculuk mağaza içi editoryal görseli" aspect="aspect-[3/2]" />
        </RevealOnScroll>
        <RevealOnScroll delay={100}>
          <Eyebrow>Alvera</Eyebrow>
          <h2 className="font-display text-display-lg">Mamak&apos;ta güvenin adı</h2>
          <p className="mt-5 max-w-md text-body-lg text-ink-soft">
            Alvera Kuyumculuk, doğru işçilik ve dürüst hizmet anlayışıyla Mamak&apos;ta
            hizmet veriyor. Her parçayı, uzun süre yanınızda kalacak bir değer olarak
            hazırlıyoruz.
          </p>
          <a
            href="/hakkimizda"
            className="mt-6 inline-block text-body-sm font-medium text-ink underline decoration-border underline-offset-4 transition-colors duration-300 ease-quiet hover:text-accent-strong hover:decoration-accent-strong"
          >
            Hikayemizi okuyun
          </a>
        </RevealOnScroll>
      </div>
    </section>
  );
}
