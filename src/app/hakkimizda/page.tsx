import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Button } from "@/components/ui/Button";
import { brand } from "@/config/brand";

const values = [
  {
    title: "Doğru işçilik",
    description: "Her parça, uzun yıllar yanınızda kalacak bir özenle hazırlanır.",
  },
  {
    title: "Şeffaf fiyatlandırma",
    description: "Güncel piyasa değerine göre net, anlaşılır fiyatlandırma.",
  },
  {
    title: "Kişisel hizmet",
    description: "Her ziyaretçiyle birebir ilgilenen, tanıdık bir kuyumcu yaklaşımı.",
  },
];

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "Alvera Kuyumculuk hakkında — Mamak, Ankara.",
};

export default function AboutPage() {
  return (
    <>
      <section className="section-y pb-0">
        <div className="container-content grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <RevealOnScroll>
            <Eyebrow>Hakkımızda</Eyebrow>
            <h1 className="font-display text-display-xl">{brand.name}</h1>
            <p className="mt-6 max-w-md text-body-lg text-ink-soft">
              {brand.locationLabel}&apos;da altın, pırlanta, mücevher ve saat üzerine
              hizmet veriyoruz. Amacımız, her ziyaretçiye doğru parçayı doğru
              şekilde sunmak.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={100}>
            <ImagePlaceholder label="Alvera Kuyumculuk ekip / mağaza görseli" aspect="aspect-[4/5]" />
          </RevealOnScroll>
        </div>
      </section>

      <section className="section-y">
        <div className="container-content">
          <RevealOnScroll>
            <h2 className="max-w-md font-display text-display-lg">Neye önem veriyoruz</h2>
          </RevealOnScroll>
          <div className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {values.map((value, index) => (
              <RevealOnScroll key={value.title} delay={index * 100}>
                <div className="border-t border-border pt-6">
                  <h3 className="font-display text-display-md">{value.title}</h3>
                  <p className="mt-3 text-body-md text-ink-soft">{value.description}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-surface-alt">
        <div className="container-content grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <RevealOnScroll>
            <ImagePlaceholder label="Alvera Kuyumculuk dış cephe / konum görseli" aspect="aspect-[4/3]" />
          </RevealOnScroll>
          <RevealOnScroll delay={100}>
            <Eyebrow>Bizi Ziyaret Edin</Eyebrow>
            <h2 className="font-display text-display-lg">{brand.locationLabel}</h2>
            <p className="mt-4 text-body-md text-ink-soft">{brand.addressLine}</p>
            <p className="mt-1 text-body-md text-ink-soft">{brand.workingHours}</p>
            <Button href="/iletisim" variant="secondary" className="mt-8">
              İletişim bilgileri
            </Button>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
