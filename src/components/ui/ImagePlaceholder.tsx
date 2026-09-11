import { GemMotif } from "./GemMotif";

const CORNERS = [
  "left-1.5 top-1.5 border-l border-t",
  "right-1.5 top-1.5 border-r border-t",
  "left-1.5 bottom-1.5 border-l border-b",
  "right-1.5 bottom-1.5 border-r border-b",
];

/**
 * Gerçek fotoğraf/görsel gelene kadar kullanılan geçici görsel alanı.
 * Bilinçli olarak nötr tutulur: altın gradient, parlak efekt veya stok
 * "mücevher" ikonu yığını kullanılmaz — ama düz gri bir kutu da değil.
 * Editoryal bir "proof sheet" çerçevesi (köşe kırpma işaretleri) ve
 * markanın faset motifiyle (bkz. GemMotif) tutarlı, kasıtlı bir bekleme
 * durumu olarak tasarlandı (bkz. design-system/MASTER.md §13).
 *
 * Gerçek görsel eklenirken bu bileşenin yerine `next/image` ile aynı
 * `alt` metni kullanılmalıdır — bkz. ASSET_CHECKLIST.md.
 */
export function ImagePlaceholder({
  label,
  aspect = "aspect-[4/5]",
  className = "",
  showMotif = true,
}: {
  label: string;
  aspect?: string;
  className?: string;
  /** Hero gibi kendi (imleç-etkileşimli) motifini üstte gösteren nadir
   * durumlar için — çift motif görünmesini önler. Varsayılan: true. */
  showMotif?: boolean;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`group relative w-full overflow-hidden bg-surface-alt ${aspect} ${className}`.trim()}
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 50% 38%, rgb(var(--color-surface)) 0%, rgb(var(--color-surface-alt)) 62%, rgb(var(--color-border) / 0.4) 100%)",
      }}
    >
      {showMotif && (
        <>
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-[38%] h-2/5 w-2/5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 opacity-80 blur-2xl transition-opacity duration-700 ease-quiet group-hover:bg-accent/16"
          />
          <GemMotif
            gradient
            strokeWidth={0.55}
            className="absolute left-1/2 top-1/2 h-2/5 w-2/5 -translate-x-1/2 -translate-y-1/2 opacity-35 transition-[transform,opacity] duration-700 ease-quiet group-hover:scale-[1.05] group-hover:opacity-55"
          />
        </>
      )}

      <span aria-hidden="true" className="absolute inset-3 border border-border/60 sm:inset-4" />

      {CORNERS.map((pos) => (
        <span key={pos} aria-hidden="true" className={`absolute h-3 w-3 border-border/80 ${pos}`} />
      ))}

      <div className="absolute inset-x-4 bottom-3 flex items-center gap-2 sm:inset-x-5">
        <span className="h-px w-4 bg-border" aria-hidden="true" />
        <span className="text-body-sm text-ink-faint">{label}</span>
      </div>
    </div>
  );
}
