import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { brand } from "@/config/brand";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <ImagePlaceholder
          label="Hero: Alvera Kuyumculuk vitrin / atölye editoryal görseli"
          aspect="aspect-auto h-full"
          className="h-full"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/15 to-ink/40" aria-hidden="true" />

      <div className="container-content relative flex min-h-[78vh] flex-col justify-end gap-8 pb-16 pt-40 sm:min-h-[82vh] sm:pb-20">
        <div className="max-w-2xl">
          <Eyebrow tone="inverted">{brand.locationLabel}</Eyebrow>
          <h1 className="font-display text-display-2xl text-canvas">{brand.name}</h1>
          <p className="mt-5 font-display text-display-md italic text-canvas/90">{brand.tagline}</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button href="/koleksiyonlar" variant="primary" tone="inverted" icon>
            Koleksiyonları Keşfet
          </Button>
          <Button href="/fiyatlar" variant="secondary" tone="inverted">
            Fiyatları Görüntüle
          </Button>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-8 right-6 hidden flex-col items-center gap-2 sm:right-10 md:flex"
      >
        <span className="text-eyebrow uppercase text-canvas/70">Kaydır</span>
        <span className="scroll-cue-line h-8 w-px bg-canvas/70" />
      </div>
    </section>
  );
}
