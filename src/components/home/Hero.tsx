import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { HeroFacet } from "@/components/home/HeroFacet";
import { brand } from "@/config/brand";

const ENTRANCE = "menu-item-in 700ms cubic-bezier(0.22,1,0.36,1) both";
const nameWords = brand.name.split(" ");

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <ImagePlaceholder
          label="Hero: Alvera Kuyumculuk vitrin / atölye editoryal görseli"
          aspect="aspect-auto h-full"
          className="h-full"
          showMotif={false}
        />
      </div>
      <HeroFacet />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/45"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgb(var(--color-accent)/0.10),transparent_60%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/80 to-transparent"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none container-content relative flex min-h-[78vh] flex-col justify-end gap-8 pb-16 pt-40 sm:min-h-[82vh] sm:pb-20"
      >
        <div className="max-w-2xl">
          <div style={{ animation: ENTRANCE, animationDelay: "80ms" }}>
            <Eyebrow tone="inverted">{brand.locationLabel}</Eyebrow>
          </div>
          <h1 className="font-display text-display-2xl text-canvas">
            {nameWords.flatMap((word, i) => [
              <span
                key={`w-${word}`}
                className="inline-block"
                style={{ animation: ENTRANCE, animationDelay: `${200 + i * 110}ms` }}
              >
                {word}
              </span>,
              // Kelimeler arasına gerçek bir boşluk karakteri (ayrı metin
              // düğümü) bırakılır — aksi halde bitişik inline-block'lar
              // arasında satır kırılma noktası oluşmaz ve dar ekranlarda
              // taşma riski doğar.
              i < nameWords.length - 1 ? " " : null,
            ])}
          </h1>
          <p
            className="mt-5 font-display text-display-md italic text-canvas/90"
            style={{ animation: ENTRANCE, animationDelay: "480ms" }}
          >
            {brand.tagline}
          </p>
        </div>

        <div
          className="pointer-events-auto flex flex-col gap-4 sm:flex-row"
          style={{ animation: ENTRANCE, animationDelay: "620ms" }}
        >
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
