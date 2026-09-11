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

      {/* "Galeri plakası" çerçevesi — köşe işaretleri ImagePlaceholder'ın proof-sheet
          diliyle tutarlı, sitenin genelinde tekrar eden bir marka imzası (bkz.
          design-system/MASTER.md §13.4). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-6 hidden sm:block lg:inset-10">
        <span className="absolute left-0 top-0 h-5 w-5 border-l border-t border-canvas/35" />
        <span className="absolute right-0 top-0 h-5 w-5 border-r border-t border-canvas/35" />
        <span className="absolute bottom-0 left-0 h-5 w-5 border-b border-l border-canvas/35" />
        <span className="absolute bottom-0 right-0 h-5 w-5 border-b border-r border-canvas/35" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 lg:right-12 xl:block"
        style={{ animation: ENTRANCE, animationDelay: "760ms" }}
      >
        <span
          className="block whitespace-nowrap text-eyebrow uppercase tracking-[0.32em] text-canvas/55"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          N° 01 — Koleksiyon 2026
        </span>
      </div>

      <div
        className="pointer-events-none container-content relative flex min-h-[84vh] flex-col justify-end gap-8 pb-16 pt-40 sm:min-h-[88vh] sm:pb-20"
      >
        <div className="max-w-4xl">
          <div style={{ animation: ENTRANCE, animationDelay: "80ms" }}>
            <Eyebrow tone="inverted">{brand.locationLabel}</Eyebrow>
          </div>
          <h1 className="font-display text-display-hero text-canvas">
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
            className="mt-6 max-w-md font-display text-display-md italic text-canvas/90"
            style={{ animation: ENTRANCE, animationDelay: "480ms" }}
          >
            {brand.tagline}
          </p>
        </div>

        <div
          className="pointer-events-auto flex flex-col gap-4 sm:flex-row"
          style={{ animation: ENTRANCE, animationDelay: "620ms" }}
        >
          <Button href="/koleksiyonlar" variant="primary" tone="inverted" icon data-cursor="Keşfet">
            Koleksiyonları Keşfet
          </Button>
          <Button href="/fiyatlar" variant="secondary" tone="inverted" data-cursor="Gör">
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
